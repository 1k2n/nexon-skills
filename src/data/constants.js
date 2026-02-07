import { FlaskConical, Zap } from '../icons.js';

export const GAME_LIST = ['메이플스토리', '마비노기', '던전앤파이터', 'FC온라인', '바람의나라', '카트라이더: 드리프트'];

export const MAIN_MENUS = [
    { name: '개발자 콘솔', icon: null, domain: 'skills.nexon.com/console', desc: '내 AI 스킬들의 현황을 한눈에', authRequired: true },
    { name: '스킬 트렌드', icon: null, domain: 'skills.nexon.com/news', desc: '가장 빠른 AI 기술 트렌드' },
    { name: '스킬 가이드', icon: null, domain: 'skills.nexon.com/docs', desc: '개발을 돕는 친절한 길잡이' },
    { name: 'AI 실험실', icon: FlaskConical, domain: 'skills.nexon.com/labs', desc: '상상을 현실로 만드는 AI 실험실' },
    { name: 'AI 워크플로우', icon: Zap, domain: 'skills.nexon.com/workflows', desc: '복잡한 업무를 자동으로 연결' },
];

export const NEWS_FEED_URL =
    'https://r.jina.ai/http://news.google.com/rss/search?q=AI%20%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&hl=ko&gl=KR&ceid=KR:ko';

export const FAVORITES_ITEMS = [
    { type: 'Agent', title: 'Code Reviewer Pro', desc: 'GitHub PR을 분석하여 잠재적인 버그와 성능 이슈를 코멘트로 남깁니다.', author: 'DevTools', stars: 1800 },
    { type: 'Connector', title: 'Notion to Slack', desc: '노션 페이지 변경 사항을 슬랙 채널로 실시간 알림 전송합니다.', author: 'Connectify', stars: 850 },
    { type: 'Workflow', title: 'Daily News Summary', desc: '매일 아침 30분, 주요 뉴스 사이트를 크롤링하여 요약 리포트를 메일로 발송합니다.', author: 'NEXON Skills Official', stars: 3200 },
    { type: 'Agent', title: 'SQL Query Assistant', desc: '자연어를 입력하면 최적화된 SQL 쿼리로 변환해주는 데이터 분석 보조 도구입니다.', author: 'DataTeam', stars: 2100 },
];

export const HOME_INITIAL_ITEMS = [
    { type: 'Agent', title: 'Data Wizard Bot', desc: '복잡한 로그 데이터를 미니맵처럼 한눈에 파악하고 시각화합니다.', author: 'DataGuild', stars: 1240 },
    { type: 'Connector', title: 'Notion Guild Messenger', desc: '노션 페이지 변경 사항을 길드 채널(슬랙)로 실시간 알림 전송합니다.', author: 'Connectify', stars: 850 },
    { type: 'Workflow', title: 'Daily Quest Summary', desc: '매일 아침 30분, 주요 뉴스 퀘스트를 클리어하고 요약 리포트를 전송합니다.', author: 'NEXON Skills Official', stars: 3200 },
    { type: 'Agent', title: 'Code Reviewer Pro', desc: 'GitHub PR을 분석하여 잠재적인 버그와 성능 이슈를 코멘트로 남깁니다.', author: 'DevTools', stars: 1800 },
    { type: 'Connector', title: 'Gmail <-> Trello', desc: '중요 메일을 자동으로 트렐로 카드로 변환하여 할 일 목록에 추가합니다.', author: 'ProductivityKing', stars: 620 },
    { type: 'Workflow', title: 'Insta Marketing Auto', desc: '트렌드 키워드를 분석하여 인스타그램 포스팅 문구와 이미지를 생성하고 업로드합니다.', author: 'MarketingAI', stars: 940 },
];
