        const renderFacultyDashboard = () => {
            const pendingCount = apps.filter(a => a.status === 'PENDING').length;
            const approvedCount = apps.filter(a => a.status === 'APPROVED').length;
            const rejectedCount = apps.filter(a => a.status === 'REJECTED').length;

            const filteredApps = apps.filter(a => filter === 'ALL' || a.status === filter);
            const displayedApps = filteredApps.slice(0, visibleCount);

            return (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8">
                    <div className="flex justify-between items-center bg-white/70 backdrop-blur-xl p-8 rounded-[32px] shadow-glass border border-white">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">SMART OD VERIFICATION</h2>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Review and verify student OD requests</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-glass border border-white flex flex-col items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Requests</p>
                            <p className="text-3xl font-black text-slate-800">{apps.length}</p>
                        </div>
                        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-glass border border-white flex flex-col items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Pending</p>
                            <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
                        </div>
                        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-glass border border-white flex flex-col items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Approved</p>
                            <p className="text-3xl font-black text-emerald-600">{approvedCount}</p>
                        </div>
                        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-glass border border-white flex flex-col items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">Rejected</p>
                            <p className="text-3xl font-black text-rose-600">{rejectedCount}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h3 className="text-lg font-black text-slate-800">Student Requests</h3>
                            <div className="flex flex-wrap gap-2">
                                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                                    <button key={f} onClick={() => { setFilter(f); setVisibleCount(10); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all outline-none ${filter === f ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {displayedApps.length === 0 && (
                                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-sm font-bold text-slate-500">No requests found for this filter.</p>
                                </div>
                            )}
                            {displayedApps.map(app => (
                                <div key={app.id} className="border border-slate-100 rounded-3xl p-6 bg-slate-50 hover:bg-white hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{app.id}</span>
                                            <h4 className="text-lg font-black text-slate-800">{app.studentName || 'Demo Student'} <span className="text-sm text-slate-400 font-bold ml-1">({app.studentId || 'ID Unavailable'})</span></h4>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                                            <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Event Name</p><p className="text-xs font-black text-slate-700">{app.eventName}</p></div>
                                            <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">OD Date</p><p className="text-xs font-black text-slate-700">{app.odDate}</p></div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Academic Cal.</p>
                                                {app.academicConflict ? <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-1 rounded">⚠ EXAM CONFLICT</span> : <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded">✓ NO CONFLICT</span>}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Event Check</p>
                                                {app.officialEvent ? <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded">✓ OFFICIAL</span> : <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-1 rounded">⚠ UNOFFICIAL</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[160px]">
                                        <div className="text-center mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${app.status==='APPROVED'?'bg-emerald-100 text-emerald-600':app.status==='REJECTED'?'bg-rose-100 text-rose-600':'bg-blue-100 text-blue-600'}`}>{app.status}</span>
                                        </div>
                                        {app.status === 'PENDING' && !rejectPrompt && (
                                            <>
                                                <button disabled={app.academicConflict || !app.officialEvent} onClick={() => handleFacultyDecision(app.id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">APPROVE OD</button>
                                                <button onClick={() => { setRejectPrompt(app.id); setRejectReason('OD rejected due to examination schedule.'); }} className="bg-rose-100 hover:bg-rose-200 text-rose-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">REJECT OD</button>
                                                {(app.academicConflict || !app.officialEvent) && <p className="text-[8px] text-center font-black text-rose-500 uppercase mt-1">APPROVAL BLOCKED</p>}
                                            </>
                                        )}
                                        {rejectPrompt === app.id && (
                                            <div className="flex flex-col gap-2 mt-2 bg-rose-50 p-3 rounded-2xl border border-rose-100">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-rose-600">Select Reason:</p>
                                                <select value={rejectReason} onChange={e=>setRejectReason(e.target.value)} className="w-full text-[10px] font-bold text-slate-700 bg-white border border-rose-200 rounded-lg p-2 outline-none">
                                                    <option>OD rejected due to examination schedule.</option>
                                                    <option>OD rejected due to academic event conflict.</option>
                                                    <option>OD rejected because the event is not officially verified.</option>
                                                    <option>Insufficient details provided.</option>
                                                </select>
                                                <div className="flex gap-2 mt-1">
                                                    <button onClick={() => setRejectPrompt(null)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50">Cancel</button>
                                                    <button onClick={() => { handleFacultyDecision(app.id, 'rejected', rejectReason); setRejectPrompt(null); }} className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-sm">Confirm</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {visibleCount < filteredApps.length && (
                                <div className="text-center pt-6">
                                    <button onClick={() => setVisibleCount(v => v + 10)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Load More Requests ({filteredApps.length - visibleCount} Remaining)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        };
