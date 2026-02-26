const { useMemo, useRef, useState, useCallback } = window.React;
const {
    Sparkles, Bot, Workflow, Braces, Check, PlayCircle, Clipboard, X, FileText,
    ChevronRight, Cpu, Layers, Code, Package, Zap, Activity, GitBranch, Terminal,
    FlaskConical, Loader2, CheckCircle2, Database, Mail, MessageSquare, Play,
    ExternalLink, Search, Eye, RotateCcw, ArrowRight, ArrowLeft, Settings2, Hash,
    Shield, AlertCircle, Maximize2, Info, Lock
} = window.LucideReact;
const {
    SectionCard, FullScreenPanel, PanelToolbar, TypeBadge, GameButton, SecondaryButton,
    Badge, SKILL_TYPE_STYLES
} = window.AppComponents;

const AILab = () => {
    const [masterPrompt, setMasterPrompt] = useState(
        '오늘 시작한 "설맞이 일일 퀘스트" 의 매출 효과를 일별로 분석하고, 그 기간동안의 동접 변화를 추적하고, 전날 결과를 취합해서 매일 아침 9시에 기획팀 메일과 슬랙 채널에 쏴줘.'
    );
    const [phase, setPhase] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showYamlView, setShowYamlView] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showFullCanvas, setShowFullCanvas] = useState(false);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [executedNodes, setExecutedNodes] = useState(new Set());
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [fullCanvasOffset, setFullCanvasOffset] = useState({ x: 0, y: 0 });
    const [isFullPanning, setIsFullPanning] = useState(false);
    const [fullSelectedNode, setFullSelectedNode] = useState(null);
    const panStartRef = useRef({ x: 0, y: 0 });
    const fullPanStartRef = useRef({ x: 0, y: 0 });

    /* ─── Orchestrator decomposition ─── */
    const orchestratorSteps = useMemo(() => [
        { label: '의도 파악', detail: '매출 효과 분석 + 동접 변화 추적 + 일일 보고 자동화', icon: Search },
        { label: '파라미터 추출', detail: '이벤트="설맞이 일일 퀘스트", 기간=시작~현재, 스케줄=매일 09:00 KST', icon: Braces },
        { label: '스킬 검색 · 매칭', detail: '넥슨스킬즈 카탈로그에서 7개 스킬 매칭 (5 카탈로그 + 1 인스턴트 + 1 감사)', icon: Package },
        { label: 'DIFY YAML 생성', detail: '워크플로우 그래프 · 환경변수 · 스케줄 구성 완료', icon: Code },
    ], []);

    /* ─── Skill type colors ─── */
    const typeColors = SKILL_TYPE_STYLES;
    const typeNodeBorder = {
        Agent: { idle: 'border-blue-200 hover:border-blue-300', done: 'border-blue-300 bg-blue-50/60' },
        Connector: { idle: 'border-purple-200 hover:border-purple-300', done: 'border-purple-300 bg-purple-50/60' },
        Workflow: { idle: 'border-orange-200 hover:border-orange-300', done: 'border-orange-300 bg-orange-50/60' },
    };

    /* ─── Planned skills (with permissions) ─── */
    const plannedSkills = useMemo(() => ([
        {
            id: 'node_0', phase: 'plan', skill: 'normalize_kpi_request',
            skillName: 'KPI Planner', skillType: 'Agent',
            route: 'skills://planner-router',
            output: 'analysis_window=2026-02-13~2026-02-19',
            origin: 'catalog', originLabel: '넥슨스킬즈 라이브러리',
            catalogId: 'NS-AG-0042',
            detail: '유저 입력을 KPI 쿼리/기간/채널 파라미터로 정규화합니다.',
            icon: Cpu,
            permissions: [
                { name: 'KPI 쿼리 실행', scope: 'kpi.query.execute', status: 'granted' },
                { name: '스케줄 설정 접근', scope: 'schedule.config', status: 'granted' },
            ],
        },
        {
            id: 'node_1', phase: 'execute', skill: 'daily_revenue_impact_search',
            skillName: 'AI 서치 에이전트', skillType: 'Agent',
            route: 'skills:ai-search-agent',
            output: '일매출 +8.4 %, 퀘스트 기여매출 1.98억 원',
            origin: 'catalog', originLabel: '넥슨스킬즈 라이브러리',
            catalogId: 'NS-AG-0108',
            detail: '매출 로그와 이벤트 테이블을 탐색해 일별 영향도를 계산합니다.',
            icon: Database,
            permissions: [
                { name: '매출 데이터 읽기', scope: 'revenue.data.read', status: 'granted' },
                { name: '이벤트 테이블 접근', scope: 'event.table.access', status: 'granted' },
            ],
        },
        {
            id: 'node_2', phase: 'execute', skill: 'ccu_variation_tracking',
            skillName: 'NEMO RT 에이전트', skillType: 'Connector',
            route: 'skills:nemort-agent',
            output: '평균 동접 +11.7 %, 피크 동접 +14.2 %',
            origin: 'catalog', originLabel: '넥슨스킬즈 라이브러리',
            catalogId: 'NS-CN-0033',
            detail: 'CCU 스트림을 추적해서 평균/피크 변동량을 산출합니다.',
            icon: Activity,
            permissions: [
                { name: '실시간 CCU 스트림', scope: 'ccu.stream.realtime', status: 'pending' },
                { name: 'NEMO 플랫폼 API', scope: 'nemo.platform.api', status: 'pending' },
            ],
        },
        {
            id: 'node_5', phase: 'merge', skill: 'merge_daily_kpi',
            skillName: 'Daily KPI Joiner', skillType: 'Workflow',
            route: 'skills://runtime/instant-merge-kpi',
            output: '전날 종합 브리프(JSON) 생성 완료',
            origin: 'instant', originLabel: '인스턴트 스킬 (자동 생성)',
            catalogId: null,
            detail: '이번 실행에서만 생성된 임시 스킬. 매출/동접 결과를 브리프 포맷으로 병합합니다.',
            icon: GitBranch,
            permissions: [
                { name: '인스턴트 스킬 생성', scope: 'instant.skill.create', status: 'auto' },
                { name: '임시 저장소 쓰기', scope: 'temp.storage.write', status: 'auto' },
            ],
        },
        {
            id: 'node_3', phase: 'deliver', skill: 'compose_email_digest',
            skillName: 'Email Summary', skillType: 'Connector',
            route: 'skills:email-summary',
            output: '기획팀 메일 발송 성공 (09:00 KST)',
            origin: 'catalog', originLabel: '넥슨스킬즈 라이브러리',
            catalogId: 'NS-CN-0077',
            detail: '브리프를 이메일 템플릿으로 렌더링해 예약 발송합니다.',
            icon: Mail,
            permissions: [
                { name: '이메일 발송', scope: 'email.send', status: 'granted' },
                { name: '수신자 목록 읽기', scope: 'recipients.list.read', status: 'granted' },
            ],
        },
        {
            id: 'node_4', phase: 'deliver', skill: 'publish_slack_digest',
            skillName: 'Slack Notifier', skillType: 'Connector',
            route: 'skills:slack-notifier',
            output: '#planning-daily 채널 전송 성공 (09:00 KST)',
            origin: 'catalog', originLabel: '넥슨스킬즈 라이브러리',
            catalogId: 'NS-CN-0091',
            detail: '브리프 요약을 슬랙 채널 카드 메시지 형태로 게시합니다.',
            icon: MessageSquare,
            permissions: [
                { name: 'Slack Webhook', scope: 'slack.webhook', status: 'pending' },
                { name: '채널 메시지 쓰기', scope: 'slack.channel.write', status: 'pending' },
            ],
        },
        {
            id: 'node_6', phase: 'audit', skill: 'archive_delivery_status',
            skillName: 'Delivery Audit', skillType: 'Agent',
            route: 'skills://ops-audit-log',
            output: 'delivery_id=DLV-20260220-090001',
            origin: 'catalog', originLabel: '넥슨스킬즈 라이브러리',
            catalogId: 'NS-AG-0156',
            detail: '각 전송 결과를 감사 로그 저장소에 기록합니다.',
            icon: FileText,
            permissions: [
                { name: '감사 로그 쓰기', scope: 'audit.log.write', status: 'granted' },
                { name: '전송 이력 접근', scope: 'delivery.history.access', status: 'granted' },
            ],
        },
    ]), []);

    /* ─── Permission summary ─── */
    const totalPermissions = useMemo(() => plannedSkills.reduce((sum, s) => sum + s.permissions.length, 0), [plannedSkills]);
    const grantedPermissions = useMemo(() => plannedSkills.reduce((sum, s) => sum + s.permissions.filter(p => p.status === 'granted' || p.status === 'auto').length, 0), [plannedSkills]);
    const pendingPermissions = totalPermissions - grantedPermissions;

    const edges = useMemo(() => ([
        ['node_0', 'node_1'], ['node_0', 'node_2'],
        ['node_1', 'node_5'], ['node_2', 'node_5'],
        ['node_5', 'node_3'], ['node_5', 'node_4'],
        ['node_3', 'node_6'], ['node_4', 'node_6'],
    ]), []);

    const nodePositions = useMemo(() => ({
        node_0: { x: 80, y: 130 }, node_1: { x: 380, y: 40 }, node_2: { x: 380, y: 230 },
        node_5: { x: 680, y: 130 }, node_3: { x: 980, y: 40 }, node_4: { x: 980, y: 230 },
        node_6: { x: 1280, y: 130 },
    }), []);

    /* ─── DIFY YAML ─── */
    const difyYaml = useMemo(() => {
        const nodesYaml = plannedSkills.map((item) => [
            `  - id: ${item.id}`, '    data:', '      type: custom',
            `      title: "${item.skillName}"`, `      desc: "${item.detail}"`,
            `      skill: "${item.route}"`, `      nexon_catalog_id: "${item.catalogId || 'instant'}"`,
            `      skill_type: "${item.skillType}"`, '      selected: false', '      variables: []',
            '    position:', `      x: ${nodePositions[item.id].x}`, `      y: ${nodePositions[item.id].y}`,
        ].join('\n')).join('\n');
        const edgeYaml = edges.map(([source, target]) => [
            `  - id: edge_${source}_${target}`, `    source: ${source}`, `    target: ${target}`, '    type: custom',
        ].join('\n')).join('\n');
        return [
            'app:', '  mode: workflow', '  name: "설맞이 일일 퀘스트 매출/동접 자동 브리핑"',
            '  orchestrator: nexon-skills-prompt-orchestrator', 'kind: app', 'version: 0.2.0',
            'workflow:', '  conversation_variables: []', '  environment_variables:',
            '    - name: REPORT_CRON', '      value: "0 9 * * *"',
            '    - name: TARGET_EMAIL', '      value: "planning-team@nexon.com"',
            '    - name: TARGET_SLACK_CHANNEL', '      value: "#planning-daily"',
            '    - name: NEXON_SKILLS_API', '      value: "https://skills.nexon.com/api/v1"',
            '  graph:', '    nodes:', nodesYaml, '    edges:', edgeYaml,
        ].join('\n');
    }, [plannedSkills, nodePositions, edges]);

    /* ─── Execution logs ─── */
    const executionLogs = useMemo(() => {
        const ts = new Date().toLocaleString('ko-KR');
        return [
            { tag: 'orchestrator', msg: `실행 요청 수신 — ${ts}` },
            { tag: 'phase-1', msg: '오케스트레이터 분석 시작: 자연어 → 의도/파라미터/스킬 매핑' },
            { tag: 'phase-1', msg: '분석 기간 확정: 2026-02-13 ~ 2026-02-19 (전날 집계 기준 02-19)' },
            { tag: 'phase-1', msg: '넥슨스킬즈 카탈로그 검색: 7개 스킬 매칭 (5 catalog + 1 instant + 1 audit)' },
            { tag: 'phase-1', msg: 'DIFY YAML 워크플로우 그래프 생성 완료' },
            { tag: 'node_0', msg: '[KPI Planner] 쿼리/스케줄/발송 타겟 구성 완료' },
            { tag: 'parallel', msg: 'node_1(AI 서치 에이전트) + node_2(NEMO RT 에이전트) 병렬 실행' },
            { tag: 'node_1', msg: '[AI 서치 에이전트] 일매출 분석 → 총매출 23.6억(+8.4 %), 퀘스트 기여 1.98억' },
            { tag: 'node_2', msg: '[NEMO RT 에이전트] 동접 추적 → 평균 12.4만(+11.7 %), 피크 18.2만(+14.2 %)' },
            { tag: 'node_5', msg: '[Daily KPI Joiner] 인스턴트 스킬 생성/실행 → daily_brief_2026-02-19.json' },
            { tag: 'parallel', msg: 'node_3(Email Summary) + node_4(Slack Notifier) 병렬 실행' },
            { tag: 'node_3', msg: '[Email Summary] planning-team@nexon.com 전송 완료 (09:00:02 KST)' },
            { tag: 'node_4', msg: '[Slack Notifier] #planning-daily 전송 완료 (msg_ts=1771574402.332100)' },
            { tag: 'node_6', msg: '[Delivery Audit] 감사 로그 저장 → delivery_id=DLV-20260220-090001' },
            { tag: 'router', msg: '전체 워크플로우 상태: SUCCESS — 소요 시간 4.2s' },
        ];
    }, []);

    /* ─── Phase transitions ─── */
    const handleAnalyze = useCallback(() => {
        setPhase(1); setExecutedNodes(new Set()); setAnalysisProgress(0);
        let step = 0;
        const timer = setInterval(() => {
            step++; setAnalysisProgress(step);
            if (step >= 4) { clearInterval(timer); setTimeout(() => setPhase(2), 400); }
        }, 500);
    }, []);

    const handleExecute = useCallback(() => {
        setPhase(3);
        const order = ['node_0', 'node_1', 'node_2', 'node_5', 'node_3', 'node_4', 'node_6'];
        order.forEach((nodeId, idx) => {
            setTimeout(() => {
                setExecutedNodes(prev => new Set([...prev, nodeId]));
                if (idx === order.length - 1) setTimeout(() => setPhase(4), 400);
            }, (idx + 1) * 550);
        });
    }, []);

    const handleReset = useCallback(() => {
        setPhase(0); setExecutedNodes(new Set()); setAnalysisProgress(0);
        setSelectedNode(null); setShowYamlView(false); setCanvasOffset({ x: 0, y: 0 });
        setShowFullCanvas(false); setFullSelectedNode(null); setFullCanvasOffset({ x: 0, y: 0 });
    }, []);

    /* ─── Inline canvas pan ─── */
    const handleCanvasMouseDown = (e) => {
        if (e.target.closest('[data-node-card="true"]')) return;
        setIsPanning(true);
        panStartRef.current = { x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y };
    };
    const handleCanvasMouseMove = (e) => {
        if (!isPanning) return;
        setCanvasOffset({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
    };
    const handleCanvasMouseUp = () => setIsPanning(false);

    /* ─── Fullscreen canvas pan ─── */
    const handleFullCanvasMouseDown = (e) => {
        if (e.target.closest('[data-node-card="true"]')) return;
        setIsFullPanning(true);
        fullPanStartRef.current = { x: e.clientX - fullCanvasOffset.x, y: e.clientY - fullCanvasOffset.y };
    };
    const handleFullCanvasMouseMove = (e) => {
        if (!isFullPanning) return;
        setFullCanvasOffset({ x: e.clientX - fullPanStartRef.current.x, y: e.clientY - fullPanStartRef.current.y });
    };
    const handleFullCanvasMouseUp = () => setIsFullPanning(false);

    const handleCopyYaml = async () => {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(difyYaml);
            setIsCopied(true); setTimeout(() => setIsCopied(false), 1800);
        }
    };

    /* ─── Phase helpers (updated) ─── */
    const phaseSteps = [
        { num: 1, label: '오케스트레이터 분석', icon: Sparkles, color: 'violet' },
        { num: 2, label: '스킬 매칭 · 권한 확인', icon: Shield, color: 'amber' },
        { num: 3, label: '워크플로우 편집 · 실행', icon: Layers, color: 'blue' },
    ];
    const phaseStatus = (n) => {
        if (n === 1) return phase >= 2 ? 'done' : phase === 1 ? 'active' : 'idle';
        if (n === 2) return phase >= 2 ? 'done' : 'idle';
        if (n === 3) return phase >= 4 ? 'done' : phase === 3 ? 'active' : phase >= 2 ? 'ready' : 'idle';
        return 'idle';
    };
    const tagColor = (tag) => {
        if (tag === 'orchestrator' || tag === 'router') return 'bg-violet-100 text-violet-700 border-violet-200';
        if (tag.startsWith('phase-1')) return 'bg-violet-50 text-violet-600 border-violet-200';
        if (tag === 'parallel') return 'bg-amber-50 text-amber-700 border-amber-200';
        return 'bg-slate-100 text-slate-600 border-slate-200';
    };
    const permissionStatusStyle = (status) => {
        if (status === 'granted') return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: '승인됨' };
        if (status === 'auto') return { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: '자동 부여' };
        return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: '신청 필요' };
    };

    /* ─── Canvas edge/node renderers ─── */
    const renderCanvasEdges = (offset) => edges.map(([source, target]) => {
        const s = nodePositions[source]; const t = nodePositions[target];
        if (!s || !t) return null;
        const startX = s.x + 220, startY = s.y + 48, endX = t.x, endY = t.y + 48;
        const ctrl = Math.max(80, (endX - startX) * 0.4);
        const bothDone = executedNodes.has(source) && executedNodes.has(target);
        const sourceSkill = plannedSkills.find(sk => sk.id === source);
        const baseColor = bothDone ? '#10B981' : sourceSkill?.skillType === 'Agent' ? '#3B82F6' : sourceSkill?.skillType === 'Connector' ? '#8B5CF6' : '#F59E0B';
        return <path key={`${source}-${target}`} d={`M ${startX} ${startY} C ${startX + ctrl} ${startY}, ${endX - ctrl} ${endY}, ${endX} ${endY}`} stroke={baseColor} strokeWidth="2.5" strokeOpacity={bothDone ? '0.7' : '0.35'} strokeDasharray={bothDone ? '' : '6 4'} />;
    });

    const renderCanvasNodes = (onNodeClick) => plannedSkills.map((item) => {
        const pos = nodePositions[item.id]; if (!pos) return null;
        const Icon = item.icon;
        const isExecuted = executedNodes.has(item.id);
        const tBorder = typeNodeBorder[item.skillType] || typeNodeBorder.Agent;
        return (
            <button key={item.id} data-node-card="true" type="button" onClick={() => onNodeClick(item)}
                className={`absolute text-left border-2 rounded-2xl p-3 w-[220px] shadow-sm hover:shadow-lg transition-all duration-300 group ${isExecuted ? tBorder.done : 'bg-white ' + tBorder.idle}`}
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}>
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isExecuted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {isExecuted ? <Check size={14}/> : <Icon size={14}/>}
                    </div>
                    <div className="flex-1 min-w-0"><div className="font-bold text-xs text-slate-800 truncate">{item.skillName}</div></div>
                    <TypeBadge type={item.skillType} size="xs" />
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 font-mono truncate">{item.route}</div>
                <div className="mt-1.5 flex items-center gap-1">
                    {item.origin === 'instant'
                        ? <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5"><Zap size={9}/> Instant</span>
                        : <span className="text-[9px] font-bold text-violet-600 flex items-center gap-0.5"><Package size={9}/> {item.catalogId}</span>}
                </div>
                {isExecuted && <div className="mt-1.5 text-[10px] text-emerald-700 font-bold truncate bg-emerald-50/80 rounded px-1.5 py-0.5 border border-emerald-200/60">{item.output}</div>}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 size={12} className="text-slate-400"/>
                </div>
            </button>
        );
    });

    /* ═══════════════════════ RENDER ═══════════════════════ */
    return (
        <>
        <div className="space-y-5 animate-in">

            {/* ── Header ── */}
            <SectionCard padding="p-7">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            AI 실험실
                            <Badge color="violet">Prompt Orchestrator</Badge>
                        </h2>
                        <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                            복잡한 자연어 명령을 <strong className="text-violet-700">오케스트레이터</strong>가 분석 → <strong className="text-violet-700">DIFY YAML</strong>로 변환하고,
                            매칭된 스킬의 <strong className="text-amber-700">상세 설명과 권한</strong>을 확인한 뒤, <strong className="text-blue-700">GUI 기반 워크플로우 편집</strong>과 시뮬레이션으로 최종 게시합니다.
                        </p>
                    </div>
                    {phase > 0 && (
                        <SecondaryButton onClick={handleReset} size="sm">
                            <RotateCcw size={14}/> 초기화
                        </SecondaryButton>
                    )}
                </div>
                {/* Phase indicator */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                    {phaseSteps.map((p, i) => {
                        const s = phaseStatus(p.num);
                        const Icon = p.icon;
                        return (
                            <React.Fragment key={p.num}>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-300 ${
                                    s === 'done'   ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                    s === 'active'  ? 'bg-violet-50 border-violet-300 text-violet-700 ring-2 ring-violet-200' :
                                    s === 'ready'   ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                      'bg-slate-50 border-slate-200 text-slate-400'
                                }`}>
                                    {s === 'done' ? <CheckCircle2 size={16}/> :
                                     s === 'active' ? <Loader2 size={16} className="animate-spin"/> :
                                     <Icon size={16}/>}
                                    <span className="hidden sm:inline">{p.label}</span>
                                    <span className="sm:hidden">Phase {p.num}</span>
                                </div>
                                {i < phaseSteps.length - 1 && <ChevronRight size={16} className="text-slate-300 shrink-0"/>}
                            </React.Fragment>
                        );
                    })}
                </div>
            </SectionCard>

            {/* ══════════ PHASE 1 : Prompt + Orchestrator Analysis ══════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard padding="p-6" className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center"><Sparkles size={18}/></div>
                        Phase 1 · Master Prompt
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-10">복잡한 업무 명령을 자연어로 입력하세요.</p>
                    <textarea
                        value={masterPrompt}
                        onChange={(e) => { setMasterPrompt(e.target.value); if (phase > 0) handleReset(); }}
                        className="mt-4 flex-1 min-h-[170px] w-full border-2 border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-400 transition-colors resize-none"
                        placeholder="예: 설맞이 일일 퀘스트 성과를 매일 아침 9시에 메일/슬랙으로 공유해줘."
                    />
                    <GameButton onClick={handleAnalyze} disabled={phase >= 1} color="violet" className="mt-4 w-full">
                        {phase === 1 ? <><Loader2 size={18} className="animate-spin"/> 오케스트레이터 분석 중...</>
                            : phase >= 2 ? <><Check size={18}/> 분석 완료</>
                            : <><Sparkles size={18}/> 오케스트레이터 분석</>}
                    </GameButton>
                </SectionCard>

                <SectionCard padding="p-6" className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center"><Cpu size={18}/></div>
                        오케스트레이터 분석 결과
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-10">명령이 어떻게 분해되었는지 확인합니다.</p>
                    <div className="mt-4 flex-1 space-y-2.5">
                        {orchestratorSteps.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isDone = phase >= 2 || (phase === 1 && analysisProgress > idx);
                            const isCurrent = phase === 1 && analysisProgress === idx;
                            return (
                                <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-400 ${
                                    isDone ? 'border-emerald-200 bg-emerald-50/60' :
                                    isCurrent ? 'border-violet-300 bg-violet-50/50 ring-1 ring-violet-200' :
                                    'border-slate-100 bg-slate-50/40'
                                }`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                        isDone ? 'bg-emerald-100 text-emerald-600' : isCurrent ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {isDone ? <Check size={16}/> : isCurrent ? <Loader2 size={16} className="animate-spin"/> : <StepIcon size={16}/>}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`text-sm font-bold ${isDone ? 'text-emerald-800' : isCurrent ? 'text-violet-800' : 'text-slate-400'}`}>
                                            Step {idx + 1}. {step.label}
                                        </div>
                                        <div className={`text-xs mt-0.5 ${isDone ? 'text-emerald-600' : isCurrent ? 'text-violet-600' : 'text-slate-400'}`}>
                                            {isDone || isCurrent ? step.detail : '—'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {phase >= 2 && (
                        <div className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                            <CheckCircle2 size={14}/> 오케스트레이터 분석 완료 · {plannedSkills.length}개 스킬 매칭 · DIFY YAML 생성됨
                        </div>
                    )}
                </SectionCard>
            </div>

            {/* ══════════ PHASE 2 : Skill Matching + Permission Review ══════════ */}
            {phase >= 2 && (
                <SectionCard padding="p-6" className="animate-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"><Shield size={18}/></div>
                                Phase 2 · 매칭된 스킬 목록
                            </div>
                            <p className="text-xs text-slate-500 mt-1 ml-10">
                                오케스트레이터가 매칭한 스킬 목록입니다. 카드를 클릭하면 상세 설명과 필요 권한을 확인할 수 있습니다.
                                <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={10}/> {grantedPermissions}/{totalPermissions} 권한 승인</span>
                                {pendingPermissions > 0 && <span className="ml-1 inline-flex items-center gap-1 text-amber-600 font-bold"><AlertCircle size={10}/> {pendingPermissions}건 신청 필요</span>}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col lg:flex-row gap-5">
                        {/* Left: Skill card grid */}
                        <div className={`${selectedNode ? 'lg:w-1/2 xl:w-3/5' : 'w-full'} transition-all duration-300`}>
                            <div className={`grid grid-cols-1 ${selectedNode ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-3`}>
                                {plannedSkills.map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = selectedNode?.id === item.id;
                                    const isInstant = item.origin === 'instant';
                                    const hasPending = item.permissions.some(p => p.status === 'pending');
                                    const tBorder = typeNodeBorder[item.skillType] || typeNodeBorder.Agent;
                                    return (
                                        <button key={item.id} onClick={() => setSelectedNode(isSelected ? null : item)}
                                            className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                                                isSelected ? 'ring-2 ring-amber-300 border-amber-300 bg-amber-50/30' :
                                                'border-slate-200 bg-white ' + tBorder.idle
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500">
                                                    <Icon size={18}/>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {hasPending && <AlertCircle size={14} className="text-amber-500"/>}
                                                    <TypeBadge type={item.skillType} size="xs" />
                                                </div>
                                            </div>
                                            <div className="mt-3 font-bold text-sm text-slate-800">{item.skillName}</div>
                                            <div className="text-[11px] text-slate-400 mt-1 font-mono truncate">{item.skill}</div>
                                            <div className="mt-2.5 flex items-center gap-1.5">
                                                {isInstant ? (
                                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1"><Zap size={10}/> 인스턴트</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-md flex items-center gap-1"><Package size={10}/> 카탈로그</span>
                                                )}
                                                {item.catalogId && <span className="text-[10px] text-slate-400 font-mono">{item.catalogId}</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Detail + Permission Panel */}
                        {selectedNode ? (() => {
                            const NodeIcon = selectedNode.icon;
                            const connectedEdges = edges.filter(([s, t]) => s === selectedNode.id || t === selectedNode.id);
                            const upstreamNodes = connectedEdges.filter(([, t]) => t === selectedNode.id).map(([s]) => plannedSkills.find(sk => sk.id === s)).filter(Boolean);
                            const downstreamNodes = connectedEdges.filter(([s]) => s === selectedNode.id).map(([, t]) => plannedSkills.find(sk => sk.id === t)).filter(Boolean);
                            const hasPendingPerms = selectedNode.permissions.some(p => p.status === 'pending');
                            return (
                                <div className="lg:w-1/2 xl:w-2/5 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
                                    {/* Detail header */}
                                    <div className={`px-5 py-4 border-b border-slate-100 flex items-center gap-4 ${
                                        selectedNode.skillType === 'Agent' ? 'bg-blue-50/50' :
                                        selectedNode.skillType === 'Connector' ? 'bg-purple-50/50' : 'bg-orange-50/50'
                                    }`}>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                                            selectedNode.skillType === 'Agent' ? 'bg-blue-100 text-blue-600' :
                                            selectedNode.skillType === 'Connector' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                        }`}><NodeIcon size={24}/></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <TypeBadge type={selectedNode.skillType} size="xs" />
                                                {selectedNode.catalogId ? (
                                                    <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-md flex items-center gap-1"><Package size={9}/> {selectedNode.catalogId}</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1"><Zap size={9}/> 인스턴트</span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">{selectedNode.skillName}</h3>
                                        </div>
                                        <button onClick={() => setSelectedNode(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0 transition-colors"><X size={16}/></button>
                                    </div>

                                    {/* Detail body */}
                                    <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: '480px' }}>
                                        {/* Description */}
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">스킬 설명</div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{selectedNode.detail}</p>
                                        </div>

                                        {/* Routing info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                                <div className="text-[10px] font-semibold text-slate-500">실행 스킬 ID</div>
                                                <div className="mt-0.5 font-mono text-slate-800 text-xs truncate">{selectedNode.skill}</div>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                                <div className="text-[10px] font-semibold text-slate-500">라우팅 경로</div>
                                                <div className="mt-0.5 font-mono text-slate-800 text-xs truncate">{selectedNode.route}</div>
                                            </div>
                                        </div>

                                        {/* Permissions */}
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Shield size={12}/> 필요 권한
                                            </div>
                                            <div className="space-y-2">
                                                {selectedNode.permissions.map((perm, idx) => {
                                                    const style = permissionStatusStyle(perm.status);
                                                    const StatusIcon = style.icon;
                                                    return (
                                                        <div key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${style.border} ${style.bg}`}>
                                                            <StatusIcon size={14} className={style.color}/>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold text-slate-800">{perm.name}</div>
                                                                <div className="text-[10px] text-slate-400 font-mono">{perm.scope}</div>
                                                            </div>
                                                            <span className={`text-[10px] font-bold shrink-0 ${style.color}`}>{style.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {hasPendingPerms && (
                                                <GameButton color="amber" size="sm" className="mt-3 w-full">
                                                    <Lock size={14}/> 권한 신청하기
                                                </GameButton>
                                            )}
                                        </div>

                                        {/* Connected nodes */}
                                        {(upstreamNodes.length > 0 || downstreamNodes.length > 0) && (
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <Workflow size={12}/> 연결된 노드
                                                </div>
                                                <div className="space-y-2">
                                                    {upstreamNodes.length > 0 && (
                                                        <div>
                                                            <div className="text-[10px] font-bold text-slate-400 mb-1.5">Upstream (입력)</div>
                                                            <div className="space-y-1.5">
                                                                {upstreamNodes.map(node => {
                                                                    const UpIcon = node.icon;
                                                                    return (
                                                                        <button key={node.id} onClick={() => setSelectedNode(node)} className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                                                                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"><UpIcon size={13}/></div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="text-xs font-bold text-slate-800 truncate">{node.skillName}</div>
                                                                                <div className="text-[10px] text-slate-400 font-mono truncate">{node.id}</div>
                                                                            </div>
                                                                            <TypeBadge type={node.skillType} size="xs" />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {downstreamNodes.length > 0 && (
                                                        <div>
                                                            <div className="text-[10px] font-bold text-slate-400 mb-1.5">Downstream (출력)</div>
                                                            <div className="space-y-1.5">
                                                                {downstreamNodes.map(node => {
                                                                    const DownIcon = node.icon;
                                                                    return (
                                                                        <button key={node.id} onClick={() => setSelectedNode(node)} className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                                                                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"><DownIcon size={13}/></div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="text-xs font-bold text-slate-800 truncate">{node.skillName}</div>
                                                                                <div className="text-[10px] text-slate-400 font-mono truncate">{node.id}</div>
                                                                            </div>
                                                                            <TypeBadge type={node.skillType} size="xs" />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })() : (
                            <div className="hidden lg:flex lg:w-2/5 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl min-h-[300px]">
                                <div className="text-center text-slate-400">
                                    <Info size={32} className="mx-auto mb-3 text-slate-300"/>
                                    <p className="text-sm font-bold">스킬 카드를 클릭하세요</p>
                                    <p className="text-xs mt-1">상세 설명과 필요 권한을 확인할 수 있습니다.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                        <CheckCircle2 size={14}/> 오케스트레이터 분석 완료 · {plannedSkills.length}개 스킬 매칭 · DIFY YAML 생성됨
                    </div>
                </SectionCard>
            )}

            {/* ══════════ PHASE 3 : Workflow Edit + Simulation + Registration ══════════ */}
            {phase >= 2 && (
                <SectionCard padding="p-6" className="animate-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><Layers size={18}/></div>
                                Phase 3 · 워크플로우 편집 · 실행
                            </div>
                            <p className="text-xs text-slate-500 mt-1 ml-10">생성된 워크플로우를 시각적으로 확인하고 세부 조정합니다. 시뮬레이션 실행 후 스킬로 등록할 수 있습니다.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <GameButton onClick={handleExecute} disabled={phase >= 3} color="amber" size="sm">
                                {phase >= 4 ? <><Check size={14}/> 실행 완료</> :
                                 phase === 3 ? <><Loader2 size={14} className="animate-spin"/> 실행 중...</> :
                                 <><Play size={14}/> 시뮬레이션 실행</>}
                            </GameButton>
                            <SecondaryButton onClick={() => setShowYamlView(!showYamlView)} size="sm">
                                {showYamlView ? <><Eye size={14}/> Canvas</> : <><Code size={14}/> YAML</>}
                            </SecondaryButton>
                            <SecondaryButton onClick={handleCopyYaml} size="sm">
                                <Clipboard size={14}/> {isCopied ? '복사됨!' : 'YAML 복사'}
                            </SecondaryButton>
                            <GameButton onClick={() => setShowLogs(true)} color="slate" size="sm">
                                <Terminal size={14}/> 실행 로그
                            </GameButton>
                            <GameButton onClick={() => { setShowFullCanvas(true); setFullCanvasOffset({ x: 0, y: 0 }); setFullSelectedNode(null); }} color="blue" size="sm">
                                <Maximize2 size={14}/> Dify 캔버스 열기
                            </GameButton>
                            <GameButton color="blue" size="sm">
                                <ExternalLink size={14}/> 스킬로 등록
                            </GameButton>
                        </div>
                    </div>

                    {showYamlView ? (
                        <pre className="mt-4 bg-slate-900 text-slate-100 text-xs rounded-2xl p-5 overflow-auto max-h-[560px] whitespace-pre-wrap font-mono leading-relaxed">{difyYaml}</pre>
                    ) : (
                        <div className={`mt-4 border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                            style={{ height: '520px' }}
                            onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp}>
                            <div className="absolute top-3 left-4 z-10 text-[11px] font-bold text-slate-400 flex items-center gap-2">
                                <span className="bg-white/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-200">DIFY Workflow Canvas</span>
                                <span className="bg-white/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-200">드래그로 이동 · 노드 클릭 가능</span>
                            </div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(148,163,184,0.12)_1px,_transparent_1px)] [background-size:20px_20px]"/>
                            <div className="absolute left-0 top-0 w-[1560px] h-[400px]" style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }}>
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1560 400" fill="none">
                                    {renderCanvasEdges(canvasOffset)}
                                </svg>
                                {renderCanvasNodes((item) => { setShowFullCanvas(true); setFullCanvasOffset({ x: 0, y: 0 }); setFullSelectedNode(item); })}
                            </div>
                        </div>
                    )}

                    {phase >= 4 && (
                        <div className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                            <CheckCircle2 size={14}/> 전체 워크플로우 실행 완료 · Dify 캔버스에서 세부 수정하거나 스킬로 등록하세요.
                        </div>
                    )}
                </SectionCard>
            )}
        </div>

        {/* ═══ Execution Log — Full-screen ═══ */}
        {showLogs && (
            <FullScreenPanel>
                <PanelToolbar
                    onBack={() => setShowLogs(false)}
                    subtitle="AI 실험실 / 실행 로그"
                    title={<><Terminal size={18} className="text-violet-600 inline mr-2"/>오케스트레이터 실행 로그</>}
                    statusBadge={<Badge color="emerald">SUCCESS</Badge>}
                    actions={<>
                        <SecondaryButton onClick={handleCopyYaml} size="sm"><Clipboard size={16} strokeWidth={2.5}/> YAML 복사</SecondaryButton>
                        <GameButton onClick={() => setShowLogs(false)} color="slate" size="sm">닫기</GameButton>
                    </>}
                />
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Phase 1 → 3 전체 파이프라인 로그</div>
                            {executionLogs.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                                    <span className="text-[10px] font-mono text-slate-300 pt-0.5 shrink-0 w-6 text-right">{String(idx + 1).padStart(2, '0')}</span>
                                    <span className={`shrink-0 px-2.5 py-0.5 rounded-md border text-xs font-bold font-mono ${tagColor(log.tag)}`}>{log.tag}</span>
                                    <span className="text-sm text-slate-700 font-mono leading-relaxed">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-col w-96 bg-white border-l border-slate-200">
                        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Code size={16}/> 생성된 DIFY YAML</h4>
                        </div>
                        <pre className="flex-1 overflow-auto p-4 text-xs text-slate-600 font-mono leading-relaxed whitespace-pre-wrap bg-slate-50">{difyYaml}</pre>
                    </div>
                </div>
            </FullScreenPanel>
        )}

        {/* ═══ Fullscreen Dify Canvas ═══ */}
        {showFullCanvas && (
            <FullScreenPanel className="z-[100]">
                <PanelToolbar
                    onBack={() => setShowFullCanvas(false)}
                    subtitle="AI 실험실 / Dify 캔버스"
                    title={<><Layers size={18} className="text-blue-600 inline mr-2"/>Dify Workflow Canvas</>}
                    statusBadge={<>
                        {phase >= 4 && <Badge color="emerald">실행 완료</Badge>}
                        {phase === 3 && <Badge color="amber">실행 중</Badge>}
                        {phase === 2 && <Badge color="blue">편집 가능</Badge>}
                    </>}
                    actions={<>
                        <SecondaryButton onClick={handleCopyYaml} size="sm"><Clipboard size={16} strokeWidth={2.5}/> YAML 복사</SecondaryButton>
                        <GameButton onClick={() => setShowFullCanvas(false)} color="slate" size="sm">닫기</GameButton>
                    </>}
                />
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Canvas area */}
                    <div className={`flex-1 relative overflow-hidden ${isFullPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                        onMouseDown={handleFullCanvasMouseDown}
                        onMouseMove={handleFullCanvasMouseMove}
                        onMouseUp={handleFullCanvasMouseUp}
                        onMouseLeave={handleFullCanvasMouseUp}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(148,163,184,0.12)_1px,_transparent_1px)] [background-size:20px_20px]"/>
                        <div className="absolute top-3 left-4 z-10 text-[11px] font-bold text-slate-400 flex items-center gap-2">
                            <span className="bg-white/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-200">드래그로 이동 · 노드 클릭 → 우측 패널 상세</span>
                        </div>
                        <div className="absolute left-0 top-0 w-[1560px] h-[500px]" style={{ transform: `translate(${fullCanvasOffset.x}px, ${fullCanvasOffset.y}px)` }}>
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1560 500" fill="none">
                                {renderCanvasEdges(fullCanvasOffset)}
                            </svg>
                            {renderCanvasNodes(setFullSelectedNode)}
                        </div>
                    </div>

                    {/* Right panel: selected node detail OR YAML */}
                    <div className="hidden lg:flex flex-col w-96 bg-white border-l border-slate-200">
                        {fullSelectedNode ? (() => {
                            const FNodeIcon = fullSelectedNode.icon;
                            const isExecuted = executedNodes.has(fullSelectedNode.id);
                            const connectedEdges = edges.filter(([s, t]) => s === fullSelectedNode.id || t === fullSelectedNode.id);
                            const upstreamNodes = connectedEdges.filter(([, t]) => t === fullSelectedNode.id).map(([s]) => plannedSkills.find(sk => sk.id === s)).filter(Boolean);
                            const downstreamNodes = connectedEdges.filter(([s]) => s === fullSelectedNode.id).map(([, t]) => plannedSkills.find(sk => sk.id === t)).filter(Boolean);
                            return (
                                <>
                                    <div className={`px-4 py-3 border-b border-slate-200 flex items-center gap-3 ${
                                        fullSelectedNode.skillType === 'Agent' ? 'bg-blue-50/50' :
                                        fullSelectedNode.skillType === 'Connector' ? 'bg-purple-50/50' : 'bg-orange-50/50'
                                    }`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            fullSelectedNode.skillType === 'Agent' ? 'bg-blue-100 text-blue-600' :
                                            fullSelectedNode.skillType === 'Connector' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                        }`}><FNodeIcon size={20}/></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <TypeBadge type={fullSelectedNode.skillType} size="xs" />
                                                {isExecuted && <Badge color="emerald">Executed</Badge>}
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate">{fullSelectedNode.skillName}</h4>
                                        </div>
                                        <button onClick={() => setFullSelectedNode(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0"><X size={14}/></button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                            <div className="text-[10px] font-semibold text-slate-500">스킬 설명</div>
                                            <div className="mt-1 text-sm text-slate-700 leading-relaxed">{fullSelectedNode.detail}</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                                <div className="text-[10px] font-semibold text-slate-500">스킬 ID</div>
                                                <div className="mt-0.5 font-mono text-slate-800 text-xs truncate">{fullSelectedNode.skill}</div>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                                <div className="text-[10px] font-semibold text-slate-500">라우팅</div>
                                                <div className="mt-0.5 font-mono text-slate-800 text-xs truncate">{fullSelectedNode.route}</div>
                                            </div>
                                        </div>
                                        {isExecuted && (
                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                                                <div className="text-[10px] font-semibold text-emerald-700">실행 결과</div>
                                                <div className="mt-1 text-emerald-900 font-bold text-sm">{fullSelectedNode.output}</div>
                                            </div>
                                        )}
                                        {/* Permissions in canvas detail */}
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Shield size={10}/> 권한</div>
                                            <div className="space-y-1.5">
                                                {fullSelectedNode.permissions.map((perm, idx) => {
                                                    const style = permissionStatusStyle(perm.status);
                                                    const StatusIcon = style.icon;
                                                    return (
                                                        <div key={idx} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border ${style.border} ${style.bg}`}>
                                                            <StatusIcon size={12} className={style.color}/>
                                                            <span className="text-xs font-bold text-slate-700 flex-1 truncate">{perm.name}</span>
                                                            <span className={`text-[9px] font-bold shrink-0 ${style.color}`}>{style.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        {/* Connected nodes */}
                                        {(upstreamNodes.length > 0 || downstreamNodes.length > 0) && (
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Workflow size={10}/> 연결</div>
                                                <div className="space-y-1.5">
                                                    {upstreamNodes.map(node => (
                                                        <button key={node.id} onClick={() => setFullSelectedNode(node)}
                                                            className="w-full text-left flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 transition-all">
                                                            <ArrowRight size={10} className="text-slate-400 rotate-180 shrink-0"/>
                                                            <span className="text-xs font-bold text-slate-700 truncate flex-1">{node.skillName}</span>
                                                            <TypeBadge type={node.skillType} size="xs" />
                                                        </button>
                                                    ))}
                                                    {downstreamNodes.map(node => (
                                                        <button key={node.id} onClick={() => setFullSelectedNode(node)}
                                                            className="w-full text-left flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 transition-all">
                                                            <ArrowRight size={10} className="text-slate-400 shrink-0"/>
                                                            <span className="text-xs font-bold text-slate-700 truncate flex-1">{node.skillName}</span>
                                                            <TypeBadge type={node.skillType} size="xs" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Node YAML */}
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Code size={10}/> 노드 YAML</div>
                                            <pre className="bg-slate-900 text-slate-300 text-[10px] rounded-xl p-3 overflow-auto font-mono leading-relaxed whitespace-pre-wrap">{[
                                                `- id: ${fullSelectedNode.id}`, '  data:', '    type: custom',
                                                `    title: "${fullSelectedNode.skillName}"`, `    desc: "${fullSelectedNode.detail}"`,
                                                `    skill: "${fullSelectedNode.route}"`, `    nexon_catalog_id: "${fullSelectedNode.catalogId || 'instant'}"`,
                                                `    skill_type: "${fullSelectedNode.skillType}"`, '    selected: false', '    variables: []',
                                                '  position:', `    x: ${nodePositions[fullSelectedNode.id]?.x ?? 0}`, `    y: ${nodePositions[fullSelectedNode.id]?.y ?? 0}`,
                                            ].join('\n')}</pre>
                                        </div>
                                    </div>
                                </>
                            );
                        })() : (
                            <>
                                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Code size={16}/> 생성된 DIFY YAML</h4>
                                </div>
                                <pre className="flex-1 overflow-auto p-4 text-xs text-slate-600 font-mono leading-relaxed whitespace-pre-wrap bg-slate-50">{difyYaml}</pre>
                            </>
                        )}
                    </div>
                </div>
            </FullScreenPanel>
        )}
        </>
    );
};

window.AppComponents.AILab = AILab;
