    const StaffMatrixSystem = ({ auth }) => {
        const [staffData, setStaffData] = useState(() => JSON.parse(localStorage.getItem('cf_staff')) || []);
        const [filterDept, setFilterDept] = useState('All Departments');
        const [filterStatus, setFilterStatus] = useState('All Status');
        const [searchQ, setSearchQ] = useState('');
        const [toastMsg, setToastMsg] = useState('');
        
        // Timetable Editing State
        const [ttDay, setTtDay] = useState('Monday');
        const [ttTime, setTtTime] = useState('9:00 AM');
        const [ttStatus, setTtStatus] = useState('AVAILABLE');
        const [viewTimetableFor, setViewTimetableFor] = useState(null);

        const isFaculty = auth?.role === 'faculty';
        const myStaffRecord = staffData.find(s => s.id === auth?.username);

        const handleStatusChange = (newStatus) => {
            const nowTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
            const updated = staffData.map(s => s.id === auth?.username ? { ...s, status: newStatus, lastUpdated: nowTime } : s);
            localStorage.setItem('cf_staff', JSON.stringify(updated));
            setStaffData(updated);

            const acts = JSON.parse(localStorage.getItem('cf_activity')||'[]');
            acts.unshift({ id: Date.now(), text: `${auth?.name} changed global status to ${newStatus}`, time: new Date().toISOString() });
            localStorage.setItem('cf_activity', JSON.stringify(acts));

            setToastMsg('Global Availability updated.');
            setTimeout(() => setToastMsg(''), 3000);
        };

        const handleTimetableUpdate = (overrideStatus = null) => {
            const targetStatus = overrideStatus || ttStatus;
            const updated = staffData.map(s => {
                if (s.id === auth?.username) {
                    const currentTt = s.timetable || {};
                    const currentDay = currentTt[ttDay] || {};
                    const newDay = { ...currentDay, [ttTime]: targetStatus };
                    const newTt = { ...currentTt, [ttDay]: newDay };
                    return { ...s, timetable: newTt };
                }
                return s;
            });
            localStorage.setItem('cf_staff', JSON.stringify(updated));
            setStaffData(updated);
            setToastMsg(`Timetable updated for ${ttDay} ${ttTime}.`);
            setTimeout(() => setToastMsg(''), 3000);
            if(overrideStatus) setTtStatus(overrideStatus);
        };

        const filteredStaff = staffData.filter(s => {
            if (filterDept !== 'All Departments' && s.department !== filterDept) return false;
            if (filterStatus !== 'All Status' && s.status !== filterStatus) return false;
            if (searchQ && !s.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
            return true;
        });

        const statusColors = {
            'AVAILABLE': 'bg-emerald-500', 'BUSY': 'bg-rose-500', 'IN CLASS': 'bg-blue-500',
            'IN MEETING': 'bg-amber-500', 'EXAM-HALL DUTY': 'bg-purple-500', 'LAB DUTY': 'bg-cyan-500',
            'DEPARTMENT WORK': 'bg-indigo-500', 'STUDENT CONSULTATION': 'bg-teal-500', 'EVENT DUTY': 'bg-fuchsia-500',
            'LEAVE': 'bg-slate-400', 'HALF-DAY PERMISSION': 'bg-orange-500', 'OUT OF OFFICE': 'bg-gray-500',
            'ON DUTY': 'bg-violet-500', 'NOT AVAILABLE': 'bg-red-600'
        };
        
        const availabilityOptions = Object.keys(statusColors);

        const notationMap = {
            'AVAILABLE': { label: 'AVL', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            'BUSY': { label: 'BSY', bg: 'bg-rose-50 text-rose-700 border-rose-100' },
            'IN CLASS': { label: 'CLS', bg: 'bg-blue-50 text-blue-700 border-blue-100' },
            'IN MEETING': { label: 'MTG', bg: 'bg-amber-50 text-amber-700 border-amber-100' },
            'EXAM-HALL DUTY': { label: 'EXM', bg: 'bg-purple-50 text-purple-700 border-purple-100' },
            'LAB DUTY': { label: 'LAB', bg: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
            'DEPARTMENT WORK': { label: 'DEP', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
            'STUDENT CONSULTATION': { label: 'CON', bg: 'bg-teal-50 text-teal-700 border-teal-100' },
            'EVENT DUTY': { label: 'EVT', bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100' },
            'LEAVE': { label: 'LV', bg: 'bg-slate-50 text-slate-700 border-slate-200' },
            'HALF-DAY PERMISSION': { label: 'HD', bg: 'bg-orange-50 text-orange-700 border-orange-100' },
            'OUT OF OFFICE': { label: 'OOO', bg: 'bg-gray-50 text-gray-700 border-gray-200' },
            'ON DUTY': { label: 'OD', bg: 'bg-violet-50 text-violet-700 border-violet-100' },
            'NOT AVAILABLE': { label: 'NAV', bg: 'bg-red-50 text-red-700 border-red-100' }
        };

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

        const getCellStatus = (staff, day, time) => {
            if (staff?.timetable?.[day]?.[time]) return staff.timetable[day][time];
            return 'AVAILABLE';
        };

        const TimetableGrid = ({ staff }) => (
            <div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-r border-slate-200 w-24">Time</th>
                                {days.map(d => <th key={d} className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 text-center">{d}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {times.map(t => (
                                <tr key={t} className="border-b border-slate-100 last:border-0">
                                    <td className="p-3 text-[10px] font-black tracking-widest text-slate-400 border-r border-slate-100 bg-slate-50/50 whitespace-nowrap">{t}</td>
                                    {days.map(d => {
                                        const status = getCellStatus(staff, d, t);
                                        const notation = notationMap[status] || notationMap['AVAILABLE'];
                                        return (
                                            <td key={d} className="p-1.5 text-center border-r border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                                <div className={`py-2 px-1 rounded-lg text-[10px] font-black tracking-wider border ${notation.bg}`}>
                                                    {notation.label}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {Object.entries(notationMap).map(([status, config]) => (
                        <div key={status} className="flex items-center gap-1.5">
                            <span className={`w-5 h-5 flex items-center justify-center rounded text-[8px] border ${config.bg}`}>{config.label}</span>
                            {status}
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-[1400px] mx-auto space-y-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            STAFF AVAILABILITY MATRIX <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </h2>
                        <p className="text-sm font-bold text-slate-500 mt-2 tracking-wide uppercase">Find the right staff member at the right time.</p>
                    </div>
                </div>

                {isFaculty && myStaffRecord && (
                    <div className="space-y-6">
                        {/* GLOBAL STATUS CARD */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">My Global Status</p>
                                <h3 className="text-xl font-black text-slate-800 mb-1">{auth.name}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusColors[myStaffRecord.status]?.replace('bg-','text-') || 'text-slate-600'} bg-slate-50 border border-slate-100`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors[myStaffRecord.status] || 'bg-slate-400'}`}></span>
                                        CURRENT STATUS: {myStaffRecord.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        Last Updated: {myStaffRecord.lastUpdated || 'Never'}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex flex-col gap-2 relative z-10">
                                <select 
                                    value={myStaffRecord.status} 
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full md:w-64 bg-slate-50 border border-slate-200 text-sm font-black text-slate-700 px-5 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                >
                                    {availabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            
                            <AnimatePresence>
                                {toastMsg && (
                                    <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="absolute bottom-4 right-8 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-20">
                                        <Icons.CheckSquare className="w-4 h-4 text-emerald-400" /> {toastMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* WEEKLY TIMETABLE CARD */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Icons.Clock /> Weekly Timetable
                            </h3>
                            
                            <div className="flex flex-col md:flex-row items-end gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Day</label>
                                    <select value={ttDay} onChange={e=>setTtDay(e.target.value)} className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20">
                                        {days.map(d=><option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Time Slot</label>
                                    <select value={ttTime} onChange={e=>setTtTime(e.target.value)} className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20">
                                        {times.map(t=><option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Slot Status</label>
                                    <select value={ttStatus} onChange={e=>setTtStatus(e.target.value)} className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20">
                                        {availabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button onClick={()=>handleTimetableUpdate()} className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md">
                                        Update Slot
                                    </button>
                                    <button onClick={()=>handleTimetableUpdate('AVAILABLE')} className="flex-1 md:flex-none px-6 py-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                                        Clear Slot
                                    </button>
                                </div>
                            </div>
                            
                            <TimetableGrid staff={myStaffRecord} />
                        </div>
                    </div>
                )}

                {/* DIRECTORY VIEW FOR STUDENTS AND ADMINS */}
                {!isFaculty && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available</p>
                                <p className="text-3xl font-black text-emerald-600">{staffData.filter(s=>s.status==='AVAILABLE').length} Staff</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Busy</p>
                                <p className="text-3xl font-black text-rose-600">{staffData.filter(s=>s.status==='BUSY').length} Staff</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">On Duty</p>
                                <p className="text-3xl font-black text-purple-600">{staffData.filter(s=>s.status==='EXAM-HALL DUTY').length} Staff</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leave / Permission</p>
                                <p className="text-3xl font-black text-slate-500">{staffData.filter(s=>s.status==='LEAVE' || s.status==='HALF-DAY PERMISSION').length} Staff</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
                                    <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search staff by name..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
                                </div>
                                <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} className="py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer">
                                    <option>All Departments</option>
                                    {['CSE','IT','ECE','EEE','MECH','CIVIL','VLSI','MBA','MCA'].map(d=><option key={d}>{d}</option>)}
                                </select>
                                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer">
                                    <option>All Status</option>
                                    {availabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredStaff.map((staff) => (
                                <div key={staff.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all flex flex-col h-full">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-500 font-black text-lg">
                                            {staff.name.charAt(4)}
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusColors[staff.status]?.replace('bg-','text-') || 'text-slate-500'} bg-slate-50 border border-slate-100`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[staff.status] || 'bg-slate-500'}`}></span>
                                            {staff.status}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800 mb-1">{staff.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{staff.designation}</p>
                                    
                                    <div className="space-y-2 mb-4 flex-1">
                                        <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID</span>
                                            <span className="text-xs font-black text-slate-700">{staff.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dept</span>
                                            <span className="text-xs font-black text-slate-700">{staff.department}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Room</span>
                                            <span className="text-xs font-black text-slate-700">{staff.room}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => setViewTimetableFor(staff)} className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                        <Icons.Clock /> View Timetable
                                    </button>
                                </div>
                            ))}
                            {filteredStaff.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-lg font-bold color-black text-slate-400">No staff found matching criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {viewTimetableFor && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setViewTimetableFor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></motion.div>
                            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative bg-white rounded-[32px] shadow-2xl p-6 lg:p-8 max-w-4xl w-full z-10 overflow-hidden max-h-[90vh] flex flex-col">
                                <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 mb-1">{viewTimetableFor.name}'s Timetable</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{viewTimetableFor.designation} • {viewTimetableFor.department}</p>
                                    </div>
                                    <button onClick={()=>setViewTimetableFor(null)} className="w-10 h-10 bg-slate-50 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors shrink-0">
                                        ✕
                                    </button>
                                </div>
                                <div className="overflow-y-auto no-scrollbar flex-1 pb-4">
                                    <TimetableGrid staff={viewTimetableFor} />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };
