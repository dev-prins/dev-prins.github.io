document.addEventListener('DOMContentLoaded', () => {
    // !! मास्टर स्विच !!
    // इसे 'true' कर दें जब आप लॉगिन और प्रीमियम प्लान चालू करना चाहें
    const isPremiumEnabled = false;

    // Firebase सेवाएं
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
    const elements = {
        loginLogoutBtn: document.getElementById('login-logout-btn'),
        authControls: document.getElementById('auth-controls'),
        userGreeting: document.getElementById('user-greeting'),
        authModal: document.getElementById('auth-modal'),
        dateModal: document.getElementById('date-modal'),
        premiumModal: document.getElementById('premium-modal'),
        closeBtns: document.querySelectorAll('.close-btn'),
        signupBtn: document.getElementById('signup-btn'),
        loginBtn: document.getElementById('login-btn'),
        emailInput: document.getElementById('email-input'),
        passwordInput: document.getElementById('password-input'),
        currentMonthYearEl: document.getElementById('current-month-year'),
        daysGrid: document.getElementById('days-grid'),
        prevMonthBtn: document.getElementById('prev-month-btn'),
        nextMonthBtn: document.getElementById('next-month-btn'),
        monthlyPhoto: document.getElementById('monthly-photo'),
        monthlySound: document.getElementById('monthly-sound'),
        muteBtn: document.getElementById('mute-btn'),
        modalDate: document.getElementById('modal-date'),
        holidayReason: document.getElementById('holiday-reason'),
        noteInput: document.getElementById('note-input'),
        saveNoteBtn: document.getElementById('save-note-btn'),
        setAlarmBtn: document.getElementById('set-alarm-btn')
    };
    let state = { currentUser: null, isPremium: false, currentDate: new Date(), currentMonthHolidays: {} };

    const checkPremium = async (user) => user && (await db.collection('users').doc(user.uid).get()).data()?.isPremium === true;

    const setupUIForPremiumMode = () => {
        elements.authControls.style.display = 'flex';
        auth.onAuthStateChanged(async user => {
            state.currentUser = user;
            if (user) {
                state.isPremium = await checkPremium(user);
                elements.userGreeting.textContent = `नमस्ते, ${user.email.split('@')[0]}`;
                elements.loginLogoutBtn.textContent = 'लॉगआउट';
                elements.authModal.style.display = 'none';
            } else {
                state.isPremium = false;
                elements.userGreeting.textContent = 'नमस्ते, मेहमान';
                elements.loginLogoutBtn.textContent = 'लॉगिन';
            }
            renderCalendar(state.currentDate.getFullYear(), state.currentDate.getMonth());
        });
    };

    if (isPremiumEnabled) setupUIForPremiumMode();
    else renderCalendar(state.currentDate.getFullYear(), state.currentDate.getMonth());
    
    async function renderCalendar(year, month) {
        // ... (यह फंक्शन पहले जैसा ही है)
        elements.daysGrid.innerHTML = '<li>लोड हो रहा है...</li>';const firstDay = new Date(year, month, 1).getDay();const daysInMonth = new Date(year, month + 1, 0).getDate();elements.currentMonthYearEl.textContent = `${new Date(year, month).toLocaleString('hi-IN', { month: 'long' })} ${year}`;const monthId = `${year}-${String(month + 1).padStart(2, '0')}`;try {const monthDoc = await db.collection('panchangData').doc(monthId).get();state.currentMonthHolidays = {};if (monthDoc.exists) {const data = monthDoc.data();elements.monthlyPhoto.src = data.photoUrl || 'https://via.placeholder.com/900x250.png?text=महादिव्य+पंचांग';elements.monthlySound.src = data.soundUrl || '';state.currentMonthHolidays = data.holidays || {};} else {elements.monthlyPhoto.src = 'https://via.placeholder.com/900x250.png?text=महादिव्य+पंचांग';elements.monthlySound.src = '';}} catch (error) {console.error("Firebase से डेटा लाने में त्रुटि: ", error);elements.daysGrid.innerHTML = '<li>डेटा लोड नहीं हो सका।</li>';return;}elements.daysGrid.innerHTML = '';for (let i = 0; i < firstDay; i++) elements.daysGrid.insertAdjacentHTML('beforeend', '<div class="day empty"></div>');for (let i = 1; i <= daysInMonth; i++) {const dayDiv = document.createElement('div');dayDiv.classList.add('day');const date = new Date(year, month, i);const dayKey = String(i).padStart(2, '0');let content = `<span>${i}</span>`;if (state.currentMonthHolidays[dayKey] || date.getDay() === 0) {dayDiv.classList.add('holiday');const reason = state.currentMonthHolidays[dayKey] || 'रविवार';content += `<div class="holiday-name">${reason}</div>`;}dayDiv.innerHTML = content;dayDiv.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${dayKey}`;if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) dayDiv.classList.add('today');elements.daysGrid.appendChild(dayDiv);}
    }

    const handleFeatureAccess = (callback) => {
        if (isPremiumEnabled && !state.isPremium) {
            elements.dateModal.style.display = 'none';
            elements.premiumModal.style.display = 'flex';
        } else {
            callback();
        }
    };
    
    elements.daysGrid.addEventListener('click', (e) => {
        const dayEl = e.target.closest('.day');
        if (!dayEl || dayEl.classList.contains('empty')) return;
        if (isPremiumEnabled && !state.currentUser) { elements.authModal.style.display = 'flex'; return; }
        const date = dayEl.dataset.date;
        const dayKey = date.split('-')[2];
        elements.modalDate.textContent = date;
        elements.holidayReason.textContent = state.currentMonthHolidays[dayKey] || (new Date(date).getDay() === 0 ? 'रविवार' : '');
        elements.dateModal.style.display = 'flex';
    });
    
    elements.setAlarmBtn.addEventListener('click', () => handleFeatureAccess(() => alert('अलार्म सेट हो गया!')));
    elements.saveNoteBtn.addEventListener('click', () => handleFeatureAccess(() => alert('नोट सेव हो गया!')));

    elements.loginLogoutBtn.addEventListener('click', () => { if(state.currentUser) auth.signOut(); else elements.authModal.style.display = 'flex'; });
    elements.closeBtns.forEach(btn => btn.onclick = () => btn.closest('.modal').style.display = 'none');
    elements.signupBtn.addEventListener('click', () => { auth.createUserWithEmailAndPassword(elements.emailInput.value, elements.passwordInput.value).then(cred => db.collection('users').doc(cred.user.uid).set({ email: cred.user.email, isPremium: false })).catch(err => alert(err.message));});
    elements.loginBtn.addEventListener('click', () => auth.signInWithEmailAndPassword(elements.emailInput.value, elements.passwordInput.value).catch(err => alert(err.message)));
    elements.prevMonthBtn.addEventListener('click', () => { state.currentDate.setMonth(state.currentDate.getMonth() - 1); renderCalendar(state.currentDate.getFullYear(), state.currentDate.getMonth()); });
    elements.nextMonthBtn.addEventListener('click', () => { state.currentDate.setMonth(state.currentDate.getMonth() + 1); renderCalendar(state.currentDate.getFullYear(), state.currentDate.getMonth()); });
    elements.muteBtn.addEventListener('click', () => { elements.monthlySound.muted = !elements.monthlySound.muted; elements.muteBtn.innerHTML = elements.monthlySound.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-high"></i>'; });
});
