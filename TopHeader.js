    const TopHeader = ({ auth, onLogout, onNavigate }) => {
        const [showNotifs, setShowNotifs] = useState(false);
        const [notifs, setNotifs] = useState([]);
        const [filter, setFilter] = useState('all');

        const fetchNotifs = () => {
            const allNotifs = JSON.parse(localStorage.getItem('cf_notifications') || '[]');
            const myNotifs = allNotifs.filter(n => n.targetRole === auth?.role || n.targetUsername === auth?.username);
            setNotifs(myNotifs);
        };

        useEffect(() => {
            fetchNotifs();
            window.addEventListener('cf_notify', fetchNotifs);
            return () => window.removeEventListener('cf_notify', fetchNotifs);
        }, [auth]);

        const unreadCount = notifs.filter(n => !n.read).length;

        const markAllAsRead = () => {
            const allNotifs = JSON.parse(localStorage.getItem('cf_notifications') || '[]');
            const updated = allNotifs.map(n => (n.targetRole === auth?.role || n.targetUsername === auth?.username) ? { ...n, read: true } : n);
            localStorage.setItem('cf_notifications', JSON.stringify(updated));
            fetchNotifs();
        };

        const markAsRead = (id, targetCategory) => {
            const allNotifs = JSON.parse(localStorage.getItem('cf_notifications') || '[]');
            const updated = allNotifs.map(n => n.id === id ? { ...n, read: true } : n);
            localStorage.setItem('cf_notifications', JSON.stringify(updated));
            fetchNotifs();
            if(onNavigate && targetCategory) {
                if(targetCategory === 'fees') onNavigate('fees');
                if(targetCategory === 'od') onNavigate('smartod');
                if(targetCategory === 'staff') onNavigate('staff');
                setShowNotifs(false);
            }
        };

        const filteredNotifs = notifs.filter(n => {
            if (filter === 'unread') return !n.read;
            if (filter === 'all') return true;
            return n.category === filter;
        });

        const getNotifIcon = (category, message) => {
            const msg = message.toLowerCase();
            if (msg.includes('rejected')) return <div className="text-rose-500 bg-rose-50 p-1.5 rounded-full"><Icons.AlertTriangle /></div>;
            if (msg.includes('approved') || msg.includes('accepted') || msg.includes('successfully')) return <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-full"><Icons.CheckCircle /></div>;
            if (category === 'fees') return <div className="text-blue-500 bg-blue-50 p-1.5 rounded-full"><Icons.Clock /></div>;
            if (category === 'od') return <div className="text-purple-500 bg-purple-50 p-1.5 rounded-full"><Icons.Document /></div>;
            return <div className="text-slate-500 bg-slate-100 p-1.5 rounded-full"><Icons.Bell /></div>;
        };

        const formatTime = (isoString) => {
            const d = new Date(isoString);
            const now = new Date();
            const diffMs = now - d;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffMins < 1440) return `${Math.floor(diffMins/60)}h ago`;
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        };

        return (
           <header className="h-24 px-6 lg:px-10 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-200/50 z-40 sticky top-0 shadow-sm">
              <div className="flex-1 max-w-xl relative group">
                 <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors"><Icons.Search /></div>
                 <input type="text" placeholder="Search students, staff, rooms, or requests..." className="w-full bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full py-3.5 pl-14 pr-20 text-sm font-semibold text-slate-700 placeholder:text-slate-400 transition-all outline-none" />
              </div>
              <div className="flex items-center gap-4 sm:gap-6 pl-4 relative">
                 <div className="relative">
                     <button onClick={() => setShowNotifs(!showNotifs)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all outline-none relative ${showNotifs ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Icons.Bell />
                        {unreadCount > 0 && <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_0_2px_white]"></span></span>}
                     </button>
                     
                     <AnimatePresence>
                         {showNotifs && (
                             <motion.div initial={{opacity:0, y:10, scale:0.95}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:10, scale:0.95}} transition={{duration:0.15}} className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden z-50 flex flex-col">
                                 {/* Header */}
                                 <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                                     <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">Notifications {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}</h3>
                                     {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Mark all read</button>}
                                 </div>
                                 
                                 {/* Filters */}
                                 <div className="px-3 pt-3 flex gap-1 overflow-x-auto bg-slate-50 border-b border-slate-100 no-scrollbar">
                                     {['all', 'unread', 'fees', 'od', 'staff'].map(f => (
                                         <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold capitalize rounded-t-lg transition-all ${filter === f ? 'bg-white text-blue-600 border border-slate-200 border-b-white shadow-[0_-2px_4px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                                            {f}
                                         </button>
                                     ))}
                                 </div>

                                 {/* List */}
                                 <div className="max-h-[360px] overflow-y-auto bg-white">
                                     {filteredNotifs.length === 0 ? (
                                         <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                                             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3"><Icons.Bell /></div>
                                             <p className="text-sm text-slate-800 font-bold mb-1">No notifications here</p>
                                             <p className="text-xs text-slate-500">You're all caught up!</p>
                                         </div>
                                     ) : filteredNotifs.map(n => (
                                         <div key={n.id} onClick={() => markAsRead(n.id, n.category)} className={`group px-5 py-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex gap-3 relative ${!n.read ? 'bg-blue-50/20' : ''}`}>
                                             {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                                             <div className="mt-0.5 shrink-0">{getNotifIcon(n.category, n.message)}</div>
                                             <div className="flex-1 min-w-0">
                                                 <p className={`text-sm leading-snug mb-1 ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.message}</p>
                                                 {n.details && <p className="text-xs font-medium text-slate-500 truncate mb-1.5">{n.details}</p>}
                                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatTime(n.time)}</p>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                                 
                                 {/* Footer */}
                                 <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                     <button className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors w-full py-1">View All Notifications</button>
                                 </div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                 </div>
                 <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                 <button onClick={() => {if(window.confirm("Are you sure you want to logout?")) onLogout();}} className="flex items-center gap-3 hover:bg-slate-100/50 p-1.5 pr-4 rounded-full transition-all outline-none">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-black shadow-md border-2 border-white">{auth?.name?.substring(0,2).toUpperCase() || 'U'}</div>
                    <div className="hidden md:flex flex-col items-start"><span className="text-sm font-bold text-slate-800">{auth?.name || 'User'}</span><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{auth?.role?.toUpperCase()} • {auth?.username?.toUpperCase() || 'ID'}</span></div>
                    <Icons.ChevronDown className="text-slate-400 hidden md:block" />
                 </button>
              </div>
           </header>
        );
    };
