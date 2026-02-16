const { Clock } = window.LucideReact;
const { NEWS_ITEMS } = window.AppData;
const { NewsThumbnail, PageHeader } = window.AppComponents;

const SkillTrend = ({ setSelectedItem }) => {
    return (
        <div className="space-y-8 animate-in relative">
            <PageHeader title="스킬 트렌드" description="전 세계의 혁신적인 AI 소식을 선별하여 전달합니다." size="xl" borderBottom />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {NEWS_ITEMS.map((news, i) => (
                    <div key={i} className="group cursor-pointer relative hover:z-10" onClick={() => setSelectedItem({ type: 'News', title: news.title, desc: news.content, author: `${news.date} • NEXON Skills Editors` })}>
                        <NewsThumbnail category={news.category} />
                        <div className="px-2">
                            <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1"><Clock size={12}/> {news.date}</p>
                            <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{news.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

window.AppComponents.SkillTrend = SkillTrend;
