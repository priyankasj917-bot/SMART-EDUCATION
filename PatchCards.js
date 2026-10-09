        const getBusyCount = () => staffData.filter(s => ['BUSY', 'IN CLASS', 'IN MEETING', 'DEPARTMENT WORK', 'STUDENT CONSULTATION'].includes(s.status)).length;
        const getDutyCount = () => staffData.filter(s => s.status.includes('DUTY')).length;
        const getLeaveCount = () => staffData.filter(s => s.status === 'LEAVE' || s.status === 'HALF-DAY PERMISSION').length;
