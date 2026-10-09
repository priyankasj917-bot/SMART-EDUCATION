        useEffect(() => {
            if (!isFaculty) {
                const mySlots = slots.filter(s => s.studentId === auth?.username);
                const activeBooking = mySlots.find(s => s.status !== 'CANCELLED');
                const booking = activeBooking || mySlots.find(s => s.status === 'CANCELLED');
                
                setMyBooking(booking || null);
                
                if (activeBooking && view !== 'timeline' && view !== 'book_slot') {
                    setView('timeline');
                }
            }
        }, [slots, isFaculty, auth?.username, view]);

        const pushNotif = (notif) => {
            const allNotifs = JSON.parse(localStorage.getItem('cf_notifications') || '[]');
            const msg = notif.message.toLowerCase();
            const category = notif.category || (msg.includes('fee') || msg.includes('token') ? 'fees' : msg.includes('od ') ? 'od' : 'system');
            allNotifs.unshift({ ...notif, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), category, time: new Date().toISOString(), read: false });
            localStorage.setItem('cf_notifications', JSON.stringify(allNotifs));
            window.dispatchEvent(new Event('cf_notify'));
        };

        const handleCancelToken = (slotId) => {
            if (!window.confirm("Are you sure you want to cancel this fee payment token?")) return;
            
            const slotToCancel = slots.find(s => s.id === slotId);
            if (!slotToCancel || slotToCancel.status === 'COMPLETED') return;

            const cancelledRecord = { ...slotToCancel, id: 'canc-' + Date.now(), status: 'CANCELLED', isHistory: true };
            
            const updated = slots.map(s => {
                if (s.id === slotId) {
                    return { ...s, status: 'AVAILABLE', studentId: null, studentName: null, department: null, token: null };
                }
                return s;
            });
            updated.push(cancelledRecord);

            localStorage.setItem('cf_fee_slots', JSON.stringify(updated));
            setSlots(updated);
            
            const acts = JSON.parse(localStorage.getItem('cf_activity')||'[]');
            acts.unshift({ id: Date.now(), text: `Token ${slotToCancel.token} cancelled`, time: new Date().toISOString() });
            localStorage.setItem('cf_activity', JSON.stringify(acts));

            pushNotif({
                targetRole: 'faculty',
                message: `Fee token ${slotToCancel.token} was cancelled by ${auth?.name}.`,
                details: `Slot Time: ${slotToCancel.time} is now available.`
            });
        };

        const handleBookSlot = (slot) => {
            const hasActive = slots.find(s => s.studentId === auth?.username && s.status !== 'CANCELLED');
            
            if (hasActive) {
                if (hasActive.status === 'COMPLETED' || hasActive.status === 'ACCEPTED') {
                    alert("You cannot change a token that has already been accepted or completed.");
                    return;
                }
                if (!window.confirm(`You already have a token for ${hasActive.time}. Do you want to cancel it and book ${slot.time} instead?`)) return;
            } else {
                if (!window.confirm(`Confirm booking for ${slot.time}?`)) return;
            }

            const tokenNum = `FQ-${Math.floor(Math.random()*100).toString().padStart(3,'0')}`;
            const updated = slots.map(s => {
                if (hasActive && s.id === hasActive.id) {
                    return { ...s, status: 'AVAILABLE', studentId: null, studentName: null, department: null, token: null };
                }
                if (s.id === slot.id) {
                    return { ...s, status: 'BOOKED', studentId: auth?.username, studentName: auth?.name, department: 'IT', token: tokenNum };
                }
                return s;
            });
            
            if (hasActive) {
                updated.push({ ...hasActive, id: 'canc-' + Date.now(), status: 'CANCELLED', isHistory: true });
                const acts = JSON.parse(localStorage.getItem('cf_activity')||'[]');
                acts.unshift({ id: Date.now(), text: `Token ${hasActive.token} cancelled, re-booked to ${slot.time}`, time: new Date().toISOString() });
                localStorage.setItem('cf_activity', JSON.stringify(acts));
            } else {
                const acts = JSON.parse(localStorage.getItem('cf_activity')||'[]');
                acts.unshift({ id: Date.now(), text: `Fee slot ${slot.time} booked by ${auth?.name}`, time: new Date().toISOString() });
                localStorage.setItem('cf_activity', JSON.stringify(acts));
            }

            localStorage.setItem('cf_fee_slots', JSON.stringify(updated));
            setSlots(updated);
            setView('timeline');
            
            pushNotif({
                targetRole: 'faculty',
                message: `Student ${auth?.name} (${auth?.username}) booked a new fee slot.`,
                details: `New Token: ${tokenNum} | Time: ${slot.time}`
            });
        };
