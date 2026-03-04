const { useState, useEffect, useCallback, useRef } = window.React;
const { Gamepad2, ChevronDown, Search, ArrowRight, Star, Share2, X, Sparkles, Heart } = window.LucideReact;
const { HOME_INITIAL_ITEMS } = window.AppData;
const { SkillCard, LoadingSpinner } = window.AppComponents;

const HomePage = ({ selectedGame, setSelectedGame, gameList, showStickySearch, setSelectedItem, onNavigate }) => {
    const [items, setItems] = useState(HOME_INITIAL_ITEMS);
    const [isLoading, setIsLoading] = useState(false);
    const loadingRef = useRef(isLoading);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    useEffect(() => {
        loadingRef.current = isLoading;
    }, [isLoading]);

    const generateRandomItems = (count) => {
        const types = ['Agent', 'Connector', 'Workflow'];
        const titles = ['Super AI', 'Auto Notion', 'Slack Bot', 'Data Miner', 'Email Wiz', 'Code Fixer', 'Image Gen', 'Text Sum', 'Game Ops', 'Server Mon'];
        const descs = [
            '운영 효율을 극대화하는 패시브 스킬입니다.',
            '복잡한 데이터를 미니맵처럼 한눈에 파악하세요.',
            '반복 퀘스트를 자동화하여 개발 시간을 절약하세요.',
            '팀의 생산성 버프를 200% 향상시킵니다.',
            '강력한 AI 엔진을 장착했습니다.',
        ];
        const authors = ['Nexon_Dev', 'AI_Lab', 'AutomateIt', 'DevTeam_A', 'SoloDev', 'CreativeMinds'];

        return Array.from({ length: count }).map(() => ({
            type: types[Math.floor(Math.random() * types.length)],
            title: `${titles[Math.floor(Math.random() * titles.length)]} v${Math.floor(Math.random() * 10)}.0`,
            desc: descs[Math.floor(Math.random() * descs.length)],
            author: authors[Math.floor(Math.random() * authors.length)],
            stars: Math.floor(Math.random() * 5000) + 100,
        }));
    };

    const loadMore = useCallback(() => {
        if (loadingRef.current) return;
        setIsLoading(true);
        setTimeout(() => {
            const newItems = generateRandomItems(6);
            setItems(prev => [...prev, ...newItems]);
            setIsLoading(false);
        }, 800);
    }, []);

    useEffect(() => {
        if (activeSearch) return;
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 200 && !loadingRef.current) {
                loadMore();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore, activeSearch]);

    const handleSearch = () => {
        const query = searchQuery.trim();
        if (!query) return;
        setActiveSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const clearSearch = () => {
        setSearchQuery('');
        setActiveSearch('');
    };

    const filteredItems = activeSearch
        ? items.filter(item => {
            const q = activeSearch.toLowerCase();
            return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
        })
        : null;

    return (
        <div className="animate-in">
            <div className="text-center space-y-8 py-20 px-4 relative">
                {!activeSearch && (
                    <>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight drop-shadow-sm">
                            흩어진 AI 도구, <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">넥슨스킬로 연결하세요.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed font-normal">
                            개발과 운영의 난이도를 낮춰줄 AI 도구,<br className="hidden md:block"/> NEXON Skills에서 필요한 능력을{' '}
                            <span className="text-blue-600 font-bold bg-blue-50 px-2 rounded-lg border border-blue-100">파밍</span>하고{' '}
                            <span className="text-purple-600 font-bold bg-purple-50 px-2 rounded-lg border border-purple-100">장착</span>하세요.
                        </p>
                    </>
                )}
                <div className={`max-w-4xl mx-auto ${activeSearch ? 'mt-0' : 'mt-12'} relative z-10 transition-all duration-500 ease-in-out ${!activeSearch && showStickySearch ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white border-2 border-slate-200 rounded-[2rem] shadow-xl p-2.5 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all hover:scale-[1.01] hover:shadow-2xl">
                        <div className="relative px-2 md:pl-6 md:pr-2 border-b-2 md:border-b-0 md:border-r-2 border-slate-100 group flex items-center shrink-0 py-2 md:py-0">
                            <Gamepad2 className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none ml-2 md:ml-0" />
                            <select
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="w-full md:w-auto appearance-none bg-transparent font-bold text-slate-700 py-4 pl-3 pr-10 rounded-lg focus:outline-none cursor-pointer text-base hover:text-blue-600 transition-colors"
                            >
                                <option>전체 게임</option>
                                {gameList.map(game => <option key={game} value={game}>{game}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 md:right-2 w-4 h-4 text-slate-400 pointer-events-none" strokeWidth={3} />
                        </div>
                        <div className="flex-1 relative flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-400" strokeWidth={3} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="block w-full pl-16 pr-12 py-4 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-lg font-medium"
                                placeholder="소환하고 싶은 커넥터, 에이전트, 워크플로우를 검색하세요..."
                            />
                            {searchQuery && (
                                <button onClick={clearSearch} className="absolute right-2 p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                            <button onClick={handleSearch} className="md:hidden absolute right-2 p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                        <button onClick={handleSearch} className="hidden md:block px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-colors shadow-lg shrink-0 ml-2 text-lg active:scale-95">
                            검색
                        </button>
                    </div>
                    {!activeSearch && (
                        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500 font-medium">
                            <span>인기 스킬북:</span>
                            {['노션 연동', '데이터 분석', '마케팅 자동화', '코드 리뷰'].map((tag) => (
                                <button key={tag} onClick={() => { setSearchQuery(tag); setActiveSearch(tag); }} className="hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors border border-transparent hover:border-blue-100">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Results */}
            {activeSearch && (
                <div className="max-w-7xl mx-auto px-4 pb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">'{activeSearch}' 검색 결과</h2>
                        <p className="text-slate-400 mt-1">선택한 필터에 해당하는 에이전트와 커넥터를 한 번에 확인해보세요</p>
                    </div>
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map((item, idx) => (
                                <SkillCard
                                    key={idx}
                                    item={item}
                                    onClick={() => setSelectedItem(item)}
                                    headerRight={(
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                                            <Star size={14} className="fill-slate-200 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-colors" strokeWidth={2.5} />
                                            <span className="text-xs">{(item.stars / 1000).toFixed(1)}k</span>
                                        </div>
                                    )}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <p className="text-slate-400 text-lg mb-6">해당 조건에 맞는 항목이 없습니다.</p>
                            <button
                                onClick={() => onNavigate && onNavigate('AI 실험실')}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-2xl text-slate-600 font-semibold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Sparkles size={18} />
                                Nexon Skills 도우미에게 '{activeSearch}' 검색 부탁하기
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Default Home Content */}
            {!activeSearch && (
                <div className="max-w-7xl mx-auto px-4 mt-12 pb-24">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">🔥 지금 뜨는 인기 스킬</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item, idx) => (
                            <SkillCard
                                key={idx}
                                item={item}
                                onClick={() => setSelectedItem(item)}
                                headerRight={(
                                    <div className="flex items-center gap-2">
                                        <Share2 size={16} className="text-slate-300 hover:text-slate-500 transition-colors cursor-pointer" />
                                        <Heart size={16} className="text-red-300 hover:text-red-500 hover:fill-red-500 transition-colors cursor-pointer" />
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                    {isLoading && <LoadingSpinner text="더 많은 스킬을 소환하는 중..." />}
                </div>
            )}
        </div>
    );
};

window.AppComponents.HomePage = HomePage;
