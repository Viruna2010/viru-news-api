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
            <title>VIRU TV | Live News</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                .bg-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, #0f0f0f 0%, #1a0000 100%);
                    z-index: -1;
                }

                .header { position: absolute; top: 50px; text-align: center; }
                .viru-logo { 
                    font-size: 60px; font-weight: 900; color: #ffcc00;
                    letter-spacing: 8px; text-shadow: 3px 3px 10px rgba(0,0,0,1);
                }
                .live-tag {
                    background: #ff0000; color: white; padding: 5px 15px;
                    font-size: 18px; font-weight: bold; border-radius: 5px;
                    display: inline-block; margin-top: 10px; animation: blink 1s infinite;
                }

                .news-container {
                    width: 90%; max-width: 1100px;
                    text-align: center; padding: 40px;
                    border-bottom: 5px solid #ffcc00;
                }

                .headline { 
                    font-size: 45px; color: white; font-weight: 700;
                    line-height: 1.4; text-shadow: 2px 2px 5px rgba(0,0,0,0.5);
                    transition: opacity 0.5s ease-in-out;
                }

                @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: #ffcc00; color: #000;
                    padding: 15px 0; font-weight: 900; font-size: 22px;
                    text-align: center; letter-spacing: 2px;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            <div class="bg-overlay"></div>
            
            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div class="live-tag">LIVE NEWS</div>
            </div>

            <div class="news-container">
                <div class="headline" id="title-display">ප්‍රවෘත්ති පූරණය වෙමින් පවතී...</div>
            </div>

            <div class="footer">24/7 AUTOMATED INFORMATION SERVICE</div>

            <audio id="newsMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsData = [];
                let currentIndex = 0;

                async function fetchNews() {
                    try {
                        // මෙතන කෙලින්ම API URL එක පාවිච්චි කරනවා
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        if (result.news_data && result.news_data.data) {
                            newsData = result.news_data.data.map(n => {
                                // Risk 0: Title එකේ තියෙන අයිතිකාර නාමයන් අයින් කරනවා
                                return n.titleSi.replace(/Esana/gi, "").replace(/හෙළකුරු/gi, "").trim();
                            });
                            return true;
                        }
                    } catch (e) { 
                        console.error("Fetch Error:", e);
                        document.getElementById('title-display').innerText = "දත්ත සම්බන්ධතාවය බිඳ වැටී ඇත...";
                    }
                    return false;
                }

                function updateDisplay() {
                    if (newsData.length > 0) {
                        const titleEl = document.getElementById('title-display');
                        titleEl.style.opacity = 0;
                        
                        setTimeout(() => {
                            titleEl.innerText = newsData[currentIndex];
                            titleEl.style.opacity = 1;
                            currentIndex = (currentIndex + 1) % newsData.length;
                        }, 500);
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        updateDisplay();
                        setInterval(updateDisplay, 8000); // තත්පර 8න් 8ට මාරු වෙනවා
                    } else {
                        setTimeout(init, 5000);
                    }
                }

                init();
                setInterval(fetchNews, 600000); // විනාඩි 10න් 10ට අලුත් දත්ත ලබා ගැනීම
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Server Error: " + e.message);
    }
};
