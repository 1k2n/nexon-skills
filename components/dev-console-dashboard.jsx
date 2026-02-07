// Developer console dashboard view.
const { Plus, Terminal } = window.LucideReact;

const DASHBOARD_STATS = [
    { label: '활성 서비스', value: '18', trend: '+3', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: '금일 API 호출', value: '142.5k', trend: '12%', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: '평균 응답 시간', value: '420ms', trend: '-50ms', color: 'bg-green-50 text-green-600 border-green-100' },
    { label: '예상 청구액', value: '₩125,000', trend: '₩12k', color: 'bg-orange-50 text-orange-600 border-orange-100' },
];

const DashboardView = ({ setShowCreateModal }) => (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end bg-white p-6 rounded-[32px] border-2 border-slate-100 shadow-sm">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Live Status</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">대시보드</h2>
                <p className="text-slate-500 font-medium mt-1">내 스킬들의 실시간 상태를 확인합니다.</p>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="game-btn bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-[0px_4px_0px_#1e40af] active:shadow-none active:translate-y-[4px]"><Plus size={20} strokeWidth={3} /> 빠른 스킬 생성</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {DASHBOARD_STATS.map((stat, i) => (
                <div key={i} className={`p-6 rounded-3xl border-2 ${stat.color} game-shadow hover:scale-105 transition-transform bg-white`}>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <div className="inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-lg bg-white/50 border border-black/5">
                        <span className="text-xs font-bold">▲ {stat.trend}</span>
                    </div>
                </div>
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

window.AppComponents.DashboardView = DashboardView;
