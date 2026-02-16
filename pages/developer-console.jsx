const { useState, useEffect, useCallback, useRef } = window.React;
const {
    Activity, Plus, Settings, Play, Layers, Terminal,
    Database, Key, Bot, GitBranch, BookOpen, ExternalLink, ShieldCheck, Copy
} = window.LucideReact;
const {
    PageHeader, SectionCard, SidebarLayout, SidebarNav, SearchInput, FilterTabs, ToggleFilter,
    StatCard, StatusDot, GameButton, DataTable
} = window.AppComponents;

const DashboardView = ({ setShowCreateModal }) => (
    <div className="space-y-8 animate-fade-in">
        <SectionCard padding="p-6">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Live Status</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">대시보드</h2>
                    <p className="text-slate-500 font-medium mt-1">내 스킬들의 실시간 상태를 확인합니다.</p>
                </div>
                <GameButton onClick={() => setShowCreateModal(true)} color="blue" size="md">
                    <Plus size={20} strokeWidth={3} /> 빠른 스킬 생성
                </GameButton>
            </div>
        </SectionCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: '활성 서비스', value: '18', trend: '▲ +3', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { label: '금일 API 호출', value: '142.5k', trend: '▲ 12%', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { label: '평균 응답 시간', value: '420ms', trend: '▲ -50ms', color: 'bg-green-50 text-green-600 border-green-100' },
                { label: '예상 청구액', value: '₩125,000', trend: '▲ ₩12k', color: 'bg-orange-50 text-orange-600 border-orange-100' },
            ].map((stat, i) => (
                <StatCard key={i} label={stat.label} value={stat.value} trend={stat.trend} color={stat.color} />
            ))}
        </div>
        <div className="bg-slate-900 rounded-3xl border-4 border-slate-900 shadow-xl overflow-hidden text-white">
            <div className="px-6 py-4 border-b border-slate-700 font-bold text-sm flex items-center gap-2 bg-slate-800">
                <Terminal size={16} className="text-blue-400"/> 실시간 시스템 로그
            </div>
            <div className="p-6 text-sm font-mono text-slate-300 space-y-3 bg-slate-900">
                <div className="flex gap-4"><span className="text-slate-500 select-none">14:20:01</span> <span><span className="text-blue-400 font-bold">[INFO]</span> Agent "ReviewBot" deployed successfully.</span></div>
                <div className="flex gap-4"><span className="text-slate-500 select-none">14:18:42</span> <span><span className="text-green-400 font-bold">[SUCCESS]</span> Workflow "Daily Sync" completed in 2.4s.</span></div>
                <div className="flex gap-4"><span className="text-slate-500 select-none">14:15:10</span> <span><span className="text-yellow-400 font-bold">[WARN]</span> High latency detected in "Nexon OpenAPI".</span></div>
                <div className="flex gap-4 animate-pulse"><span className="text-slate-500 select-none">...</span></div>
            </div>
        </div>
    </div>
);

const ConnectorsView = ({ setSelectedItem }) => {
    const [activeTab, setActiveTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['전체', 'MCP', 'RAG', 'Public API', 'Private API', 'Admin API', 'Sandbox API', 'NXCommand'];
    const connectors = [
        { name: 'Nexon User Info', type: 'Private API', status: 'Active', endpt: '/api/v1/user' },
        { name: 'Maple Inventory', type: 'Sandbox API', status: 'Dev', endpt: '/sandbox/maple/inv' },
        { name: 'Slack Notifier', type: 'MCP', status: 'Active', endpt: 'mcp://slack-bot' },
        { name: 'Internal Wiki RAG', type: 'RAG', status: 'Indexing', endpt: 'vec://wiki-prod' },
        { name: 'Global Weather', type: 'Public API', status: 'Active', endpt: 'api.weather.com' },
        { name: 'Server Restart Cmd', type: 'NXCommand', status: 'Active', endpt: 'cmd://restart-server' },
    ];
    const filtered = connectors.filter(c => (activeTab === '전체' || c.type === activeTab) && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const getTypeBadgeColor = (type) => {
        if (type === 'MCP') return 'bg-purple-100 text-purple-700 border-purple-200';
        if (type === 'RAG') return 'bg-orange-100 text-orange-700 border-orange-200';
        if (type === 'NXCommand') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader title="내 커넥터" description={<>MCP 및 RAG 기반의 차세대 연결 방식은 물론, 기존 API와 NXCommand 실행까지 지원합니다.<br className="hidden md:block"/> 파편화된 데이터 파이프라인을 단일 허브에서 통합 관리하세요.</>} />
            <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="커넥터 이름을 검색하세요..." />
            <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item, idx) => (
                    <div key={idx} onClick={() => setSelectedItem({ type: item.type, title: item.name, desc: `Endpoint: ${item.endpt}\nStatus: ${item.status}\n\n이 커넥터는 ${item.type} 타입으로, 안정적인 데이터 연결을 제공합니다.`, author: 'My Org', stars: 120 + idx })} className="bg-white p-6 rounded-3xl border-2 border-slate-100 game-shadow game-shadow-hover transition-all flex flex-col gap-4 cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getTypeBadgeColor(item.type)}`}>{item.type}</span>
                            <StatusDot status={item.status === 'Active' ? 'active' : 'warning'} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                            <p className="text-xs text-slate-400 font-mono mt-1 truncate bg-slate-50 p-1.5 rounded-lg border border-slate-100">{item.endpt}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t-2 border-slate-50 flex justify-end gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-bold text-slate-500 hover:bg-slate-100">Config</button>
                            <button className="px-3 py-1.5 rounded-lg bg-blue-50 text-xs font-bold text-blue-600 hover:bg-blue-100">Test</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AgentsView = ({ setSelectedItem }) => {
    const [activeTab, setActiveTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['전체', 'Custom', 'AI Studio', 'Gemini', 'Snowflake', 'ChatGPT', 'Claude'];
    const agents = [
        { name: 'CS Responder', vendor: 'Gemini', model: 'Gemini 3 Pro', status: 'Running' },
        { name: 'Data Analyst', vendor: 'Snowflake', model: 'Cortex Llama', status: 'Paused' },
        { name: 'Creative Writer', vendor: 'Claude', model: 'Claude 3.6 Opus', status: 'Running' },
        { name: 'Legacy Bot', vendor: 'Custom', model: 'In-house BERT', status: 'Stopped' },
    ];
    const filtered = agents.filter(a => (activeTab === '전체' || a.vendor === activeTab) && a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader title="내 에이전트" description={<>직접 개발한 Custom 봇, AI 실험실에서 제작한 에이전트, 그리고 주요 벤더의 상용 에이전트까지.<br className="hidden md:block"/> 흩어져 있는 AI 도구를 한 곳에서 조회하고 제어할 수 있습니다.</>} />
            <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="에이전트 이름을 검색하세요..." />
            <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item, idx) => (
                    <div key={idx} onClick={() => setSelectedItem({ type: 'Agent', title: item.name, desc: `Model: ${item.model}\nVendor: ${item.vendor}\nStatus: ${item.status}\n\n이 에이전트는 ${item.vendor}의 ${item.model} 모델을 기반으로 동작합니다.`, author: item.vendor, stars: 500 + idx * 10 })} className="bg-white p-6 rounded-3xl border-2 border-slate-100 game-shadow game-shadow-hover transition-all group cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                {item.vendor === 'Gemini' ? '✨' : item.vendor === 'Claude' ? '🧠' : item.vendor === 'Snowflake' ? '❄️' : '🤖'}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                <p className="text-xs font-bold text-slate-400 mt-1">{item.vendor} • {item.model}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-2">
                            <span className={`px-3 py-1 rounded-full font-bold border ${item.status === 'Running' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{item.status}</span>
                            <button className="text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-lg"><Settings size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WorkflowsView = ({ setSelectedItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('전체');
    const workflows = [
        { name: 'Email Summary to Slack', nodes: 5, runs: 120, status: 'Active' },
        { name: 'Jira Issue Classifier', nodes: 12, runs: 450, status: 'Active' },
        { name: 'Weekly Report Generator', nodes: 8, runs: 4, status: 'Draft' },
    ];
    const filtered = workflows.filter(wf => (activeFilter === '전체' || wf.status === activeFilter) && wf.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <PageHeader title="내 워크플로우" description={<>비주얼 빌더로 설계된 자동화 시나리오를 관리합니다. <br className="hidden md:block"/> 실시간 실행 테스트를 수행하고, 검증된 워크플로우를 조직 내 자산으로 배포하세요.</>} />
                <ToggleFilter filters={['전체', 'Active', 'Draft']} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
            <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="워크플로우 이름을 검색하세요..." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((wf, idx) => (
                    <div key={idx} onClick={() => setSelectedItem({ type: 'Workflow', title: wf.name, desc: `Nodes: ${wf.nodes}\nRuns: ${wf.runs}\nStatus: ${wf.status}\n\n이 워크플로우는 ${wf.nodes}개의 노드로 구성되어 있으며, 총 ${wf.runs}회 실행되었습니다.`, author: 'Workflow Bot', stars: wf.runs })} className="bg-white border-2 border-slate-100 rounded-[2rem] p-0 overflow-hidden game-shadow game-shadow-hover transition-all cursor-pointer group">
                        <div className="h-36 bg-slate-50 relative p-4 flex items-center justify-center overflow-hidden border-b-2 border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '16px 16px'}}></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold">Trigger</div>
                                <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
                                <div className="w-10 h-10 bg-blue-500 rounded-xl shadow-sm border-2 border-blue-600 flex items-center justify-center text-white text-[10px] font-bold">LLM</div>
                                <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold">Act</div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{wf.name}</h3>
                                <StatusDot status={wf.status === 'Active' ? 'active' : 'inactive'} />
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                                <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Layers size={14}/> {wf.nodes} Nodes</span>
                                <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Play size={14}/> {wf.runs} Runs</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CredentialsView = ({ setSelectedItem }) => {
    const headers = [
        { label: 'Name' },
        { label: 'Key Prefix' },
        { label: 'Created' },
        { label: 'Last Used' },
        { label: 'Action', align: 'right' },
    ];
    const credentials = [
        { name: 'Prod API Key', prefix: 'nk_prod_...', created: '2025-01-10', used: 'Just now' },
        { name: 'Dev Test Key', prefix: 'nk_dev_...', created: '2025-02-15', used: '2 days ago' },
        { name: 'Legacy Key 2024', prefix: 'nk_old_...', created: '2024-11-20', used: 'Inactive' },
    ];
    const rows = credentials.map((key) => ({
        cells: [
            { content: (<span className="font-bold text-slate-900 flex items-center gap-3"><span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck size={18}/></span>{key.name}</span>) },
            { content: key.prefix, className: 'font-mono text-slate-500 font-medium bg-slate-50/50' },
            { content: key.created, className: 'text-slate-500 font-medium' },
            { content: key.used, className: 'text-slate-500 font-medium' },
            { content: (<button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-100 rounded-lg"><Copy size={18}/></button>) },
        ],
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader title="내 크리덴셜" />
            <DataTable
                headers={headers}
                rows={rows}
                onRowClick={(row, i) => {
                    const key = credentials[i];
                    setSelectedItem({ type: 'Credential', title: key.name, desc: `Prefix: ${key.prefix}\nCreated: ${key.created}\nLast Used: ${key.used}\n\n보안 키 정보입니다. 타인에게 노출되지 않도록 주의하세요.`, author: 'System', stars: 0 });
                }}
            />
            <div className="flex justify-end">
                <GameButton color="slate" size="md">새 키 발급받기</GameButton>
            </div>
        </div>
    );
};

const DeveloperConsole = ({ setShowCreateModal, setSelectedItem, currentTab }) => {
    const menuItems = [
        { id: '대시보드', icon: Activity, label: '대시보드' },
        { id: '내 커넥터', icon: Database, label: '내 커넥터' },
        { id: '내 에이전트', icon: Bot, label: '내 에이전트' },
        { id: '내 워크플로우', icon: GitBranch, label: '내 워크플로우' },
        { id: '내 크리덴셜', icon: Key, label: '내 크리덴셜' },
    ];
    const getMenuFromUrl = () => {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const menuParam = pathParts[1];
        if (!menuParam) { return menuItems[0]?.id ?? '대시보드'; }
        const decodedMenu = decodeURIComponent(menuParam);
        const isValidMenu = menuItems.some(item => item.id === decodedMenu);
        return isValidMenu ? decodedMenu : (menuItems[0]?.id ?? '대시보드');
    };
    const [activeMenu, setActiveMenu] = useState(() => getMenuFromUrl());
    const skipHistoryUpdate = useRef(false);

    useEffect(() => {
        const handlePopState = () => {
            const nextMenu = getMenuFromUrl();
            if (nextMenu === activeMenu) { return; }
            skipHistoryUpdate.current = true;
            setActiveMenu(nextMenu);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeMenu]);

    useEffect(() => {
        if (currentTab !== '개발자 콘솔') { return; }
        if (skipHistoryUpdate.current) {
            skipHistoryUpdate.current = false;
            return;
        }
        const url = new URL(window.location.href);
        const encodedTab = encodeURIComponent('개발자 콘솔');
        if (activeMenu === menuItems[0]?.id) {
            url.pathname = `/${encodedTab}`;
        } else {
            url.pathname = `/${encodedTab}/${encodeURIComponent(activeMenu)}`;
        }
        url.search = '';
        window.history.pushState({ tab: '개발자 콘솔', sub: activeMenu }, '', url);
    }, [activeMenu, currentTab, menuItems]);

    const renderSubContent = () => {
        switch(activeMenu) {
            case '내 커넥터': return <ConnectorsView setSelectedItem={setSelectedItem} />;
            case '내 에이전트': return <AgentsView setSelectedItem={setSelectedItem} />;
            case '내 워크플로우': return <WorkflowsView setSelectedItem={setSelectedItem} />;
            case '내 크리덴셜': return <CredentialsView setSelectedItem={setSelectedItem} />;
            default: return <DashboardView setShowCreateModal={setShowCreateModal} />;
        }
    };

    const sidebarFooter = (
        <div className="mt-6 pt-6 border-t-2 border-slate-100 px-3 pb-2">
            <div className="bg-slate-900 rounded-3xl p-5 text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <BookOpen size={18} className="text-blue-400"/>
                    <div className="font-bold text-sm">개발자 가이드</div>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed font-normal relative z-10">NEXON Skills의 모든 기능을<br/>완벽하게 활용해보세요.</p>
                <button className="w-full bg-white/10 hover:bg-white/20 text-xs py-2.5 rounded-xl transition-colors border border-white/10 font-bold flex items-center justify-center gap-1 relative z-10">문서 보기 <ExternalLink size={12}/></button>
            </div>
        </div>
    );

    return (
        <SidebarLayout
            sidebar={
                <SidebarNav
                    items={menuItems}
                    activeId={activeMenu}
                    onSelect={setActiveMenu}
                    header="Menu"
                    footer={sidebarFooter}
                />
            }
        >
            {renderSubContent()}
        </SidebarLayout>
    );
};

window.AppComponents.DashboardView = DashboardView;
window.AppComponents.ConnectorsView = ConnectorsView;
window.AppComponents.AgentsView = AgentsView;
window.AppComponents.WorkflowsView = WorkflowsView;
window.AppComponents.CredentialsView = CredentialsView;
window.AppComponents.DeveloperConsole = DeveloperConsole;
