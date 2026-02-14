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
            <title>VIRU TV | News Engine</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&family=Orbitron:wght@700&display=swap');
                
                :root { --neon-blue: #00d2ff; --dark-bg: #020617; }

                body { 
                    margin: 0; background-color: var(--dark-bg); color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                /* Particles Background */
                #particles-js { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }

                /* Header Style */
                .header { position: absolute; top: 40px; text-align: center; z-index: 10; }
                
                .viru-logo { 
                    font-family: 'Orbitron', sans-serif;
                    font-size: 70px; font-weight: 700; color: var(--neon-blue);
                    letter-spacing: 10px; text-transform: uppercase;
                    text-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
                }

                .live-tag {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(0, 210, 255, 0.1); border: 1px solid var(--neon-blue);
                    padding: 5px 15px; border-radius: 50px; margin-top: 10px;
                    font-family: 'Orbitron', sans-serif; font-size: 12px; color: var(--neon-blue);
                }

                .dot { width: 8px; height: 8px; background: var(--neon-blue); border-radius: 50%; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.2); } }

                /* News Display - Glassmorphism */
                .news-container {
                    width: 85%; max-width: 1200px; text-align: center;
                    padding: 60px 40px; z-index: 5;
                    background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 210, 255, 0.2); border-radius: 2rem;
                    box-shadow: 0 0 40px rgba(0,0,0,0.5);
                }

                .headline { 
                    font-size: 52px; color: #fff; font-weight: 800;
                    line-height: 1.5; transition: opacity 0.8s ease-in-out;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }

                /* Footer */
                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: rgba(15, 23, 42, 0.9); padding: 20px 0;
                    font-family: 'Orbitron', sans-serif;
                    color: var(--neon-blue); font-size: 14px; text-align: center;
                    letter-spacing: 5px; border-top: 1px solid rgba(0, 210, 255, 0.2);
                }

                .legal {
                    position: absolute; bottom: 85px; width: 80%;
                    font-size: 11px; color: #475569; text-align: center; font-weight: bold;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            
            <div id="particles-js"></div>

            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div class="live-tag"><div class="dot"></div> Digital News Engine</div>
            </div>

            <div class="news-container">
                <div class="headline" id="title-display">System Initializing...</div>
            </div>

            <div class="legal">
                * ස්වයංක්‍රීයව උපුටා ගන්නා පුවත් මෙහි පළවන අතර එහි නිරවද්‍යතාවය පිළිබඳ වගකීමක් දරනු නොලැබේ.
            </div>

            <div class="footer">VIRU TV | 24/7 AUTOMATED NEWS SERVICE</div>

            <audio id="newsMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
            <script>
                particlesJS("particles-js", { "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#00d2ff" }, "opacity": { "value": 0.4 }, "size": { "value": 2 }, "line_linked": { "enable": true, "distance": 150, "color": "#00d2ff", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1 } } });

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
                    } catch (e) { console.error("Sync Error"); }
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
                        }, 800);
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
        res.status(500).send("Secure Mode Active.");
    }
};
