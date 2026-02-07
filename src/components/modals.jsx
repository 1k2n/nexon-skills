import React from 'https://esm.sh/react@18.2.0?dev';
import {
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
} from '../icons.js';

export const ItemDetailModal = ({ item, onClose, isLoggedIn, setShowLoginScreen }) => {
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
    switch(type) {
        case 'Agent': return 'bg-blue-500';
        case 'Connector': return 'bg-purple-500';
        case 'News': return 'bg-indigo-500';
        case 'Workflow': return 'bg-orange-500';
        default: return 'bg-slate-500';
    }
};

const getIcon = (type) => {
    switch(type) {
        case 'Agent': return '🤖';
        case 'Connector': return '🔗';
        case 'News': return '📰';
        case 'Workflow': return '⚡';
        default: return '📦';
    }
};

return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in" onClick={onClose}>
        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-4 border-slate-900" onClick={e => e.stopPropagation()}>
            <div className={`h-36 w-full ${getGradient(item.type)} relative overflow-hidden`}>
                 <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px'}}></div>
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
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200`}>
                                {item.type}
                            </span>
                            {item.type !== 'News' && <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-bold font-mono">v1.2.0</span>}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{item.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
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
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 game-btn"><Share2 size={24} strokeWidth={2.5}/></button>
                        <button className="p-3 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 game-btn"><Star size={24} strokeWidth={2.5}/></button>
                    </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-8">
                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-normal">
                        {item.desc}
                    </p>
                    {item.type !== 'News' && (
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200">
                            <span className="text-sm text-slate-400 font-normal">
                                ℹ️ 이 스킬을 장착하면 개발/운영 효율을 극대화할 수 있습니다. 
                                엔터프라이즈 보안 쉴드를 준수하며, 라이브 서비스 파이프라인과 완벽하게 통합됩니다.
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={handleActionClick}
                        className="game-btn flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-[0px_4px_0px_#1e40af] active:shadow-none active:translate-y-[4px] flex items-center justify-center gap-2 transition-all"
                    >
                        {item.type === 'Workflow' ? <Play size={20} fill="currentColor" strokeWidth={3}/> : item.type === 'News' ? <Share2 size={20} strokeWidth={3}/> : <Download size={20} strokeWidth={3}/>}
                        {item.type === 'News' ? '공유하기' : '스킬 장착하기'}
                    </button>
                    <button className="game-btn px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 shadow-[0px_4px_0px_#e2e8f0] active:shadow-none active:translate-y-[4px] transition-all">
                        {item.type === 'News' ? '원문 보기' : '매뉴얼 보기'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};

export const CreateSelectionModal = ({ onClose }) => (
<div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in" onClick={onClose}>
    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl overflow-hidden relative border-4 border-slate-900" onClick={e => e.stopPropagation()}>
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">새로운 스킬 제작</h2>
                    <p className="text-slate-500 mt-2 font-normal">생성할 스킬의 클래스를 선택하세요.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={28} className="text-slate-400" strokeWidth={3}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: '커넥터', icon: Database, desc: 'API, DB 등 외부 월드의 데이터 소스와 연결합니다.', color: 'bg-blue-50 text-blue-600 border-blue-200' },
                    { title: '에이전트', icon: Bot, desc: '목표를 이해하고 자율적으로 판단하여 복잡한 작업을 대행합니다.', color: 'bg-purple-50 text-purple-600 border-purple-200' },
                    { title: '워크플로우', icon: GitBranch, desc: '여러 스킬을 콤보로 연결하여 작업을 자동화합니다.', color: 'bg-orange-50 text-orange-600 border-orange-200' },
                ].map((opt, i) => (
                    <button key={i} className="game-btn group flex flex-col items-start p-6 rounded-3xl border-2 border-slate-100 hover:border-blue-500 shadow-sm hover:shadow-[0px_4px_0px_#3b82f6] transition-all text-left bg-white active:translate-y-1 active:shadow-none">
                        <div className={`p-4 rounded-2xl mb-4 border-2 ${opt.color}`}>
                            <opt.icon size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-600">{opt.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 font-normal">{opt.desc}</p>
                        <div className="mt-auto flex items-center text-sm font-bold text-slate-300 group-hover:text-blue-600 uppercase tracking-wide">
                            제작하기 <ArrowRight size={16} className="ml-1" strokeWidth={3}/>
                        </div>
                    </button>
                ))}
            </div>
        </div>
        <div className="bg-slate-50 p-4 border-t-2 border-slate-100 flex justify-end">
            <button onClick={onClose} className="text-slate-500 font-bold text-sm hover:text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors">취소</button>
        </div>
    </div>
</div>
);

export const LoginScreen = ({ onClose, onLogin }) => (
<div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative border-4 border-slate-900">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600"><X size={28} strokeWidth={3} /></button>
        <div className="p-10 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#1e40af] border-2 border-blue-600 text-white animate-bounce"><Lock className="w-10 h-10" strokeWidth={3} /></div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-500 mb-8 font-medium">서비스를 이용하려면 로그인이 필요합니다.<br/>(사내 계정으로 계속하기)</p>
            <form onSubmit={onLogin} className="space-y-4 text-left">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">아이디</label>
                    <input type="text" defaultValue="nexon_dev" className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">비밀번호</label>
                    <input type="password" defaultValue="********" className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"/>
                </div>
                <button type="submit" className="game-btn w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all transform shadow-[0px_4px_0px_#000] active:shadow-none active:translate-y-[4px] mt-4">로그인</button>
            </form>
            <div className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">Nexon Enterprise Authentication</div>
        </div>
    </div>
</div>
);

// =================================================================================================
// [SECTION 3] LAYOUT COMPONENTS (레이아웃 컴포넌트)
// =================================================================================================

