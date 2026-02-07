// Developer console connectors view.
const { useState } = window.React;
const { Search } = window.LucideReact;

const CONNECTORS = [
    { name: 'Nexon User Info', type: 'Private API', status: 'Active', endpt: '/api/v1/user' },
    { name: 'Maple Inventory', type: 'Sandbox API', status: 'Dev', endpt: '/sandbox/maple/inv' },
    { name: 'Slack Notifier', type: 'MCP', status: 'Active', endpt: 'mcp://slack-bot' },
    { name: 'Internal Wiki RAG', type: 'RAG', status: 'Indexing', endpt: 'vec://wiki-prod' },
    { name: 'Global Weather', type: 'Public API', status: 'Active', endpt: 'api.weather.com' },
    { name: 'Server Restart Cmd', type: 'NXCommand', status: 'Active', endpt: 'cmd://restart-server' },
];

const CONNECTOR_TABS = ['전체', 'MCP', 'RAG', 'Public API', 'Private API', 'Admin API', 'Sandbox API', 'NXCommand'];

const ConnectorsView = ({ setSelectedItem }) => {
    const [activeTab, setActiveTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = CONNECTORS.filter(c => (activeTab === '전체' || c.type === activeTab) && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h2 className="text-3xl font-bold text-slate-900">내 커넥터</h2><p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">MCP 및 RAG 기반의 차세대 연결 방식은 물론, 기존 API와 NXCommand 실행까지 지원합니다.<br className="hidden md:block"/> 파편화된 데이터 파이프라인을 단일 허브에서 통합 관리하세요.</p></div>
            <div className="relative"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} /><input type="text" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors" placeholder="커넥터 이름을 검색하세요..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="flex gap-2 overflow-x-auto pb-4 border-b-2 border-slate-100 no-scrollbar">{CONNECTOR_TABS.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>{tab}</button>))}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item, idx) => (
                    <div key={idx} onClick={() => setSelectedItem({ type: item.type, title: item.name, desc: `Endpoint: ${item.endpt}\nStatus: ${item.status}\n\n이 커넥터는 ${item.type} 타입으로, 안정적인 데이터 연결을 제공합니다.`, author: 'My Org', stars: 120 + idx })} className="bg-white p-6 rounded-3xl border-2 border-slate-100 game-shadow game-shadow-hover transition-all flex flex-col gap-4 cursor-pointer group">
                        <div className="flex justify-between items-start"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${item.type === 'MCP' ? 'bg-purple-100 text-purple-700 border-purple-200' : item.type === 'RAG' ? 'bg-orange-100 text-orange-700 border-orange-200' : item.type === 'NXCommand' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>{item.type}</span><div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${item.status === 'Active' ? 'bg-green-500' : 'bg-yellow-400'}`}></div></div>
                        <div><h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3><p className="text-xs text-slate-400 font-mono mt-1 truncate bg-slate-50 p-1.5 rounded-lg border border-slate-100">{item.endpt}</p></div>
                        <div className="mt-auto pt-4 border-t-2 border-slate-50 flex justify-end gap-2"><button className="px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-bold text-slate-500 hover:bg-slate-100">Config</button><button className="px-3 py-1.5 rounded-lg bg-blue-50 text-xs font-bold text-blue-600 hover:bg-blue-100">Test</button></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

window.AppComponents.ConnectorsView = ConnectorsView;
