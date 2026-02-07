import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0?dev';
import { GAME_LIST, MAIN_MENUS } from './data/constants.js';
import { CreateSelectionModal, ItemDetailModal, LoginScreen } from './components/modals.jsx';
import { GNB } from './components/navigation.jsx';
import {
    AINews,
    AIStudio,
    AIWorkflow,
    DeveloperConsole,
    FavoritesView,
    HomePage,
    IntegrationGuide,
} from './components/views.jsx';
import { Zap } from './icons.js';

export const App = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [currentTab, setCurrentTab] = useState('홈');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showLoginScreen, setShowLoginScreen] = useState(false);
const [pendingTab, setPendingTab] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
const [showCreateModal, setShowCreateModal] = useState(false);
const [selectedGame, setSelectedGame] = useState('전체 게임');
const [showStickySearch, setShowStickySearch] = useState(false);
const [footerLogoError, setFooterLogoError] = useState(false);

useEffect(() => { 
    const handleScroll = () => { 
        if (window.scrollY > 300) { setShowStickySearch(true); } 
        else { setShowStickySearch(false); } 
    }; 
    window.addEventListener('scroll', handleScroll); 
    return () => window.removeEventListener('scroll', handleScroll); 
}, []);

const handleNavClick = (tabName) => { 
    if (tabName === '홈') { setCurrentTab('홈'); setIsMenuOpen(false); return; } 
    const targetMenu = MAIN_MENUS.find(m => m.name === tabName); 
    if (targetMenu?.authRequired && !isLoggedIn) { 
        setPendingTab(tabName); 
        setShowLoginScreen(true); 
        setIsMenuOpen(false); 
    } else { 
        setCurrentTab(tabName); 
        setIsMenuOpen(false); 
    } 
};

const handleLogin = (e) => { 
    e.preventDefault(); 
    setIsLoggedIn(true); 
    setShowLoginScreen(false); 
    if (pendingTab) { setCurrentTab(pendingTab); setPendingTab(null); } 
};

const handleLogout = () => { setIsLoggedIn(false); setCurrentTab('홈'); };

const renderContent = () => {
    switch (currentTab) {
        case '개발자 콘솔': return <DeveloperConsole setShowCreateModal={setShowCreateModal} setSelectedItem={setSelectedItem} />;
        case '스킬 트렌드': return <AINews setSelectedItem={setSelectedItem} />;
        case '스킬 가이드': return <IntegrationGuide />;
        case 'AI 워크플로우': return <AIWorkflow />;
        case 'AI 실험실': return <AIStudio />;
        case '즐겨찾기': return <FavoritesView setSelectedItem={setSelectedItem} />;
        default: return <HomePage selectedGame={selectedGame} setSelectedGame={setSelectedGame} gameList={GAME_LIST} showStickySearch={showStickySearch} setSelectedItem={setSelectedItem} isLoggedIn={isLoggedIn} setShowLoginScreen={setShowLoginScreen} />;
    }
};

return (
    <div className="min-h-screen flex flex-col relative font-sans">
        {/* Modals Layer */}
        {showLoginScreen && <LoginScreen onClose={() => setShowLoginScreen(false)} onLogin={handleLogin} />}
        {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} isLoggedIn={isLoggedIn} setShowLoginScreen={setShowLoginScreen} />}
        {showCreateModal && <CreateSelectionModal onClose={() => setShowCreateModal(false)} />}

        {/* Navigation Bar */}
        <GNB 
            currentTab={currentTab} 
            isLoggedIn={isLoggedIn} 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            handleNavClick={handleNavClick} 
            handleLogout={handleLogout} 
            setShowLoginScreen={setShowLoginScreen} 
            showStickySearch={showStickySearch} 
            selectedGame={selectedGame} 
            setSelectedGame={setSelectedGame} 
            gameList={GAME_LIST} 
            mainMenus={MAIN_MENUS} 
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t-2 border-slate-100 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                         <Zap size={16} fill="currentColor" className="text-slate-300"/>
                    </div>
                    <span className="text-sm font-bold">© 2026 NEXON Skills Inc. All rights reserved.</span>
                </div>
                <div className="flex gap-8 text-sm font-bold text-slate-500">
                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition-colors">Terms of Service</a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition-colors">Contact Us</a>
                </div>
            </div>
        </footer>
    </div>
);
};

