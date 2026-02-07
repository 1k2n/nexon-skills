// Developer console workflows view.
const { useState } = window.React;
const { Search, Layers, Play } = window.LucideReact;

const WORKFLOWS = [
    { name: 'Email Summary to Slack', nodes: 5, runs: 120, status: 'Active' },
    { name: 'Jira Issue Classifier', nodes: 12, runs: 450, status: 'Active' },
    { name: 'Weekly Report Generator', nodes: 8, runs: 4, status: 'Draft' },
];

const WorkflowsView = ({ setSelectedItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('전체');
    const filtered = WORKFLOWS.filter(wf => (activeFilter === '전체' || wf.status === activeFilter) && wf.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end"><div><h2 className="text-3xl font-bold text-slate-900">내 워크플로우</h2><p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">비주얼 빌더로 설계된 자동화 시나리오를 관리합니다. <br className="hidden md:block"/> 실시간 실행 테스트를 수행하고, 검증된 워크플로우를 조직 내 자산으로 배포하세요.</p></div><div className="flex gap-2 text-sm text-slate-500 bg-slate-100 p-1.5 rounded-xl shrink-0 border border-slate-200"><button onClick={() => setActiveFilter('전체')} className={`px-4 py-1.5 rounded-lg font-bold transition-all ${activeFilter === '전체' ? 'bg-white shadow-sm text-slate-900' : 'hover:text-slate-900'}`}>전체</button><button onClick={() => setActiveFilter('Active')} className={`px-4 py-1.5 rounded-lg font-bold transition-all ${activeFilter === 'Active' ? 'bg-white shadow-sm text-slate-900' : 'hover:text-slate-900'}`}>Active</button><button onClick={() => setActiveFilter('Draft')} className={`px-4 py-1.5 rounded-lg font-bold transition-all ${activeFilter === 'Draft' ? 'bg-white shadow-sm text-slate-900' : 'hover:text-slate-900'}`}>Draft</button></div></div>
            <div className="relative"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} /><input type="text" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors" placeholder="워크플로우 이름을 검색하세요..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((wf, idx) => (
                    <div key={idx} onClick={() => setSelectedItem({ type: 'Workflow', title: wf.name, desc: `Nodes: ${wf.nodes}\nRuns: ${wf.runs}\nStatus: ${wf.status}\n\n이 워크플로우는 ${wf.nodes}개의 노드로 구성되어 있으며, 총 ${wf.runs}회 실행되었습니다.`, author: 'Workflow Bot', stars: wf.runs })} className="bg-white border-2 border-slate-100 rounded-[2rem] p-0 overflow-hidden game-shadow game-shadow-hover transition-all cursor-pointer group">
                        <div className="h-36 bg-slate-50 relative p-4 flex items-center justify-center overflow-hidden border-b-2 border-slate-100 group-hover:bg-blue-50/50 transition-colors"><div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '16px 16px'}}></div><div className="flex items-center gap-3 relative z-10"><div className="w-10 h-10 bg-white rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold">Trigger</div><div className="w-6 h-1 bg-slate-300 rounded-full"></div><div className="w-10 h-10 bg-blue-500 rounded-xl shadow-sm border-2 border-blue-600 flex items-center justify-center text-white text-[10px] font-bold">LLM</div><div className="w-6 h-1 bg-slate-300 rounded-full"></div><div className="w-10 h-10 bg-white rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold">Act</div></div></div>
                        <div className="p-5"><div className="flex justify-between items-start mb-3"><h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{wf.name}</h3><div className={`w-3 h-3 rounded-full mt-1.5 border-2 border-white shadow-sm ${wf.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}></div></div><div className="flex items-center gap-4 text-xs text-slate-500 font-bold"><span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Layers size={14}/> {wf.nodes} Nodes</span><span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Play size={14}/> {wf.runs} Runs</span></div></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

window.AppComponents.WorkflowsView = WorkflowsView;
