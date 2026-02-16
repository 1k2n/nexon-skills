const { useState } = window.React;
const { Check, ShieldCheck, Bot, Terminal, BookOpen, Copy } = window.LucideReact;
const { SidebarLayout, SidebarNav, InfoCallout, CodeBlock, PageHeader } = window.AppComponents;

const SkillGuide = () => {
    const [activeDoc, setActiveDoc] = useState('intro');

    const menuItems = [
        { id: 'intro', icon: BookOpen, label: '시작하기' },
        { id: 'auth', icon: ShieldCheck, label: '인증 (Authentication)' },
        { id: 'agent', icon: Bot, label: '에이전트 연동' },
        { id: 'sdk', icon: Terminal, label: 'SDK 레퍼런스 (준비중)', disabled: true },
    ];

    const docs = {
        'intro': {
            title: '시작하기 (Getting Started)',
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed font-normal">NEXON Skills SDK를 사용하여 기존 서비스에 AI 기능을 손쉽게 통합하는 방법을 안내합니다. 단 몇 줄의 코드로 강력한 LLM 에이전트를 호출하고, 데이터 파이프라인을 연결할 수 있습니다.</p>
                    <InfoCallout title="사전 준비 사항" icon={Check} color="blue">
                        <ul className="list-disc pl-5 text-sm text-blue-800 space-y-2 font-bold">
                            <li>NEXON Skills 계정 생성 및 로그인</li>
                            <li>개발자 콘솔에서 API Key 발급</li>
                            <li>Node.js v18 이상 환경</li>
                        </ul>
                    </InfoCallout>
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">설치 (Installation)</h4>
                        <CodeBlock copyable>npm install @nexon/skills-sdk</CodeBlock>
                    </div>
                </div>
            ),
        },
        'auth': {
            title: '인증 (Authentication)',
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600 font-normal">모든 API 요청은 `Authorization` 헤더에 Bearer Token을 포함해야 합니다. API Key는 개발자 콘솔 {'>'} 내 크리덴셜 메뉴에서 관리할 수 있습니다.</p>
                    <CodeBlock>
                        <div className="text-slate-500 mb-2 font-bold italic">// SDK 초기화 예제</div>
                        <div className="text-purple-400">import</div> <div className="text-white inline">NexonSkills</div> <div className="text-purple-400 inline">from</div> <div className="text-green-400 inline">'@nexon/skills-sdk'</div>;<br/><br/>
                        <div className="text-purple-400">const</div> <div className="text-blue-400 inline">client</div> = <div className="text-purple-400 inline">new</div> <div className="text-yellow-400 inline">NexonSkills</div>({'{'}<br/>
                        &nbsp;&nbsp;apiKey: <div className="text-green-400 inline">'nk_prod_...'</div>,<br/>
                        &nbsp;&nbsp;region: <div className="text-green-400 inline">'kr-1'</div><br/>
                        {'}'});
                    </CodeBlock>
                </div>
            ),
        },
        'agent': {
            title: '에이전트 실행 (Execute Agent)',
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600 font-normal">특정 에이전트에게 작업을 요청하고 결과를 받아옵니다. 스트리밍(Streaming)을 지원하여 긴 응답도 실시간으로 처리할 수 있습니다.</p>
                    <CodeBlock>
                        <div className="text-purple-400">const</div> <div className="text-blue-400 inline">response</div> = <div className="text-purple-400 inline">await</div> <div className="text-blue-400 inline">client.agents.run</div>({'{'}<br/>
                        &nbsp;&nbsp;agentId: <div className="text-green-400 inline">'agent_abc123'</div>,<br/>
                        &nbsp;&nbsp;inputs: {'{'}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;prompt: <div className="text-green-400 inline">'최근 서버 로그 분석해줘'</div>,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;files: [<div className="text-green-400 inline">'s3://logs/error.log'</div>]<br/>
                        &nbsp;&nbsp;{'}'}<br/>
                        {'}'});<br/><br/>
                        <div className="text-yellow-400">console</div>.log(<div className="text-blue-400 inline">response.output</div>);
                    </CodeBlock>
                </div>
            ),
        },
    };

    const sidebar = (
        <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-5 sticky top-24 shrink-0 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 px-2 tracking-widest">Table of Contents</h3>
            <nav className="space-y-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && setActiveDoc(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                            item.disabled ? 'text-slate-300 cursor-not-allowed'
                            : activeDoc === item.id ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <item.icon size={18} strokeWidth={2.5} /> {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );

    return (
        <SidebarLayout sidebar={sidebar} className="items-start">
            <div className="w-full bg-white border-2 border-slate-200 rounded-[2rem] p-10 min-h-[500px] shadow-sm">
                <h2 className="text-4xl font-bold text-slate-900 mb-8">{docs[activeDoc].title}</h2>
                {docs[activeDoc].content}
            </div>
        </SidebarLayout>
    );
};

window.AppComponents.SkillGuide = SkillGuide;
