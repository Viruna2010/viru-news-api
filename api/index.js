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
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                    background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
                }

                /* Logo Section - Top */
                .top-logo {
                    position: absolute; top: 40px; text-align: center;
                }

                .viru-logo {
                    font-size: 55px; font-weight: 900; color: #ffcc00;
                    letter-spacing: 5px; text-shadow: 0 0 15px rgba(255, 204, 0, 0.5);
                }

                /* Main Center News Card */
                .news-card {
                    width: 85%; max-width: 1000px; height: auto;
                    min-height: 400px; background: rgba(20, 20, 20, 0.9);
                    border: 2px solid #e60000; border-radius: 20px;
                    padding: 50px; box-sizing: border-box;
                    box-shadow: 0 0 50px rgba(230, 0, 0, 0.3);
                    display: flex; flex-direction: column;
                }

                .headline { 
                    font-size: 42px; color: #ffcc00; font-weight: 700;
                    margin-bottom: 25px; line-height: 1.3;
                    border-left: 10px solid #e60000; padding-left: 20px;
                }

                .body-text { 
                    font-size: 26px; line-height: 1.7; color: #f0f0f0;
                    text-align: left; font-weight: 400;
                    animation: fadeIn 0.8s ease-in-out;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* Bottom Info Bar */
                .info-bar {
                    position: absolute; bottom: 50px;
                    background: #e60000; padding: 10px 30px;
                    border-radius: 50px; font-weight: bold; font-size: 20px;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            
            <div class="top-logo">
                <span class="viru-logo">VIRU TV</span>
                <div style="color: #e60000; font-weight: bold; letter-spacing: 5px; margin-top: 5px;">🔴 සජීවී පුවත් විකාශය</div>
            </div>

            <div class="news-card">
                <div class="headline" id="title-display">සම්බන්ධ වෙමින් පවතී...</div>
                <div class="body-text" id="content-display">
                    කරුණාකර මඳක් රැඳී සිටින්න. අලුත්ම පුවත් දැන් ලැබෙනු ඇත.
                </div>
            </div>

            <div class="info-bar">📡 SOURCE: ESANA NEWS | 24/7 LIVE</div>

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
                        
                        const item = newsData[currentIndex];
                        titleEl.innerText = item.title;
                        
                        // අකුරු ගොඩක් වැඩි වුණොත් කොටුව ඇතුළේ පාලනය කරනවා
                        let cleanBody = item.body.split('ශ්‍රී ලංකාවේ ජනප්‍රියම Payment Method')[0]; // වෙළඳ දැන්වීම් අයින් කරනවා
                        contentEl.innerText = cleanBody.length > 550 ? cleanBody.substring(0, 550) + "..." : cleanBody;

                        currentIndex = (currentIndex + 1) % newsData.length;
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        updateDisplay();
                        setInterval(updateDisplay, 15000); 
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
