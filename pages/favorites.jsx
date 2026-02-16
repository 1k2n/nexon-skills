const { Star, Plus } = window.LucideReact;
const { FAVORITES_ITEMS } = window.AppData;
const { SkillCard, EmptyStateCard } = window.AppComponents;

const FavoritesView = ({ setSelectedItem }) => {
    return (
        <div className="animate-in space-y-8">
            <div className="border-b-2 border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-yellow-100 rounded-3xl text-yellow-600 border-2 border-yellow-200 shadow-sm">
                        <Star size={32} className="fill-current" strokeWidth={2.5}/>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900">내 즐겨찾는 스킬 목록</h2>
                        <p className="text-slate-500 mt-2 font-medium">자주 사용하는 도구들을 한곳에서 모아보고 빠르게 실행하세요.</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FAVORITES_ITEMS.map((item, idx) => (
                    <SkillCard
                        key={idx}
                        item={item}
                        onClick={() => setSelectedItem(item)}
                        className="hover:shadow-[0px_8px_0px_rgba(0,0,0,0.1)] overflow-hidden"
                        showBookmark
                        footerRight={(
                            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                <Star size={14} className="fill-current" />
                                <span>{(item.stars / 1000).toFixed(1)}k</span>
                            </div>
                        )}
                    />
                ))}
                <EmptyStateCard
                    icon={Plus}
                    title="스킬 더 찾아보기"
                    description={<>홈 화면에서 별표를 눌러<br/>이곳에 추가해보세요.</>}
                />
            </div>
        </div>
    );
};

window.AppComponents.FavoritesView = FavoritesView;
