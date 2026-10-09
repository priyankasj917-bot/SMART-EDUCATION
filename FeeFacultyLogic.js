        const renderFacultyList = () => {
            const activeSlots = slots.filter(s => !s.isHistory);
            return (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-[1200px] mx-auto space-y-6">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Affairs</h2>
                            <p className="text-sm font-bold text-slate-500 mt-1">Manage today's fee payment tokens</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Slots</p><p className="text-3xl font-black text-slate-800">{activeSlots.length}</p></div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booked</p><p className="text-3xl font-black text-blue-600">{activeSlots.filter(s=>s.status==='BOOKED').length}</p></div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Yet to Book</p><p className="text-3xl font-black text-slate-800">{activeSlots.filter(s=>s.status==='AVAILABLE').length}</p></div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accepted</p><p className="text-3xl font-black text-emerald-600">{activeSlots.filter(s=>s.status==='ACCEPTED').length}</p></div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-black text-slate-800">Today's Fee Tokens</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Token</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Department</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Booked Time</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeSlots.map(s => (
                                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="py-4 px-6 font-mono font-black text-blue-600 text-sm">{s.token || '—'}</td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-700">{s.studentName || '—'} {s.studentId && <span className="text-[10px] text-slate-400 ml-2">({s.studentId})</span>}</td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-600">{s.department || '—'}</td>
                                            <td className="py-4 px-6 text-sm font-black text-slate-700">{s.time}</td>
                                            <td className="py-4 px-6">
                                                {s.status === 'AVAILABLE' ? <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-slate-100 text-slate-500">YET TO BOOK</span> :
                                                 s.status === 'BOOKED' ? <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-blue-100 text-blue-600">{s.status}</span> :
                                                 <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-emerald-100 text-emerald-600">{s.status}</span>}
                                            </td>
                                            <td className="py-4 px-6">
                                                {s.status === 'BOOKED' ? (
                                                    <button onClick={()=>handleAcceptToken(s)} className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all outline-none shadow-sm">ACCEPT TOKEN</button>
                                                ) : <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">—</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            );
        };
