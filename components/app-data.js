const { FlaskConical, Zap } = window.LucideReact;

window.AppData.GAME_LIST = ['메이플스토리', '마비노기', '던전앤파이터', 'FC온라인', '바람의나라', '카트라이더: 드리프트'];

window.AppData.MAIN_MENUS = [
    { name: '개발자 콘솔', icon: null, domain: 'skills.nexon.com/console', desc: '내 AI 스킬들의 현황을 한눈에', authRequired: true },
    { name: '스킬 트렌드', icon: null, domain: 'skills.nexon.com/news', desc: '가장 빠른 AI 기술 트렌드' },
    { name: '스킬 가이드', icon: null, domain: 'skills.nexon.com/docs', desc: '개발을 돕는 친절한 길잡이' },
    { name: 'AI 워크플로우', icon: Zap, domain: 'skills.nexon.com/workflows', desc: '기존 선형 업무를 n8n GUI처럼 자동화' },
    { name: 'AI 실험실', icon: FlaskConical, domain: 'skills.nexon.com/labs', desc: '프롬프트 오케스트레이터 → 서브 에이전트 실행 → DIFY GUI 디테일링' },
];

window.AppData.NEWS_ITEMS = [
    { category: 'Model Update', title: 'OpenAI, 추론 능력이 비약적으로 상승한 신모델 출시', date: '1시간 전', content: 'OpenAI가 새로운 AI 모델을 공개했습니다. 이번 모델은 코드 생성, 수학적 추론, 다국어 처리 능력에서 이전 모델 대비 크게 향상된 성능을 보여줍니다.' },
    { category: 'Industry', title: '엔비디아, 차세대 블랙웰 칩 생산량 확대 발표', date: '3시간 전', content: '엔비디아(Nvidia)가 차세대 AI 칩 블랙웰의 생산량을 대폭 확대한다고 밝혔습니다. 글로벌 데이터센터 수요 급증에 대응하기 위한 전략입니다.' },
    { category: 'Tutorial', title: 'RAG 아키텍처를 최적화하는 5가지 핵심 기법', date: '어제', content: '검색 증강 생성(RAG) 시스템의 성능을 극대화하는 실전 기법을 소개합니다. 청킹 전략, 임베딩 모델 선택, 리랭킹, 하이브리드 검색 등을 다룹니다.' },
    { category: 'Community', title: 'NEXON Skills 개발자 밋업: 서울 2026 참가 신청 안내', date: '2일 전', content: '국내 최대 AI 에이전트 개발자 커뮤니티 밋업이 서울에서 개최됩니다. AI 스킬 개발 사례 발표, 네트워킹, 라이브 코딩 세션이 준비되어 있습니다.' },
    { category: 'Model Update', title: 'Anthropic Claude 4.5 Sonnet, 코딩 벤치마크 최고 성능 달성', date: '5시간 전', content: 'Anthropic의 최신 Claude 4.5 Sonnet 모델이 주요 코딩 벤치마크에서 최고점을 기록하며 개발자 도구로서의 가능성을 입증했습니다.' },
    { category: 'Industry', title: 'AI 스타트업 투자 2026년 상반기 역대 최고 기록', date: '6시간 전', content: '글로벌 AI 스타트업 투자가 2026년 상반기에만 전년도 전체를 초과하며 역대 최고를 경신했습니다. 특히 에이전트 플랫폼 분야에 자금이 집중되고 있습니다.' },
    { category: 'Model Update', title: 'Google DeepMind, 멀티모달 추론 모델 Gemini Ultra 2 공개', date: '1일 전', content: 'Google DeepMind가 텍스트, 이미지, 비디오를 동시에 처리하는 Gemini Ultra 2를 발표했습니다. 복합 추론 능력에서 획기적 진전을 보입니다.' },
    { category: 'Tutorial', title: 'LangChain + n8n으로 AI 워크플로우 자동화 구축하기', date: '2일 전', content: 'LangChain과 n8n을 결합하여 복잡한 AI 워크플로우를 GUI 기반으로 구축하는 실전 가이드입니다. 코드 없이 에이전트 파이프라인을 설계합니다.' },
];

window.AppData.FAVORITES_ITEMS = [
    { type: 'Agent', title: 'Code Reviewer Pro', desc: 'GitHub PR을 분석하여 잠재적인 버그와 성능 이슈를 코멘트로 남깁니다.', author: 'DevTools', stars: 1800 },
    { type: 'Connector', title: 'Notion to Slack', desc: '노션 페이지 변경 사항을 슬랙 채널로 실시간 알림 전송합니다.', author: 'Connectify', stars: 850 },
    { type: 'Workflow', title: 'Daily News Summary', desc: '매일 아침 30분, 주요 뉴스 사이트를 크롤링하여 요약 리포트를 메일로 발송합니다.', author: 'NEXON Skills Official', stars: 3200 },
    { type: 'Agent', title: 'SQL Query Assistant', desc: '자연어를 입력하면 최적화된 SQL 쿼리로 변환해주는 데이터 분석 보조 도구입니다.', author: 'DataTeam', stars: 2100 },
];

window.AppData.HOME_INITIAL_ITEMS = [
    { type: 'Agent', title: 'Data Wizard Bot', desc: '복잡한 로그 데이터를 미니맵처럼 한눈에 파악하고 시각화합니다.', author: 'DataGuild', stars: 1240 },
    { type: 'Connector', title: 'Notion Guild Messenger', desc: '노션 페이지 변경 사항을 길드 채널(슬랙)로 실시간 알림 전송합니다.', author: 'Connectify', stars: 850 },
    { type: 'Workflow', title: 'Daily Quest Summary', desc: '매일 아침 30분, 주요 뉴스 퀘스트를 클리어하고 요약 리포트를 전송합니다.', author: 'NEXON Skills Official', stars: 3200 },
    { type: 'Agent', title: 'Code Reviewer Pro', desc: 'GitHub PR을 분석하여 잠재적인 버그와 성능 이슈를 코멘트로 남깁니다.', author: 'DevTools', stars: 1800 },
    { type: 'Connector', title: 'Gmail <-> Trello', desc: '중요 메일을 자동으로 트렐로 카드로 변환하여 할 일 목록에 추가합니다.', author: 'ProductivityKing', stars: 620 },
    { type: 'Workflow', title: 'Insta Marketing Auto', desc: '트렌드 키워드를 분석하여 인스타그램 포스팅 문구와 이미지를 생성하고 업로드합니다.', author: 'MarketingAI', stars: 940 },
];
