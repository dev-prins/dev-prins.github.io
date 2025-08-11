document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
    const ADMIN_UID = "sH2R9XDpvZZQiGM9NZWZWYjcHIx2"; // आपका एडमिन UID

    const loginView = document.getElementById('admin-login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const userList = document.getElementById('user-list');

    auth.onAuthStateChanged(user => {
        if (user && user.uid === ADMIN_UID) {
            loginView.style.display = 'none';
            dashboardView.style.display = 'block';
            loadUsers();
        } else {
            loginView.style.display = 'block';
            dashboardView.style.display = 'none';
        }
    });

    adminLoginBtn.addEventListener('click', () => {
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-password').value;
        auth.signInWithEmailAndPassword(email, pass).catch(err => alert(err.message));
    });
    
    adminLogoutBtn.addEventListener('click', () => auth.signOut());

    async function loadUsers() {
        userList.innerHTML = '';
        const snapshot = await db.collection('users').get();
        snapshot.forEach(doc => {
            const user = doc.data();
            const isCurrentUserAdmin = doc.id === ADMIN_UID;
            if (isCurrentUserAdmin) return; // एडमिन को लिस्ट में न दिखाएं
            
            const card = `
                <div class="user-card" id="user-${doc.id}">
                    <span>${user.email} - <strong>${user.isPremium ? 'प्रीमियम' : 'फ्री'}</strong></span>
                    <button data-uid="${doc.id}" class="${user.isPremium ? 'remove-premium' : 'make-premium'}">
                        ${user.isPremium ? 'प्रीमियम हटाएं' : 'प्रीमियम बनाएं'}
                    </button>
                </div>
            `;
            userList.insertAdjacentHTML('beforeend', card);
        });
    }

    userList.addEventListener('click', async (e) => {
        if(e.target.tagName === 'BUTTON') {
            const uid = e.target.dataset.uid;
            const userDoc = await db.collection('users').doc(uid).get();
            const newPremiumStatus = !userDoc.data().isPremium;
            await db.collection('users').doc(uid).update({ isPremium: newPremiumStatus });
            loadUsers();
        }
    });

    document.getElementById('save-month-data-btn').addEventListener('click', async () => {
        const monthSelector = document.getElementById('month-selector').value;
        if (!monthSelector) return alert('कृपया महीना चुनें!');
        const [year, month] = monthSelector.split('-');
        const docId = `${year}-${month}`;
        
        try {
            const photoFile = document.getElementById('photo-uploader').files[0];
            const soundFile = document.getElementById('sound-uploader').files[0];
            const updateData = {};
            if (photoFile) {
                const photoRef = storage.ref(`panchang-media/${docId}/photo`);
                await photoRef.put(photoFile);
                updateData.photoUrl = await photoRef.getDownloadURL();
            }
            if (soundFile) {
                const soundRef = storage.ref(`panchang-media/${docId}/sound`);
                await soundRef.put(soundFile);
                updateData.soundUrl = await soundRef.getDownloadURL();
            }
            if (Object.keys(updateData).length > 0) {
                 await db.collection('panchangData').doc(docId).set(updateData, { merge: true });
                 alert(`${monthSelector} का मीडिया सेव हो गया!`);
            } else {
                 alert('कोई नई फाइल नहीं चुनी गई।');
            }
        } catch(e) { alert("Error: " + e.message); }
    });
    
    document.getElementById('add-holiday-btn').addEventListener('click', async () => {
        const date = document.getElementById('holiday-date').value;
        const reason = document.getElementById('holiday-reason').value;
        if (!date || !reason) return alert('तारीख और कारण दोनों डालें!');
        
        const [year, month, day] = date.split('-');
        const docId = `${year}-${month}`;
        
        const updateData = { holidays: { [day]: reason } };
        await db.collection('panchangData').doc(docId).set(updateData, { merge: true });
        alert(`${date} के लिए छुट्टी जोड़ दी गई!`);
    });
});
