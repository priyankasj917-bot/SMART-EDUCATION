        const renderTimeline = () => {
            if (!myBooking) return null;
            const steps = myBooking.status === 'CANCELLED' ? [
                { label: 'Slot Selected', active: true },
                { label: 'Token Cancelled', active: true }
            ] : [
                { label: 'Slot Selected', active: true },
                { label: 'Slot Booked', active: true },
                { label: 'Waiting for Student Affairs', active: myBooking.status !== 'BOOKED' },
                { label: 'Token Accepted', active: myBooking.status === 'ACCEPTED' || myBooking.status === 'COMPLETED' },
                { label: 'Proceed to Admission Office', active: myBooking.status === 'ACCEPTED' || myBooking.status === 'COMPLETED' },
                { label: 'Payment Completed', active: myBooking.status === 'COMPLETED' }
            ];
            
            return (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm ${myBooking.status === 'CANCELLED' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                            {myBooking.status === 'CANCELLED' ? '✕' : '✓'}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                            {myBooking.status === 'CANCELLED' ? 'SLOT CANCELLED' : 'SLOT BOOKED'}
                        </h3>
                        <div className="inline-block bg-slate-50 border border-slate-100 px-8 py-4 rounded-3xl mb-8 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Token Number</p>
                            <p className="text-3xl font-mono font-black text-blue-600">{myBooking.token}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto mb-10 bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p><p className="text-sm font-black text-slate-700">{myBooking.date}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p><p className="text-sm font-black text-slate-700">{myBooking.time}</p></div>
                            <div className="col-span-2 pt-2"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p><p className={`text-sm font-black uppercase ${myBooking.status === 'CANCELLED' ? 'text-rose-600' : 'text-blue-600'}`}>{myBooking.status === 'BOOKED' ? 'WAITING FOR CONFIRMATION' : myBooking.status}</p></div>
                        </div>

                        <div className="text-left max-w-sm mx-auto relative pl-8 border-l-2 border-slate-100 space-y-8 mb-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-[5px] border-white shadow-sm ${step.active ? (myBooking.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
                                    <p className={`text-sm font-black tracking-wide ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                                </div>
                            ))}
                        </div>

                        {myBooking.status !== 'COMPLETED' && myBooking.status !== 'CANCELLED' && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t border-slate-100">
                                <button onClick={() => handleCancelToken(myBooking.id)} className="px-6 py-3 rounded-xl border-2 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto">
                                    CANCEL TOKEN
                                </button>
                                <button onClick={() => setView('book_slot')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto">
                                    CHOOSE ANOTHER SLOT
                                </button>
                            </div>
                        )}
                        {myBooking.status === 'CANCELLED' && (
                            <div className="pt-8 border-t border-slate-100">
                                <p className="text-sm font-bold text-rose-500 mb-4">This token has been cancelled.</p>
                                <button onClick={() => setView('book_slot')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] text-[10px] font-black uppercase tracking-widest transition-all inline-block">
                                    BOOK NEW SLOT
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        };

        const renderFacultyList = () => {
