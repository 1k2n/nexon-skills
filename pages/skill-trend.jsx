const { useState, useEffect, useCallback, useRef, useMemo } = window.React;
const { Clock, ExternalLink, RefreshCw, Globe, Rss, TrendingUp, AlertCircle, Search, ChevronRight, Loader2, Languages } = window.LucideReact;
const { NewsThumbnail, LoadingSpinner } = window.AppComponents;

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIG
// ═══════════════════════════════════════════════════════════════════

const CORS_PROXIES = [
    { name: 'rss2json',    build: (url) => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`, type: 'json' },
    { name: 'allorigins',  build: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, type: 'allorigins' },
    { name: 'corsproxy',   build: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`, type: 'raw' },
];

const RSS_FEEDS = [
    { url: 'https://news.google.com/rss/search?q=AI+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+%EB%A8%B8%EC%8B%A0%EB%9F%AC%EB%8B%9D&hl=ko&gl=KR&ceid=KR:ko', lang: '한국어' },
    { url: 'https://news.google.com/rss/search?q=artificial+intelligence+AI+machine+learning&hl=en&gl=US&ceid=US:en', lang: 'English' },
];

const CATEGORY_KEYWORDS = {
    'AI 모델':  /gpt|llm|claude|gemini|model|모델|파라미터|벤치마크|출시|release|launch|o[1-9]|sora|dall-e|midjourney|stable.diffusion|llama|mistral|anthropic|openai/i,
    '산업':     /기업|투자|인수|시장|매출|산업|company|market|invest|revenue|industry|nvidia|엔비디아|삼성|구글|google|microsoft|마이크로소프트|apple|meta|amazon|billion|deal|주가|stock/i,
    '스킬/도구': /tool|sdk|api|plugin|skill|agent|workflow|도구|플러그인|스킬|에이전트|copilot|cursor|vscode|framework|프레임워크|library|langchain|autogen/i,
    '커뮤니티':  /개발자|community|오픈소스|github|밋업|컨퍼런스|conference|meetup|hackathon|해커톤|developer|open.source|커뮤니티/i,
    '연구':     /연구|research|paper|논문|arxiv|breakthrough|발견|학회|training|fine.tun|rlhf|alignment|benchmark/i,
};

const CATEGORY_STYLES = {
    'AI 모델':   { pill: 'bg-indigo-50 text-indigo-700 border-indigo-200', color: 'indigo', thumb: 'Model Update' },
    '산업':      { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', color: 'emerald', thumb: 'Industry' },
    '스킬/도구':  { pill: 'bg-amber-50 text-amber-700 border-amber-200', color: 'amber', thumb: 'Tutorial' },
    '커뮤니티':   { pill: 'bg-rose-50 text-rose-700 border-rose-200', color: 'rose', thumb: 'Community' },
    '연구':      { pill: 'bg-violet-50 text-violet-700 border-violet-200', color: 'violet', thumb: 'Model Update' },
    'AI 일반':   { pill: 'bg-blue-50 text-blue-700 border-blue-200', color: 'blue', thumb: 'Industry' },
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

const categorize = (text) => {
    for (const [cat, regex] of Object.entries(CATEGORY_KEYWORDS)) {
        if (regex.test(text)) return cat;
    }
    return 'AI 일반';
};

const relativeTime = (dateStr) => {
    try {
        const diff = Date.now() - new Date(dateStr).getTime();
        const min = Math.floor(diff / 60000);
        if (min < 1) return '방금 전';
        if (min < 60) return `${min}분 전`;
        const hr = Math.floor(min / 60);
        if (hr < 24) return `${hr}시간 전`;
        const day = Math.floor(hr / 24);
        if (day < 7) return `${day}일 전`;
        return new Date(dateStr).toLocaleDateString('ko-KR');
    } catch { return dateStr; }
};

const cleanHTML = (html) =>
    (html || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();

// Extract first image URL from HTML string (Google News descriptions often contain <img> tags)
const extractImageFromHTML = (html) => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match?.[1] || null;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const MAX_AGE_DAYS = 30;

// ─── Translation helpers ───
const TRANS_CACHE_KEY = 'ai-news-trans-v1';
const getTransCache = () => { try { return JSON.parse(localStorage.getItem(TRANS_CACHE_KEY) || '{}'); } catch { return {}; } };
const saveTransCache = (c) => { try { const e = Object.entries(c); localStorage.setItem(TRANS_CACHE_KEY, JSON.stringify(e.length > 500 ? Object.fromEntries(e.slice(-300)) : c)); } catch {} };

const translateToKo = async (text) => {
    if (!text) return '';
    // Primary: Google Translate via CORS proxy
    try {
        const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(gtUrl)}`, { signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
            const data = await res.json();
            const result = data[0].map(s => s[0]).join('');
            if (result) return result;
        }
    } catch {}
    // Fallback: MyMemory API
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 500))}&langpair=en|ko`, { signal: controller.signal });
        clearTimeout(timer);
        const data = await res.json();
        if (data.responseStatus === 200 && data.responseData?.translatedText) return data.responseData.translatedText;
    } catch {}
    return '';
};

const translateEnglishNews = async (allNews) => {
    const cache = getTransCache();
    const enNews = allNews.filter(n => n.lang === 'English');
    const uncached = enNews.filter(n => !cache[n.title]);

    if (uncached.length > 0) {
        const results = await Promise.allSettled(uncached.map(n => translateToKo(n.title)));
        results.forEach((r, i) => {
            if (r.status === 'fulfilled' && r.value) cache[uncached[i].title] = r.value;
        });
        const descResults = await Promise.allSettled(uncached.map(n => translateToKo(n.description)));
        descResults.forEach((r, i) => {
            if (r.status === 'fulfilled' && r.value) cache[`d:${uncached[i].title}`] = r.value;
        });
        saveTransCache(cache);
    }

    enNews.forEach(n => {
        n.titleKo = cache[n.title] || '';
        n.descriptionKo = cache[`d:${n.title}`] || '';
    });
};

const parseRSSXml = (xml, feedInfo) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const cutoff = Date.now() - MAX_AGE_DAYS * 86400000;
    return Array.from(doc.querySelectorAll('item')).slice(0, 30).map(item => {
        const rawTitle = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const rawDate = new Date(pubDate);
        if (rawDate.getTime() < cutoff) return null;
        const rawDesc = item.querySelector('description')?.textContent || '';
        const imageUrl = extractImageFromHTML(rawDesc)
            || item.querySelector('enclosure')?.getAttribute('url')
            || item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')?.[0]?.getAttribute('url')
            || null;
        const desc = cleanHTML(rawDesc);
        const sourceEl = item.querySelector('source');
        const source = sourceEl?.textContent || '';
        const title = source ? rawTitle.replace(new RegExp(`\\s*[-–—]\\s*${escapeRegex(source)}\\s*$`), '') : rawTitle;
        const fullText = rawTitle + ' ' + desc;
        const category = categorize(fullText);
        return {
            title: title || rawTitle, link, pubDate, source, imageUrl,
            description: desc.substring(0, 280),
            category, lang: feedInfo.lang,
            time: relativeTime(pubDate), rawDate,
        };
    }).filter(Boolean);
};

// rss2json.com returns JSON directly — includes thumbnail/enclosure fields
const parseRss2Json = (json, feedInfo) => {
    const cutoff = Date.now() - MAX_AGE_DAYS * 86400000;
    return (json.items || []).slice(0, 30).map(item => {
        const rawTitle = item.title || '';
        const rawDate = new Date(item.pubDate);
        if (rawDate.getTime() < cutoff) return null;
        const rawContent = item.description || item.content || '';
        const imageUrl = item.thumbnail
            || item.enclosure?.link
            || extractImageFromHTML(rawContent)
            || null;
        const desc = cleanHTML(rawContent);
        const source = item.author || '';
        const title = source ? rawTitle.replace(new RegExp(`\\s*[-–—]\\s*${escapeRegex(source)}\\s*$`), '') : rawTitle;
        const fullText = rawTitle + ' ' + desc;
        const category = categorize(fullText);
        return {
            title: title || rawTitle, link: item.link || '', pubDate: item.pubDate || '', source, imageUrl,
            description: desc.substring(0, 280),
            category, lang: feedInfo.lang,
            time: relativeTime(item.pubDate), rawDate,
        };
    }).filter(Boolean);
};

// Try multiple CORS proxies in order until one succeeds
const fetchWithFallback = async (feed) => {
    for (const proxy of CORS_PROXIES) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(proxy.build(feed.url), { signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) continue;

            if (proxy.type === 'json') {
                const json = await res.json();
                if (json.status !== 'ok' || !json.items?.length) continue;
                return parseRss2Json(json, feed);
            }
            if (proxy.type === 'allorigins') {
                const json = await res.json();
                if (!json.contents) continue;
                return parseRSSXml(json.contents, feed);
            }
            // raw proxy
            const text = await res.text();
            if (!text || !text.includes('<item')) continue;
            return parseRSSXml(text, feed);
        } catch { continue; }
    }
    return [];
};

// ─── og:image extraction ───
const OG_CACHE_KEY = 'ai-news-ogimg-v1';
const getOgCache = () => { try { return JSON.parse(localStorage.getItem(OG_CACHE_KEY) || '{}'); } catch { return {}; } };
const saveOgCache = (c) => { try { const e = Object.entries(c); localStorage.setItem(OG_CACHE_KEY, JSON.stringify(e.length > 300 ? Object.fromEntries(e.slice(-200)) : c)); } catch {} };

const extractOgImage = async (url) => {
    if (!url) return null;
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) return null;
        const html = await res.text();
        // og:image or twitter:image
        const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i)
               || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
        return m?.[1] || null;
    } catch { return null; }
};

const fetchOgImages = async (articles, onUpdate) => {
    const cache = getOgCache();
    const needImage = articles.filter(n => !n.imageUrl && n.link);
    // Apply cached og:images immediately
    needImage.forEach(n => { if (cache[n.link]) n.imageUrl = cache[n.link]; });
    // Fetch uncached — limit to 15 articles, batches of 5
    const toFetch = needImage.filter(n => !n.imageUrl && !(n.link in cache)).slice(0, 15);
    if (toFetch.length === 0) return;
    for (let i = 0; i < toFetch.length; i += 5) {
        const batch = toFetch.slice(i, i + 5);
        const results = await Promise.allSettled(batch.map(n => extractOgImage(n.link)));
        results.forEach((r, j) => {
            const imgUrl = r.status === 'fulfilled' ? r.value : null;
            cache[batch[j].link] = imgUrl || '';
            if (imgUrl) batch[j].imageUrl = imgUrl;
        });
        saveOgCache(cache);
        if (onUpdate) onUpdate();
    }
};

const FALLBACK_NEWS = (window.AppData.NEWS_ITEMS || []).map(n => ({
    title: n.title, link: '', pubDate: '', source: 'NEXON Skills',
    description: n.content, category: categorize(n.title + ' ' + n.content),
    lang: '한국어', time: n.date, rawDate: new Date(),
}));

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const LiveBadge = () => (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-[11px] font-bold text-red-600 select-none">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        LIVE
    </span>
);

const CategoryPill = ({ category, size = 'sm' }) => {
    const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['AI 일반'];
    const sz = size === 'lg' ? 'px-3 py-1 text-[11px]' : 'px-2.5 py-0.5 text-[10px]';
    return <span className={`rounded-full font-bold border ${sz} ${style.pill}`}>{category}</span>;
};

const LangToggle = ({ value, onChange }) => (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
        {['전체', '한국어', 'English'].map(lang => (
            <button
                key={lang}
                onClick={() => onChange(lang)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    value === lang ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                {lang === '전체' && <Globe size={12} />}
                {lang}
            </button>
        ))}
    </div>
);

// Featured (hero) article card
const FeaturedCard = ({ item, onClick }) => {
    const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['AI 일반'];
    const [imgError, setImgError] = useState(false);
    const showImage = item.imageUrl && !imgError;
    const gradients = {
        indigo:  'from-indigo-400 to-indigo-600',
        emerald: 'from-emerald-400 to-emerald-600',
        amber:   'from-amber-400 to-amber-600',
        rose:    'from-rose-400 to-rose-600',
        violet:  'from-violet-400 to-violet-600',
        blue:    'from-blue-400 to-blue-600',
    };
    const grad = gradients[style.color] || gradients.blue;

    return (
        <div className="group cursor-pointer bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" onClick={onClick}>
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 shrink-0">
                    <div className={`h-52 lg:h-full min-h-[220px] bg-gradient-to-br ${grad} relative overflow-hidden flex items-center justify-center`}>
                        {showImage ? (
                            <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" onError={() => setImgError(true)} />
                        ) : (
                            <>
                                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
                                <TrendingUp size={80} className="text-white/30" strokeWidth={1.5} />
                            </>
                        )}
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                            {item.category}
                        </div>
                        {item.source && (
                            <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-medium text-white/90">
                                {item.source}
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-8 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <CategoryPill category={item.category} size="lg" />
                        <span className="px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-200">TOP</span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.lang}</span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </h3>
                    {item.titleKo && (
                        <p className="flex items-center gap-1.5 text-base text-slate-500 font-medium mt-1 mb-2">
                            <Languages size={14} className="text-blue-400 shrink-0" />
                            {item.titleKo}
                        </p>
                    )}
                    {!item.titleKo && <div className="mb-3" />}
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                        {item.descriptionKo || item.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                        {item.source && <><span>·</span><span>{item.source}</span></>}
                        <span className="ml-auto text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            원문 보기 <ExternalLink size={14} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Regular news card — shows real image when available, falls back to SVG thumbnail
const NewsCard = ({ item, onClick }) => {
    const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['AI 일반'];
    const [imgError, setImgError] = useState(false);
    const showImage = item.imageUrl && !imgError;
    return (
        <div className="group cursor-pointer relative hover:z-10" onClick={onClick}>
            {showImage ? (
                <div className={`aspect-video bg-slate-100 rounded-3xl mb-4 overflow-hidden relative border-2 border-slate-200 group-hover:scale-105 transition-transform duration-300`}>
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-800 uppercase tracking-wider shadow-sm border border-slate-100">{style.thumb}</div>
                </div>
            ) : (
                <NewsThumbnail category={style.thumb} />
            )}
            <div className="px-1">
                <div className="flex items-center gap-2 mb-2">
                    <CategoryPill category={item.category} />
                    <span className="text-[10px] text-slate-400 font-medium">{item.lang}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                </h3>
                {item.titleKo && (
                    <p className="flex items-start gap-1 text-[13px] text-slate-500 font-medium mt-1 mb-1.5 line-clamp-2">
                        <Languages size={12} className="text-blue-400 shrink-0 mt-0.5" />
                        {item.titleKo}
                    </p>
                )}
                {!item.titleKo && <div className="mb-2" />}
                <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
                    {item.descriptionKo || item.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                    <div className="flex items-center gap-2">
                        {item.source && <span className="hidden sm:inline truncate max-w-[120px]">{item.source}</span>}
                        <span className="flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={12} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const SkillTrend = ({ setSelectedItem }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('전체');
    const [langFilter, setLangFilter] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const intervalRef = useRef(null);

    // ── Fetch Logic ──
    const fetchNews = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true); else setLoading(true);
        setError(null);
        try {
            const results = await Promise.allSettled(
                RSS_FEEDS.map(feed => fetchWithFallback(feed))
            );
            const allNews = results
                .filter(r => r.status === 'fulfilled')
                .flatMap(r => r.value)
                .filter(n => n.title)
                // deduplicate by title
                .filter((n, i, arr) => arr.findIndex(x => x.title === n.title) === i)
                .sort((a, b) => b.rawDate - a.rawDate);

            if (allNews.length > 0) {
                // Apply cached translations + og:images immediately
                const tCache = getTransCache();
                const ogCache = getOgCache();
                allNews.filter(n => n.lang === 'English').forEach(n => {
                    n.titleKo = tCache[n.title] || '';
                    n.descriptionKo = tCache[`d:${n.title}`] || '';
                });
                allNews.forEach(n => {
                    if (!n.imageUrl && n.link && ogCache[n.link]) n.imageUrl = ogCache[n.link];
                });
                setNews(allNews);
                setLastUpdated(new Date());

                // Background: translations + og:images in parallel, progressive update
                const flush = () => setNews([...allNews]);
                Promise.all([
                    allNews.some(n => n.lang === 'English' && !n.titleKo)
                        ? translateEnglishNews(allNews).then(flush) : Promise.resolve(),
                    allNews.some(n => !n.imageUrl && n.link)
                        ? fetchOgImages(allNews, flush) : Promise.resolve(),
                ]).then(flush);
            } else {
                setNews(FALLBACK_NEWS);
                setError('라이브 피드를 불러올 수 없어 샘플 데이터를 표시합니다.');
            }
        } catch (e) {
            console.error('News fetch error:', e);
            setNews(FALLBACK_NEWS);
            setError('뉴스를 가져오는 중 오류가 발생했습니다. 샘플 데이터를 표시합니다.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
        intervalRef.current = setInterval(() => fetchNews(true), REFRESH_INTERVAL);
        return () => clearInterval(intervalRef.current);
    }, [fetchNews]);

    // ── Derived Data ──
    const categories = useMemo(() => {
        const cats = [...new Set(news.map(n => n.category))].sort();
        return ['전체', ...cats];
    }, [news]);

    const filteredNews = useMemo(() => {
        return news.filter(item => {
            if (categoryFilter !== '전체' && item.category !== categoryFilter) return false;
            if (langFilter !== '전체' && item.lang !== langFilter) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
                    || (item.titleKo || '').toLowerCase().includes(q) || (item.descriptionKo || '').toLowerCase().includes(q);
            }
            return true;
        });
    }, [news, categoryFilter, langFilter, searchQuery]);

    const featured = filteredNews[0];
    const rest = filteredNews.slice(1);

    // ── Handlers ──
    const handleClick = (item) => {
        if (item.link) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        } else {
            setSelectedItem({ type: 'News', title: item.title, desc: item.description, author: `${item.time} · ${item.source || 'NEXON Skills'}` });
        }
    };

    // ── Loading State ──
    if (loading) {
        return (
            <div className="space-y-8 animate-in">
                <div className="border-b-2 border-slate-200 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-bold text-slate-900">스킬 트렌드</h2>
                        <LiveBadge />
                    </div>
                    <p className="text-slate-500 text-lg font-medium">전 세계의 AI 뉴스를 실시간으로 수집하여 전달합니다.</p>
                </div>
                <LoadingSpinner text="최신 AI 뉴스를 불러오고 있습니다..." />
            </div>
        );
    }

    // ── Main Render ──
    return (
        <div className="space-y-6 animate-in">
            {/* ── Header ── */}
            <div className="border-b-2 border-slate-200 pb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-4xl font-bold text-slate-900">스킬 트렌드</h2>
                            <LiveBadge />
                        </div>
                        <p className="text-slate-500 text-lg font-medium">전 세계의 AI 뉴스를 실시간으로 수집하여 전달합니다.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pt-1">
                        {lastUpdated && (
                            <span className="text-xs text-slate-400 font-medium hidden md:block">
                                {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 업데이트
                            </span>
                        )}
                        <button
                            onClick={() => fetchNews(true)}
                            disabled={refreshing}
                            className={`p-2.5 rounded-xl border-2 transition-all ${refreshing ? 'bg-blue-50 border-blue-200 text-blue-500' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50'}`}
                            title="새로고침"
                        >
                            <RefreshCw size={20} strokeWidth={2.5} className={refreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                    <span className="text-sm text-amber-700 font-medium">{error}</span>
                </div>
            )}

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <LangToggle value={langFilter} onChange={setLangFilter} />

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 ${
                                categoryFilter === cat
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="뉴스 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors w-48"
                    />
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Rss size={14} /> {filteredNews.length}개의 뉴스</span>
                <span>·</span>
                <span>5분 간격 자동 새로고침</span>
            </div>

            {/* ── Featured Article ── */}
            {featured && <FeaturedCard item={featured} onClick={() => handleClick(featured)} />}

            {/* ── News Grid ── */}
            {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rest.map((item, i) => (
                        <NewsCard key={i} item={item} onClick={() => handleClick(item)} />
                    ))}
                </div>
            )}

            {/* ── Empty State ── */}
            {filteredNews.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">검색 결과가 없습니다</h3>
                    <p className="text-sm text-slate-500 mb-6">다른 필터나 검색어를 시도해 보세요.</p>
                    <button
                        onClick={() => { setCategoryFilter('전체'); setLangFilter('전체'); setSearchQuery(''); }}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                        필터 초기화
                    </button>
                </div>
            )}
        </div>
    );
};

window.AppComponents.SkillTrend = SkillTrend;
