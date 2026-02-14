const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiUrl = 'https://esena-news-api-v3.vercel.app/news/trending';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="robots" content="noindex, nofollow, noarchive">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #000000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                /* Header */
                .header { position: absolute; top: 40px; text-align: center; }
                
                /* VIRU TV Logo - Neon Yellow */
                .viru-logo { 
                    font-size: 75px; font-weight: 900; color: #ffff00;
                    letter-spacing: 12px; text-shadow: 0 0 20px rgba(255, 255, 0, 0.4);
                }

                .live-indicator {
                    background: #ff0000; color: white; padding: 5px 15px;
                    font-size: 16px; font-weight: 900; border-radius: 4px;
                    display: inline-flex; align-items: center; gap: 8px; margin-top: 10px;
                }
                .dot { width: 10px; height: 10px; background: white; border-radius: 50%; animation: blink 0.8s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                /* News Box */
                .news-box {
                    width: 90%; max-width: 1200px; text-align: center;
                    padding: 60px 20px; border-bottom: 2px solid #333;
                }

                .headline { 
                    font-size: 55px; color: #ffffff; font-weight: 800;
                    line-height: 1.5; transition: all 0.7s ease-in-out;
                    opacity: 0;
                }

                .active { opacity: 1; }

                /* Disclaimer */
                .legal-notice {
                    position: absolute; bottom: 90px; width: 85%;
                    font-size: 13px; color: #444; text-align: center;
                    font-weight: bold;
                }

                /* Footer - Electric Cyan Text */
                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: #111; color: #00f2fe; padding: 20px 0;
                    font-weight: 900; font-size: 22px; text-align: center;
                    letter-spacing: 3px; border-top: 1px solid #333;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            
            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div class="live-indicator"><div class="dot"></div> LIVE STREAMING</div>
            </div>

            <div class="news-box">
                <div class="headline" id="title-display">පද්ධතිය සූදානම් වෙමින් පවතී...</div>
            </div>

            <div class="legal-notice">
                * මෙහි පලවන තොරතුරු අන්තර්ජාලයෙන් ස්වයංක්‍රීයව උපුටා ගන්නා දත්ත වන අතර එහි සත්‍යතාවය පිළිබඳ වගකීමක් දරනු නොලැබේ.
            </div>

            <div class="footer">VIRU TV | 24/7 AUTOMATED NEWS SERVICE</div>

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
                                return n.titleSi.replace(/Esana|හෙළකුරු|Ada Derana/gi, "").trim();
                            });
                            return true;
                        }
                    } catch (e) { console.error("Update Error"); }
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
                        }, 700);
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
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
        res.status(500).send("System Secure.");
    }
};
