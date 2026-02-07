// Developer console root view.
const { useState } = window.React;
const { ChevronRight, Activity, BookOpen, ExternalLink, Database, Key, Bot, GitBranch } = window.LucideReact;
const { DashboardView, ConnectorsView, AgentsView, WorkflowsView, CredentialsView } = window.AppComponents;

const DEV_CONSOLE_MENUS = [
    { id: '대시보드', icon: Activity, label: '대시보드' },
    { id: '내 커넥터', icon: Database, label: '내 커넥터' },
    { id: '내 에이전트', icon: Bot, label: '내 에이전트' },
    { id: '내 워크플로우', icon: GitBranch, label: '내 워크플로우' },
    { id: '내 크리덴셜', icon: Key, label: '내 크리덴셜' },
];

        const DeveloperConsole = ({ setShowCreateModal, setSelectedItem }) => {
            const [activeMenu, setActiveMenu] = useState('대시보드');
            const renderSubContent = () => {
                switch(activeMenu) {
                    case '내 커넥터': return <ConnectorsView setSelectedItem={setSelectedItem} />;
                    case '내 에이전트': return <AgentsView setSelectedItem={setSelectedItem} />;
                    case '내 워크플로우': return <WorkflowsView setSelectedItem={setSelectedItem} />;
                    case '내 크리덴셜': return <CredentialsView setSelectedItem={setSelectedItem} />;
                    default: return <DashboardView setShowCreateModal={setShowCreateModal} />;
                }
            };
            return (
                <div className="flex flex-col md:flex-row gap-8 animate-in min-h-[600px] mt-8">
                    <aside className="w-full md:w-72 shrink-0">
                        <div className="bg-white rounded-[2rem] border-2 border-slate-200 p-4 shadow-sm sticky top-24">
                            <div className="text-xs font-bold text-slate-400 px-4 py-3 uppercase mb-2 tracking-widest">Menu</div>
                            <nav className="space-y-2">{DEV_CONSOLE_MENUS.map((item) => (<button key={item.id} onClick={() => setActiveMenu(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><item.icon size={20} className={activeMenu === item.id ? 'text-white' : 'text-slate-400'} strokeWidth={2.5}/>{item.label}{activeMenu === item.id && <ChevronRight size={16} className="ml-auto text-blue-200" strokeWidth={3}/>}</button>))}</nav>
                            <div className="mt-6 pt-6 border-t-2 border-slate-100 px-3 pb-2"><div className="bg-slate-900 rounded-3xl p-5 text-white relative overflow-hidden group cursor-pointer"><div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div><div className="flex items-center gap-2 mb-2 relative z-10"><BookOpen size={18} className="text-blue-400"/><div className="font-bold text-sm">개발자 가이드</div></div><p className="text-xs text-slate-400 mb-4 leading-relaxed font-normal relative z-10">NEXON Skills의 모든 기능을<br/>완벽하게 활용해보세요.</p><button className="w-full bg-white/10 hover:bg-white/20 text-xs py-2.5 rounded-xl transition-colors border border-white/10 font-bold flex items-center justify-center gap-1 relative z-10">문서 보기 <ExternalLink size={12}/></button></div></div>
                        </div>
                    </aside>
                    <section className="flex-1 min-w-0">{renderSubContent()}</section>
                </div>
            );
        };


// =================================================================================================

window.AppComponents.DeveloperConsole = DeveloperConsole;
