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
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700;900&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; overflow: hidden;
                    background: radial-gradient(circle, #001f3f, #000);
                }

                /* Header Section */
                .main-header {
                    width: 100%; background: rgba(230, 0, 0, 0.9);
                    padding: 20px 0; text-align: center;
                    border-bottom: 5px solid #ffcc00;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    z-index: 100;
                }

                .viru-logo {
                    font-size: 60px; font-weight: 900; color: white;
                    letter-spacing: 5px; text-shadow: 3px 3px 0px #000;
                }

                .sub-tag { font-size: 20px; color: #ffcc00; display: block; letter-spacing: 2px; }

                /* News Scrolling Area */
                .news-container {
                    width: 90%; height: 70vh;
                    margin-top: 50px; position: relative;
                    overflow: hidden; text-align: center;
                }

                .scroll-content {
                    position: absolute; width: 100%;
                    animation: fullScroll 25s linear infinite;
                }

                .headline { 
                    font-size: 55px; color: #ffcc00; 
                    margin-bottom: 30px; font-weight: 900;
                    line-height: 1.2;
                }

                .body-text { 
                    font-size: 38px; line-height: 1.6; color: #ffffff;
                    padding-bottom: 100px;
                }

                @keyframes fullScroll {
                    0% { transform: translateY(100vh); }
                    100% { transform: translateY(-120%); }
                }

                /* Live Indicator */
                .live-box {
                    position: fixed; top: 120px; right: 40px;
                    background: rgba(0,0,0,0.6); padding: 10px 20px;
                    border-radius: 10px; border: 1px solid red;
                    display: flex; align-items: center; gap: 10px;
                }
                .dot { width: 12px; height: 12px; background: red; border-radius: 50%; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }

                .footer-bar {
                    position: fixed; bottom: 0; width: 100%;
                    background: #ffcc00; color: #000; padding: 10px;
                    font-size: 22px; font-weight: bold; text-align: center;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            
            <div class="main-header">
                <span class="viru-logo">VIRU TV</span>
                <span class="sub-tag">සජීවී පුවත් විකාශය</span>
            </div>

            <div class="live-box">
                <div class="dot"></div>
                <span style="font-weight: bold;">LIVE NEWS</span>
            </div>

            <div class="news-container" id="news-container">
                <div class="scroll-content" id="scroll-box">
                    <div class="headline" id="title-display">පුවත් පද්ධතිය සූදානම් වේ...</div>
                    <div class="body-text" id="content-display">අලුත්ම පුවත් විස්තර ස්වල්ප වේලාවකින් බලාපොරොත්තු වන්න.</div>
                </div>
            </div>

            <div class="footer-bar">📡 SOURCE: HELAKURU ESANA | POWERED BY VIRU TV ENGINE</div>

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
                                let bodyText = n.contentSi
                                    .filter(c => c.type === 'text')
                                    .map(c => c.data.replace(/<[^>]*>?/gm, ''))
                                    .join(' ');
                                return { title: n.titleSi, body: bodyText };
                            });
                            return true;
                        }
                    } catch (e) { console.error(e); }
                    return false;
                }

                function updateDisplay() {
                    if (newsData.length > 0) {
                        const titleEl = document.getElementById('title-display');
                        const contentEl = document.getElementById('content-display');
                        const scrollBox = document.getElementById('scroll-box');
                        
                        const item = newsData[currentIndex];
                        titleEl.innerText = item.title;
                        contentEl.innerText = item.body;

                        // Animation Reset
                        scrollBox.style.animation = 'none';
                        scrollBox.offsetHeight; 
                        scrollBox.style.animation = 'fullScroll 25s linear infinite';

                        currentIndex = (currentIndex + 1) % newsData.length;
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        updateDisplay();
                        setInterval(updateDisplay, 25000); // ඇනිමේෂන් එකේ වෙලාවටම මාරු කරනවා
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
        res.status(500).send("Error: " + e.message);
    }
};
