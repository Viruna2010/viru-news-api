const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // ඔයා දීපු API Key එක සහ URL එක මෙන්න
        const apiKey = 'a520962615msh0e8d76bf27630eep1fe183jsn3f52ccadb3ff';
        const apiHost = 'sri-lanka-news-api.p.rapidapi.com';
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
                    font-size: 40px; line-height: 1.6; 
                    display: none; 
                    text-shadow: 3px 3px 12px black; 
                    animation: zoomIn 0.8s ease-out; 
                }

                .active { display: block; }

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
                <div class="news-item active">පුවත් පද්ධතිය හා සම්බන්ධ වෙමින්...</div>
            </div>

            <div class="footer">📡 ADA.LK ඇසුරින් | විනාඩි 5කට වරක් ස්වයංක්‍රීයව යාවත්කාලීන වේ</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsList = [];
                let currentIndex = 0;

                // API එකෙන් පුවත් ඇදලා ගන්නා Function එක
                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}', {
                            headers: {
                                'x-rapidapi-key': '${apiKey}',
                                'x-rapidapi-host': '${apiHost}'
                            }
                        });
                        const data = await response.json();
                        if (Array.isArray(data) && data.length > 0) {
                            // සිරස්තලය සහ විස්තරය එකතු කර ලොකු වාක්‍යයක් සාදා ගනී
                            newsList = data.map(n => n.title + " - " + (n.description || ""));
                            console.log("News Updated from API");
                        }
                    } catch (error) {
                        console.error("Error fetching news:", error);
                    }
                }

                // පුවත් තිරයේ පෙන්වන Function එක
                function rotateNews() {
                    const container = document.getElementById('news-container');
                    if (newsList.length > 0) {
                        container.innerHTML = '<div class="news-item active">' + newsList[currentIndex] + '</div>';
                        currentIndex = (currentIndex + 1) % newsList.length;
                    }
                }

                // මුලින්ම පුවත් ටික ලබා ගනී
                fetchNews().then(() => {
                    rotateNews();
                    // තත්පර 12කට සැරයක් පුවත් මාරු කරයි (දිග වාක්‍ය කියවීමට කාලය ලබා දී ඇත)
                    setInterval(rotateNews, 12000);
                });

                // විනාඩි 5කට සැරයක් පසුබිමින් අලුත් පුවත් ඇද ගනී (Refresh)
                setInterval(fetchNews, 300000);

                window.onclick = () => {
                    document.getElementById('bgMusic').play();
                };
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Viru TV System Error: " + e.message);
    }
};
