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
            <title>VIRU TV | Live</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #050505; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                /* Background - ටිකක් Modern Dark look එකක් */
                .bg-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle at 50% 50%, #101820 0%, #050505 100%);
                    z-index: -1;
                }

                /* Glassmorphism Effect එකක් තියෙන Header එකක් */
                .header { 
                    position: absolute; top: 40px; 
                    background: rgba(255, 255, 255, 0.05);
                    padding: 15px 40px; border-radius: 15px;
                    backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }

                .viru-logo { 
                    font-size: 50px; font-weight: 900; 
                    background: linear-gradient(to right, #00f2fe, #4facfe); /* Cyan Gradient */
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    letter-spacing: 5px; filter: drop-shadow(0 0 10px rgba(79, 172, 254, 0.5));
                }

                /* News Display - මෙතන තමයි සෙල්ලම */
                .news-container {
                    width: 85%; max-width: 1100px;
                    text-align: center; padding: 60px;
                    position: relative;
                }

                /* අකුරු වලට Neon Glow එකක් සහ Bold ගතියක් */
                .headline { 
                    font-size: 52px; color: #ffffff; font-weight: 900;
                    line-height: 1.5; text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0; transform: translateY(20px);
                }

                .headline.active { opacity: 1; transform: translateY(0); }

                /* Decorative line */
                .line {
                    width: 150px; height: 6px; background: #00f2fe;
                    margin: 30px auto; border-radius: 10px;
                    box-shadow: 0 0 15px #00f2fe;
                }

                /* Footer - Clean and Professional */
                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: linear-gradient(to right, #00f2fe, #4facfe);
                    color: #000; padding: 12px 0;
                    font-weight: 900; font-size: 20px;
                    text-align: center; letter-spacing: 1px;
                    box-shadow: 0 -5px 20px rgba(0, 242, 254, 0.3);
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            <div class="bg-overlay"></div>
            
            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div style="color: #00f2fe; font-size: 14px; font-weight: bold; letter-spacing: 4px; margin-top: 5px;">LIVE BROADCAST</div>
            </div>

            <div class="news-container">
                <div class="headline" id="title-display">ප්‍රවෘත්ති පූරණය වෙමින් පවතී...</div>
                <div class="line"></div>
            </div>

            <div class="footer">STAY UPDATED WITH VIRU TV | AUTOMATED NEWS FEED</div>

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
                    } catch (e) { 
                        console.error("Fetch Error");
                    }
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
                        }, 800);
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
        res.status(500).send("Server Error");
    }
};
