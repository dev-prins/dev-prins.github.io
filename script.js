// script.js - महादिव्य पंचांग के लिए

// --- स्टेप 1: ज़रूरी चीज़ें और कनेक्शन ---
const firebaseConfig = {
    apiKey: "AIzaSyA_C5-1k40B2an8h3nTFkRflO4d4ZS6JWQ", // यह आपका कोड है
    authDomain: "mahadivya-panchang.firebaseapp.com",
    projectId: "mahadivya-panchang",
    storageBucket: "mahadivya-panchang.appspot.com",
    messagingSenderId: "336726728626",
    appId: "1:336726728626:web:9d165e3b429fe1b529ceab",
};

// फायरबेस को शुरू करें
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const razorpayKeyId = 'rzp_test_VhdruGpUnvJLFe'; // यह आपकी Razorpay Test Key है

// --- स्टेप 2: पेज के एलिमेंट्स को पकड़ना ---
const loadingScreen = document.getElementById('loading-screen');
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const adminPanel = document.getElementById('admin-panel');

// --- स्टेप 3: मुख्य लॉजिक ---

// यह फंक्शन तय करेगा कि कौनसा स्क्रीन दिखाना है
auth.onAuthStateChanged(user => {
    loadingScreen.style.display = 'none';
    if (user) {
        // यूज़र लॉगिन है
        authScreen.style.display = 'none';
        checkAdminAndShowApp(user);
    } else {
        // यूज़र लॉगिन नहीं है
        appScreen.style.display = 'none';
        adminPanel.style.display = 'none';
        authScreen.style.display = 'flex';
    }
});

// यह फंक्शन चेक करेगा कि यूज़र एडमिन है या नहीं
async function checkAdminAndShowApp(user) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    
    // एडमिन चेक: URL में ?admin=true है और यूज़र एडमिन है
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' && userData && userData.isAdmin === true) {
        appScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        // यहाँ एडमिन पैनल का लॉजिक आएगा
    } else {
        adminPanel.style.display = 'none';
        appScreen.style.display = 'block';
        document.getElementById('user-greeting').innerText = `नमस्ते, ${user.displayName || user.email}`;
        // यहाँ मुख्य ऐप का लॉजिक आएगा
    }
}

// लॉगिन और साइन-अप के लिए इवेंट्स
document.getElementById('google-signin-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => {
        document.getElementById('auth-error').innerText = err.message;
    });
});

// लॉगआउट बटन
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut();
});

// --- स्टेप 4: पहला एडमिन कैसे बनाएँ (आपके लिए निर्देश) ---
// 1. अपने ऐप पर किसी भी गूगल अकाउंट से एक बार साइन-अप करें।
// 2. Firebase कंसोल में जाएँ > Firestore Database > 'users' collection.
// 3. आपको अपने साइन-अप किए हुए अकाउंट की एक ID दिखेगी। उस पर क्लिक करें।
// 4. "Add field" पर क्लिक करें।
// 5. Field का नाम रखें "isAdmin", Type को "boolean" चुनें, और Value को "true" सेट करें।
// 6. अब से, जब भी आप उस अकाउंट से लॉगिन करके URL के अंत में ?admin=true लगाकर खोलेंगे, तो आपको एडमिन पैनल दिखेगा।

console.log("महादिव्य पंचांग ऐप सफलतापूर्वक शुरू हो गया है!");
