(() => {
    var NexonSkills = window.NexonSkills || (window.NexonSkills = {});
    const { DomainTooltip } = NexonSkills.components;
    const { useState } = React;
    const {
        ChevronRight,
        Gamepad2,
        Lock,
        LogIn,
        LogOut,
        Menu,
        Search,
        Star,
        User,
        X,
        Zap,
    } = NexonSkills.icons;

    NexonSkills.components.GNB = ({
    currentTab,
    isLoggedIn,
    isMenuOpen,
    setIsMenuOpen,
    handleNavClick,
    handleLogout,
    setShowLoginScreen,
    showStickySearch,
    selectedGame,
    setSelectedGame,
    gameList,
    mainMenus,
}) => {
    const [logoError, setLogoError] = useState(false);

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b-2 border-slate-100 sticky top-0 z-50">
            <div className="relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3 shrink-0 cursor-pointer group relative" onClick={() => handleNavClick('홈')}>
                            <div className="relative">
                                {!logoError ? (
                                    <img src="nexon-skills.webp" alt="NEXON Skills" className="w-10 h-10 object-contain drop-shadow-sm hover:scale-110 transition-transform]" onError={() => setLogoError(true)} />
                                ) : (
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-md border-2 border-slate-200 flex items-center justify-center text-blue-600 group-hover:border-blue-300 transition-colors">
                                        <Zap size={20} fill="currentColor" strokeWidth={0} />
                                    </div>
                                )}
                            </div>
                            <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 transition-all">NEXON Skills</span>
                            <DomainTooltip title="AI 스킬 통합 플랫폼" domain="skills.nexon.com" />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                            {mainMenus.map((menu) => (
                                <div key={menu.name} className="relative group">
                                    <button
                                        onClick={() => handleNavClick(menu.name)}
                                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                                            currentTab === menu.name ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                                        }`}
                                    >
                                        {menu.icon && <menu.icon size={18} className={currentTab === menu.name ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} strokeWidth={2.5} />}
                                        {menu.name}
                                        {menu.authRequired && !isLoggedIn && <Lock size={12} className="text-slate-300" />}
                                    </button>
                                    <DomainTooltip title={menu.desc} domain={menu.domain} />
                                </div>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button onClick={() => handleNavClick('즐겨찾기')} className={`transition-all p-2.5 rounded-xl border-2 ${currentTab === '즐겨찾기' ? 'bg-yellow-50 border-yellow-200 text-yellow-500' : 'bg-white border-slate-100 text-slate-400 hover:border-yellow-200 hover:text-yellow-500'}`} title="내 즐겨찾기">
                                <Star size={20} className={currentTab === '즐겨찾기' ? 'fill-yellow-500' : ''} strokeWidth={2.5} />
                            </button>
                            <div className="h-6 w-[2px] bg-slate-100 rounded-full"></div>
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm group relative">
                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200"><User size={14} /></div> <span>Nexon_Dev</span>
                                    <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-white border-2 border-slate-100 rounded-xl shadow-xl p-2 min-w-[140px] z-50">
                                        <div className="flex items-center gap-2 text-red-500 text-xs font-bold p-2 hover:bg-red-50 rounded-lg"><LogOut size={14} /> 로그아웃</div>
                                    </div>
                                </button>
                            ) : (
                                <button onClick={() => setShowLoginScreen(true)} className="game-btn flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-[0px_3px_0px_#000] active:shadow-none active:translate-y-[3px]">
                                    <LogIn size={18} strokeWidth={2.5} /> <span>로그인</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-slate-100">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t-2 border-slate-100">
                    <div className="px-4 py-5 space-y-4">
                        <div className="flex flex-col gap-2">
                            {mainMenus.map((menu) => (
                                <button
                                    key={menu.name}
                                    onClick={() => handleNavClick(menu.name)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        currentTab === menu.name ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {menu.icon && <menu.icon size={16} strokeWidth={2.5} />}
                                        {menu.name}
                                    </div>
                                    <ChevronRight size={16} />
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleNavClick('즐겨찾기')} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-yellow-50 text-yellow-600">
                                <Star size={16} className="fill-yellow-500" /> 내 즐겨찾기
                            </button>
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600">
                                    <LogOut size={16} /> 로그아웃
                                </button>
                            ) : (
                                <button onClick={() => setShowLoginScreen(true)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white">
                                    <LogIn size={16} /> 로그인
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Search Bar */}
            {showStickySearch && (
                <div className="hidden md:block bg-white border-t-2 border-slate-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Gamepad2 size={18} />
                                <select className="bg-transparent text-sm font-semibold text-slate-600 focus:outline-none" value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                                    {gameList.map((game) => (
                                        <option key={game} value={game}>{game}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="필요한 스킬을 검색해보세요" className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-blue-200 text-sm" />
                            </div>
                            <button className="game-btn bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0px_3px_0px_#000] active:shadow-none active:translate-y-[3px]">검색</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
    };
})();
