(() => {
const NexonSkills = window.NexonSkills || (window.NexonSkills = {});
const {
    ArrowRight,
    Bot,
    Database,
    Download,
    GitBranch,
    Lock,
    Play,
    Share2,
    Star,
    X,
} = NexonSkills.icons;

NexonSkills.components.ItemDetailModal = ({ item, onClose, isLoggedIn, setShowLoginScreen }) => {
    if (!item) return null;

    const handleActionClick = () => {
        if (!isLoggedIn) {
            onClose();
            setShowLoginScreen(true);
        } else {
            const action = item.type === 'News' ? '공유' : '적용';
            alert(`${item.title}을(를) ${action}합니다!`);
        }
    };

    const getGradient = (type) => {
        switch (type) {
            case 'Agent':
                return 'bg-blue-500';
            case 'Connector':
                return 'bg-purple-500';
            case 'News':
                return 'bg-indigo-500';
            case 'Workflow':
                return 'bg-orange-500';
            default:
                return 'bg-slate-500';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Agent':
                return '🤖';
            case 'Connector':
                return '🔗';
            case 'News':
                return '📰';
            case 'Workflow':
                return '⚡';
            default:
                return '📦';
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in" onClick={onClose}>
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-4 border-slate-900" onClick={(e) => e.stopPropagation()}>
                <div className={`h-36 w-full ${getGradient(item.type)} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                    <button onClick={onClose} className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm">
                        <X size={24} strokeWidth={3} />
                    </button>
                    <div className="absolute top-8 left-8">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,0.1)] p-2 flex items-center justify-center text-4xl border-4 border-slate-50 animate-float">
                            {getIcon(item.type)}
                        </div>
                    </div>
                </div>
                <div className="pt-14 px-8 pb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                                    {item.type}
                                </span>
                                {item.type !== 'News' && <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-bold font-mono">v1.2.0</span>}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{item.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {item.type === 'News' ? (
                                    <>
                                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{item.source}</span>
                                        {item.date && (
                                            <>
                                                <span>•</span>
                                                <span className="font-medium text-slate-500">{item.date}</span>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">@{item.author}</span>
                                        {item.stars !== undefined && (
                                            <>
                                                <span>•</span>
                                                <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                                    <Star size={16} fill="currentColor" strokeWidth={3} />
                                                    <span className="text-slate-600">{(item.stars / 1000).toFixed(1)}k Users</span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 game-btn"><Share2 size={24} strokeWidth={2.5} /></button>
                            <button className="p-3 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 game-btn"><Star size={24} strokeWidth={2.5} /></button>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-8">
                        <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-normal">
                            {item.desc}
                        </p>
                        {item.type === 'News' && item.url && (
                            <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
                                >
                                    원문 링크 바로가기
                                </a>
                            </div>
                        )}
                        {item.type !== 'News' && (
                            <div className="mt-6 border-t-2 border-dashed border-slate-200 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                                        <div className="text-xs font-semibold text-slate-400">Security</div>
                                        <div className="text-sm font-bold text-slate-700">Verified</div>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                                        <div className="text-xs font-semibold text-slate-400">Last Update</div>
                                        <div className="text-sm font-bold text-slate-700">2026.03</div>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                                        <div className="text-xs font-semibold text-slate-400">Category</div>
                                        <div className="text-sm font-bold text-slate-700">{item.type}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {item.type === 'Workflow' && (
                        <div className="mb-8">
                            <div className="text-sm font-bold text-slate-700 mb-3">워크플로우 단계</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[{ label: 'Trigger', icon: GitBranch }, { label: 'Process', icon: Bot }, { label: 'Output', icon: Database }].map((step) => (
                                    <div key={step.label} className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <step.icon size={18} className="text-slate-600" />
                                        </div>
                                        <div className="text-sm font-semibold text-slate-600">{step.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-3">
                        <button onClick={handleActionClick} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl font-bold game-btn shadow-[0px_3px_0px_#000] active:shadow-none active:translate-y-[3px]">
                            {item.type === 'News' ? <Share2 size={18} /> : <Play size={18} />} {item.type === 'News' ? '공유하기' : '바로 적용하기'}
                        </button>
                        {item.type !== 'News' && (
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl font-bold border-2 border-slate-200">
                                <Download size={18} /> 다운로드
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

NexonSkills.components.CreateSelectionModal = ({ onClose }) => {
    const options = [
        { title: 'AI Agent', desc: '여러 시스템을 넘나드는 작업 자동화', icon: Bot },
        { title: 'Workflow', desc: '작업 흐름을 설계하고 자동화', icon: GitBranch },
        { title: 'Connector', desc: '외부 서비스와 데이터를 연결', icon: Database },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden border-4 border-slate-900" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b-2 border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">새로운 스킬 만들기</h3>
                        <p className="text-sm text-slate-500">어떤 유형의 스킬을 제작할까요?</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {options.map((option) => (
                        <button key={option.title} className="w-full border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/40 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <option.icon size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-slate-800">{option.title}</div>
                                    <div className="text-xs text-slate-500">{option.desc}</div>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-400" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

NexonSkills.components.LoginScreen = ({ onClose, onLogin }) => (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border-4 border-slate-900">
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">로그인이 필요합니다</h3>
                <p className="text-sm text-slate-500 mb-6">NEXON Skills의 모든 기능을 사용하려면 로그인하세요.</p>
                <form onSubmit={onLogin} className="space-y-4">
                    <input type="text" placeholder="아이디" className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-300" />
                    <input type="password" placeholder="비밀번호" className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-300" />
                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold shadow-[0px_3px_0px_#000] active:shadow-none active:translate-y-[3px]">로그인</button>
                </form>
                <button onClick={onClose} className="mt-4 text-sm text-slate-400 hover:text-slate-600">나중에 하기</button>
            </div>
        </div>
    </div>
);
})();
