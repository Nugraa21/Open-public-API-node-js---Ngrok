require('dotenv').config();
const ngrok = require('@ngrok/ngrok');

(async function () {
    try {
        console.log("Connecting to ngrok...");

        const listener = await ngrok.connect({
            addr: 80,
            authtoken: process.env.NGROK_AUTHTOKEN,
        });

        console.log(`🚀 Ngrok Tunnel Active: ${listener.url()}`);
        console.log(`🌐 Akses XAMPP kamu di: ${listener.url()}/backendapk/`);

        // Keep Node.js running
        console.log("Node.js sedang berjalan... tekan CTRL+C untuk keluar.");
        setInterval(() => {}, 1000);
    } 
    catch (error) {
        console.error("❌ ERROR NGROK:", error);
    }
})();
