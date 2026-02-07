const NexonSkills = window.NexonSkills;

NexonSkills.components.DomainTooltip = ({ title, domain }) => (
    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 top-full mt-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-xl z-50 pointer-events-none min-w-[max-content] text-center border-2 border-white">
        <div className="text-sm font-bold mb-0.5 text-yellow-300">{title}</div>
        <div className="text-[11px] text-slate-300 font-mono">{domain}</div>
    </div>
);

NexonSkills.components.NewsThumbnail = ({ category }) => {
    const getColors = () => {
        switch (category) {
            case 'Model Update':
                return { bg: 'bg-indigo-100', text: 'text-indigo-600', fill: '#4F46E5', border: 'border-indigo-200' };
            case 'Industry':
                return { bg: 'bg-emerald-100', text: 'text-emerald-600', fill: '#059669', border: 'border-emerald-200' };
            case 'Tutorial':
                return { bg: 'bg-amber-100', text: 'text-amber-600', fill: '#D97706', border: 'border-amber-200' };
            default:
                return { bg: 'bg-rose-100', text: 'text-rose-600', fill: '#E11D48', border: 'border-rose-200' };
        }
    };
    const colors = getColors();
    const renderGraphic = () => {
        if (category === 'Model Update') {
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full p-8 opacity-90">
                    <circle cx="50" cy="50" r="30" fill={colors.fill} opacity="0.2" />
                    <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="none" stroke={colors.fill} strokeWidth="6" strokeLinejoin="round" />
                    <circle cx="50" cy="50" r="10" fill={colors.fill} />
                    <circle cx="50" cy="20" r="4" fill={colors.fill} />
                    <circle cx="80" cy="50" r="4" fill={colors.fill} />
                    <circle cx="50" cy="80" r="4" fill={colors.fill} />
                    <circle cx="20" cy="50" r="4" fill={colors.fill} />
                </svg>
            );
        }
        if (category === 'Industry') {
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full p-8 opacity-90">
                    <rect x="20" y="40" width="20" height="40" rx="4" fill={colors.fill} opacity="0.6" />
                    <rect x="45" y="25" width="20" height="55" rx="4" fill={colors.fill} opacity="0.8" />
                    <rect x="70" y="35" width="20" height="45" rx="4" fill={colors.fill} opacity="0.4" />
                    <line x1="10" y1="90" x2="90" y2="90" stroke={colors.fill} strokeWidth="6" strokeLinecap="round" />
                </svg>
            );
        }
        if (category === 'Tutorial') {
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full p-8 opacity-90">
                    <rect x="25" y="20" width="50" height="60" rx="8" fill="none" stroke={colors.fill} strokeWidth="6" />
                    <line x1="35" y1="35" x2="65" y2="35" stroke={colors.fill} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                    <line x1="35" y1="50" x2="65" y2="50" stroke={colors.fill} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                    <line x1="35" y1="65" x2="50" y2="65" stroke={colors.fill} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                    <circle cx="75" cy="80" r="12" fill={colors.fill} />
                    <path d="M71 80 L74 83 L79 77" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }
        return (
            <svg viewBox="0 0 100 100" className="w-full h-full p-8 opacity-90">
                <circle cx="50" cy="40" r="15" fill={colors.fill} />
                <path d="M25 80 Q50 60 75 80" fill="none" stroke={colors.fill} strokeWidth="10" strokeLinecap="round" />
                <circle cx="25" cy="50" r="8" fill={colors.fill} opacity="0.5" />
                <circle cx="75" cy="50" r="8" fill={colors.fill} opacity="0.5" />
            </svg>
        );
    };
    return (
        <div className={`aspect-video ${colors.bg} rounded-3xl mb-4 overflow-hidden relative border-2 ${colors.border} group-hover:scale-105 transition-transform duration-300`}>
            <div className="absolute inset-0 flex items-center justify-center">{renderGraphic()}</div>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-800 uppercase tracking-wider shadow-sm border border-slate-100">
                {category}
            </div>
        </div>
    );
};
