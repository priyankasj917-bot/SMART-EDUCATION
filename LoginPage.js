    const LoginPage = ({ onLogin }) => {
        const [savedUser] = useState(() => {
            try { return JSON.parse(localStorage.getItem('cf_remembered_user') || 'null'); } catch(e) { return null; }
        });
        
        const [role, setRole] = useState(savedUser?.role || 'student');
        const [username, setUsername] = useState(savedUser?.username || '');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setRememberMe] = useState(!!savedUser);
        const [showDemo, setShowDemo] = useState(false);
        const [error, setError] = useState('');
        const [isAuthenticating, setIsAuthenticating] = useState(false);
        const [success, setSuccess] = useState(false);
        const [failedAttempts, setFailedAttempts] = useState(0);
        const [lockoutTimer, setLockoutTimer] = useState(0);

        useEffect(() => {
            let int;
            if (lockoutTimer > 0) {
                int = setInterval(() => setLockoutTimer(t => t - 1), 1000);
            }
            return () => clearInterval(int);
        }, [lockoutTimer]);

        const handleLogin = (e) => {
            e.preventDefault();
            if (lockoutTimer > 0) return;
            if (!username.trim()) return setError("Please enter your username.");
            if (!password) return setError("Please enter your password.");

            setIsAuthenticating(true);
            setError('');

            setTimeout(() => {
                let valid = false;
                let name = '';
                if (role === 'student' && username === 'student001' && password === 'Student@123') { valid = true; name = 'Priyanka S'; }
                if (role === 'faculty' && username === 'faculty001' && password === 'Faculty@123') { valid = true; name = 'Dr. Anitha Kumar'; }
                if (role === 'admin' && username === 'admin001' && password === 'Admin@123') { valid = true; name = 'System Admin'; }

                if (valid) {
                    if (rememberMe) {
                        localStorage.setItem('cf_remembered_user', JSON.stringify({ username, role }));
                    } else {
                        localStorage.removeItem('cf_remembered_user');
                    }
                    
                    setFailedAttempts(0);
                    setSuccess(true);
                    setTimeout(() => {
                        onLogin({ isLoggedIn: true, role, username, name });
                    }, 1000);
                } else {
                    setIsAuthenticating(false);
                    const attempts = failedAttempts + 1;
                    setFailedAttempts(attempts);
                    if (attempts >= 3) {
                        setLockoutTimer(15);
                        setError(`Too many failed attempts. Please try again in 15 seconds.`);
                    } else {
                        setError("Invalid username or password.");
                    }
                }
            }, 1000);
        };

        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text);
        };

        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] text-slate-800 font-sans relative zoom-bg">
                <div className="w-full flex items-center justify-center p-6 bg-slate-50/5 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10 my-8">
                        <div className="bg-white rounded-[32px] shadow-2xl p-8 border border-slate-100">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">WELCOME BACK</h2>
                                <p className="text-sm font-bold text-slate-500 mt-2">Welcome back! Sign in to continue.</p>
                            </div>

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">LOGIN AS</p>
                            <div className="flex gap-1 mb-8 bg-slate-100 p-1.5 rounded-2xl">
                                <button type="button" onClick={()=>setRole('student')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1.5 transition-all ${role==='student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}><Icons.Users /> STUDENT</button>
                                <button type="button" onClick={()=>setRole('faculty')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1.5 transition-all ${role==='faculty' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}><Icons.Document /> FACULTY</button>
                                <button type="button" onClick={()=>setRole('admin')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1.5 transition-all ${role==='admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}><Icons.Settings /> ADMIN</button>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {error && <div className="bg-rose-50 text-rose-600 border border-rose-200 p-3 rounded-xl text-xs font-bold text-center">{error}</div>}
                                
                                <div>
                                    <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Username / {role==='student'?'Student ID':role==='faculty'?'Faculty ID':'Admin ID'}</label>
                                    <input id="username" type="text" autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder={role==='student'?'Enter Student ID':role==='faculty'?'Enter Faculty ID':'Enter Admin ID'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                                    <div className="relative">
                                        <input id="password" type={showPassword?'text':'password'} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                        <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg font-black outline-none" aria-label="Toggle Password Visibility">👁</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                                        <span className="text-xs font-bold text-slate-600">Remember me</span>
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        <button type="button" onClick={()=>alert("Please contact the IT Helpdesk to reset your password.")} className="text-xs font-bold text-slate-400 hover:text-slate-600">Forgot Password?</button>
                                    </div>
                                </div>

                                <button disabled={lockoutTimer > 0 || isAuthenticating || success} type="submit" className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all mt-4 flex items-center justify-center gap-2 ${success ? 'bg-emerald-500 text-white shadow-emerald-500/30' : lockoutTimer > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 outline-none'}`}>
                                    {success ? '✓ AUTHENTICATED' : isAuthenticating ? 'AUTHENTICATING...' : lockoutTimer > 0 ? `Try again in ${lockoutTimer}s` : 'LOGIN'}
                                </button>
                            </form>
                            
                            {/* QUICK LOGIN TIPS SECTION */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Icons.Help /> Quick Login Tips
                                </h3>
                                <ul className="text-xs text-slate-500 space-y-2 mb-4 font-medium">
                                    <li><strong className="text-slate-700">Returning user:</strong> Your saved ID and role can be filled in automatically when Remember Me is enabled.</li>
                                    <li><strong className="text-slate-700">Password help:</strong> Your browser may offer to save or autofill a password securely if allowed.</li>
                                    <li><strong className="text-slate-700">First-time user:</strong> <button type="button" onClick={() => setShowDemo(!showDemo)} className="text-blue-600 hover:underline font-bold focus:outline-none">{showDemo ? 'Hide Demo Credentials' : 'Show Demo Credentials'}</button></li>
                                </ul>
                                
                                <AnimatePresence>
                                    {showDemo && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 space-y-3">
                                                {[
                                                    { r: 'STUDENT', u: 'student001', p: 'Student@123', c: 'text-blue-600' },
                                                    { r: 'FACULTY', u: 'faculty001', p: 'Faculty@123', c: 'text-indigo-600' },
                                                    { r: 'ADMIN', u: 'admin001', p: 'Admin@123', c: 'text-purple-600' }
                                                ].map(demo => (
                                                    <div key={demo.r} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{demo.r}</p>
                                                            <p className="text-xs font-bold text-slate-700">ID: <span className={demo.c}>{demo.u}</span></p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-white px-2 py-1 rounded text-xs font-mono font-bold text-slate-600 border border-slate-200">
                                                                {showPassword ? demo.p : '••••••••••'}
                                                            </div>
                                                            <button type="button" onClick={() => copyToClipboard(demo.u)} className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-bold uppercase transition-colors" title="Copy ID">Copy ID</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-2 leading-tight">
                                    <strong className="text-slate-600 shrink-0">Security tip:</strong> Do not enable Remember Me on a shared or public computer.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };
