const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiUrl = 'https://esena-news-api-v3.vercel.app/news/trending';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="robots" content="noindex, nofollow">
            <title>VIRU TV LIVE</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #0a0a0a; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                /* Background Gradient */
                .bg-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%);
                    z-index: -1;
                }

                /* Header Section */
                .header { 
                    position: absolute; top: 30px; display: flex; flex-direction: column; align-items: center;
                }

                .viru-logo { 
                    font-size: 65px; font-weight: 900; color: #ffffff;
                    letter-spacing: 10px; text-shadow: 4px 4px 0px #e60000;
                    margin-bottom: 5px;
                }

                /* නිවි නිවි පත්තු වෙන LIVE Tag එක */
                .live-indicator {
                    background: #e60000; color: white; padding: 4px 15px;
                    font-size: 18px; font-weight: 900; border-radius: 4px;
                    display: flex; align-items: center; gap: 8px;
                    box-shadow: 0 0 15px rgba(230, 0, 0, 0.6);
                }

                .dot {
                    width: 12px; height: 12px; background: white; border-radius: 50%;
                    animation: blink 0.8s infinite;
                }

                @keyframes blink {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.1; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }

                /* News Display Area */
                .news-container {
                    width: 85%; max-width: 1150px; text-align: center;
                    padding: 50px; border-left: 8px solid #ffcc00; /* Gold Line */
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 0 20px 20px 0;
                }

                .headline { 
                    font-size: 50px; color: #ffcc00; font-weight: 800;
                    line-height: 1.4; transition: all 0.6s ease-in-out;
                    opacity: 0; transform: scale(0.95);
                }

                .headline.active { opacity: 1; transform: scale(1); }

                /* Footer Bar */
                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: #e60000; color: white;
                    padding: 15px 0; font-weight: 900; font-size: 22px;
                    text-align: center; letter-spacing: 3px;
                    border-top: 4px solid #ffcc00;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            <div class="bg-overlay"></div>
            
            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div class="live-indicator">
                    <div class="dot"></div> LIVE BROADCAST
                </div>
            </div>

            <div class="news-container">
                <div class="headline" id="title-display">පුවත් පූරණය වෙමින් පවතී...</div>
            </div>

            <div class="footer">🔴 24/7 AUTOMATED NEWS SERVICE | VIRU TV 🔴</div>

            <audio id="newsMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsData = [];
                let currentIndex = 0;

                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        if (result.news_data && result.news_data.data) {
                            newsData = result.news_data.data.map(n => {
                                return n.titleSi.replace(/Esana/gi, "").replace(/හෙළකුරු/gi, "").trim();
                            });
                            return true;
                        }
                    } catch (e) { console.error("API Error"); }
                    return false;
                }

                function updateDisplay() {
                    if (newsData.length > 0) {
                        const titleEl = document.getElementById('title-display');
                        titleEl.classList.remove('active');
                        
                        setTimeout(() => {
                            titleEl.innerText = newsData[currentIndex];
                            titleEl.classList.add('active');
                            currentIndex = (currentIndex + 1) % newsData.length;
                        }, 600);
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        document.getElementById('title-display').classList.add('active');
                        updateDisplay();
                        setInterval(updateDisplay, 8000); 
                    } else {
                        setTimeout(init, 5000);
                    }
                }

                init();
                setInterval(fetchNews, 600000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Error");
    }
};
