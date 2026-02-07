// Developer console credentials view.
const { ShieldCheck, Copy } = window.LucideReact;

const CREDENTIALS = [
    { name: 'Prod API Key', prefix: 'nk_prod_...', created: '2025-01-10', used: 'Just now' },
    { name: 'Dev Test Key', prefix: 'nk_dev_...', created: '2025-02-15', used: '2 days ago' },
    { name: 'Legacy Key 2024', prefix: 'nk_old_...', created: '2024-11-20', used: 'Inactive' },
];

const CredentialsView = ({ setSelectedItem }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-900">내 크리덴셜</h2>
        <div className="bg-white border-2 border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-semibold border-b-2 border-slate-100 uppercase tracking-wider"><tr><th className="px-6 py-5">Name</th><th className="px-6 py-5">Key Prefix</th><th className="px-6 py-5">Created</th><th className="px-6 py-5">Last Used</th><th className="px-6 py-5 text-right">Action</th></tr></thead>
                <tbody className="divide-y-2 divide-slate-50">
                    {CREDENTIALS.map((key, i) => (
                        <tr key={i} onClick={() => setSelectedItem({ type: 'Credential', title: key.name, desc: `Prefix: ${key.prefix}\nCreated: ${key.created}\nLast Used: ${key.used}\n\n보안 키 정보입니다. 타인에게 노출되지 않도록 주의하세요.`, author: 'System', stars: 0 })} className="hover:bg-blue-50/50 cursor-pointer transition-colors">
                            <td className="px-6 py-5 font-bold text-slate-900 flex items-center gap-3"><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck size={18}/></div>{key.name}</td><td className="px-6 py-5 font-mono text-slate-500 font-medium bg-slate-50/50">{key.prefix}</td><td className="px-6 py-5 text-slate-500 font-medium">{key.created}</td><td className="px-6 py-5 text-slate-500 font-medium">{key.used}</td><td className="px-6 py-5 text-right"><button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-100 rounded-lg"><Copy size={18}/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end"><button className="game-btn bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 shadow-[0px_4px_0px_#000] active:shadow-none active:translate-y-[4px]">새 키 발급받기</button></div>
        </div>
    </div>
);

window.AppComponents.CredentialsView = CredentialsView;
