const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiUrl = 'https://esena-news-api-v3.vercel.app/news/trending';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    justify-content: flex-end; align-items: center; overflow: hidden;
                    background: radial-gradient(circle, #001a33 0%, #000 100%);
                }

                .news-container {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    border-top: 5px solid #e60000;
                    padding: 40px 20px;
                    box-sizing: border-box;
                    min-height: 40%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 -20px 50px rgba(0,0,0,0.5);
                }

                .headline { 
                    font-size: 50px; color: #ffcc00; margin-bottom: 15px;
                    text-align: center; font-weight: 900;
                    text-transform: uppercase;
                    border-bottom: 2px solid rgba(255, 204, 0, 0.3);
                }

                .full-news { 
                    font-size: 30px; line-height: 1.6;
                    color: #ffffff; text-align: center;
                    max-width: 90%;
                    animation: fadeIn 1.2s ease-in-out;
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .live-tag {
                    position: absolute; top: 40px; left: 40px;
                    background: #e60000; padding: 10px 25px;
                    font-size: 25px; font-weight: bold; border-radius: 5px;
                    animation: blink 1s infinite;
                }

                @keyframes blink { 50% { opacity: 0.5; } }

                .footer-bar {
                    width: 100%; background: #ffcc00; color: #000;
                    padding: 10px; font-size: 22px; font-weight: bold;
                    text-align: center;
                }
            </style>
        </head>
        <body onclick="playAudio()">
            <div class="live-tag">🔴 LIVE</div>
            
            <div class="news-container" id="display-box">
                <div class="headline">පද්ධතිය සූදානම් වෙමින් පවතී...</div>
            </div>

            <div class="footer-bar">📡 VIRU TV NEWS | HELAKURU ESANA වෙතින් පුවත් සජීවීව</div>

            <audio id="newsMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsData = [];
                let currentIndex = 0;
                const audio = document.getElementById('newsMusic');

                function playAudio() { audio.play(); }

                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        if (result.news_data && result.news_data.data) {
                            // මෙතනදී අපි Title එකයි Full Content එකයි දෙකම ගන්නවා
                            newsData = result.news_data.data.map(n => {
                                let fullBody = n.contentSi
                                    .filter(c => c.type === 'text') // රූප නැතුව අකුරු විතරක් ගන්නවා
                                    .map(c => c.data.replace(/<[^>]*>?/gm, '')) // HTML tags අයින් කරනවා
                                    .join(' ');
                                return { title: n.titleSi, body: fullBody };
                            });
                            return true;
                        }
                    } catch (e) { console.error(e); }
                    return false;
                }

                function rotateNews() {
                    if (newsData.length > 0) {
                        const box = document.getElementById('display-box');
                        const item = newsData[currentIndex];
                        
                        box.innerHTML = \`
                            <div class="headline">\${item.title}</div>
                            <div class="full-news">\${item.body.substring(0, 450)}...</div>
                        \`;
                        
                        currentIndex = (currentIndex + 1) % newsData.length;
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        rotateNews();
                        setInterval(rotateNews, 15000); // විස්තරය කියවන්න තත්පර 15ක් දෙනවා
                    } else {
                        setTimeout(init, 5000);
                    }
                }

                init();
                setInterval(fetchNews, 600000); // විනාඩි 10කින් Update වේ
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
};
