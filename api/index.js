const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // ඔයාගේ නිවැරදිම RapidAPI දත්ත මෙන්න
        const apiKey = 'a520962615msh0e8d76bf27630eep1fe183jsn3f52ccadb3ff';
        const apiHost = 'sri-lanka-news-api.p.rapidapi.com';
        // අපි පුවත් 10ක් එකපාර ගමු (data/10)
        const apiUrl = 'https://sri-lanka-news-api.p.rapidapi.com/news/sinhala/Ada.lk/data/10';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Viru TV News Live</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                
                body { 
                    margin: 0; padding: 0; 
                    background: #000;
                    background-image: radial-gradient(circle, #001f3f, #000);
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    color: white; overflow: hidden;
                }

                .header { 
                    font-size: 55px; color: #ffcc00; 
                    border-bottom: 8px solid #e60000; 
                    margin-bottom: 30px; 
                    text-shadow: 0 0 15px rgba(255, 204, 0, 0.5);
                    font-weight: 900;
                }

                .news-box { 
                    width: 90%; height: 450px; 
                    text-align: center; 
                    display: flex; align-items: center; justify-content: center; 
                    background: rgba(0, 0, 0, 0.4); 
                    border-radius: 25px; 
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 40px; box-sizing: border-box;
                }

                .news-item { 
                    font-size: 38px; line-height: 1.6; 
                    text-shadow: 3px 3px 12px black; 
                    animation: zoomIn 0.8s ease-out; 
                }

                @keyframes zoomIn { 
                    from { opacity: 0; transform: scale(0.95); } 
                    to { opacity: 1; transform: scale(1); } 
                }

                .footer { 
                    position: absolute; bottom: 30px; 
                    font-size: 22px; color: #ffcc00; 
                    background: rgba(230, 0, 0, 0.2); 
                    padding: 10px 30px; border-radius: 50px;
                }
            </style>
        </head>
        <body>
            <div class="header">VIRU TV NEWS UPDATE</div>
            
            <div class="news-box" id="news-container">
                <div class="news-item">පුවත් පද්ධතිය හා සම්බන්ධ වෙමින්...</div>
            </div>

            <div class="footer">📡 ADA.LK ඇසුරින් | VIRU TV LIVE</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsList = [];
                let currentIndex = 0;
                const container = document.getElementById('news-container');

                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}', {
                            method: 'GET',
                            headers: {
                                'x-rapidapi-key': '${apiKey}',
                                'x-rapidapi-host': '${apiHost}'
                            }
                        });
                        const data = await response.json();
                        
                        if (Array.isArray(data) && data.length > 0) {
                            newsList = data.map(n => {
                                let title = n.title || "";
                                let desc = n.description || "";
                                // Title එක සහ Description එක අතර පරතරයක් තබයි
                                return title + (desc ? " - " + desc : "");
                            });
                            return true;
                        }
                    } catch (error) {
                        console.error("API Error:", error);
                    }
                    return false;
                }

                function rotateNews() {
                    if (newsList.length > 0) {
                        container.innerHTML = "";
                        const div = document.createElement('div');
                        div.className = 'news-item';
                        div.innerText = newsList[currentIndex];
                        container.appendChild(div);
                        currentIndex = (currentIndex + 1) % newsList.length;
                    }
                }

                async function startSystem() {
                    const success = await fetchNews();
                    if (success) {
                        rotateNews();
                        setInterval(rotateNews, 12000); // තත්පර 12න් 12ට මාරු වේ
                    } else {
                        container.innerHTML = '<div class="news-item">දත්ත ලබාගැනීම අසාර්ථකයි. නැවත උත්සාහ කරයි...</div>';
                        setTimeout(startSystem, 5000);
                    }
                }

                startSystem();
                setInterval(fetchNews, 300000); // විනාඩි 5කට වරක් පසුබිමින් Update වේ

                window.onclick = () => document.getElementById('bgMusic').play();
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
