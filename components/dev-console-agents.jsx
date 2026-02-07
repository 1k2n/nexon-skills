// Developer console agents view.
const { useState } = window.React;
const { Search, Settings } = window.LucideReact;

const AGENTS = [
    { name: 'CS Responder', vendor: 'Gemini', model: 'Gemini 3 Pro', status: 'Running' },
    { name: 'Data Analyst', vendor: 'Snowflake', model: 'Cortex Llama', status: 'Paused' },
    { name: 'Creative Writer', vendor: 'Claude', model: 'Claude 3.6 Opus', status: 'Running' },
    { name: 'Legacy Bot', vendor: 'Custom', model: 'In-house BERT', status: 'Stopped' },
];

const AGENT_TABS = ['전체', 'Custom', 'AI Studio', 'Gemini', 'Snowflake', 'ChatGPT', 'Claude'];

const AgentsView = ({ setSelectedItem }) => {
    const [activeTab, setActiveTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = AGENTS.filter(a => (activeTab === '전체' || a.vendor === activeTab) && a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h2 className="text-3xl font-bold text-slate-900">내 에이전트</h2><p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">직접 개발한 Custom 봇, AI 실험실의 창작물, 그리고 주요 벤더의 상용 에이전트까지.<br className="hidden md:block"/> 흩어져 있는 AI 도구를 한 곳에서 조회하고 제어할 수 있습니다.</p></div>
            <div className="relative"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} /><input type="text" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors" placeholder="에이전트 이름을 검색하세요..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="flex gap-2 overflow-x-auto pb-4 border-b-2 border-slate-100 no-scrollbar">{AGENT_TABS.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>{tab}</button>))}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item, idx) => (
                    <div key={idx} onClick={() => setSelectedItem({ type: 'Agent', title: item.name, desc: `Model: ${item.model}\nVendor: ${item.vendor}\nStatus: ${item.status}\n\n이 에이전트는 ${item.vendor}의 ${item.model} 모델을 기반으로 동작합니다.`, author: item.vendor, stars: 500 + idx * 10 })} className="bg-white p-6 rounded-3xl border-2 border-slate-100 game-shadow game-shadow-hover transition-all group cursor-pointer">
                        <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">{item.vendor === 'Gemini' ? '✨' : item.vendor === 'Claude' ? '🧠' : item.vendor === 'Snowflake' ? '❄️' : '🤖'}</div><div><h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3><p className="text-xs font-bold text-slate-400 mt-1">{item.vendor} • {item.model}</p></div></div>
                        <div className="flex justify-between items-center text-xs mt-2"><span className={`px-3 py-1 rounded-full font-bold border ${item.status === 'Running' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{item.status}</span><button className="text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-lg"><Settings size={16}/></button></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

window.AppComponents.AgentsView = AgentsView;
