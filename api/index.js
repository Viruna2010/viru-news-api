const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // උඹ එවපු නිවැරදි API එක
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
                    justify-content: center; align-items: center; overflow: hidden;
                }

                .header { 
                    font-size: 45px; color: #ffcc00; margin-bottom: 20px;
                    border-bottom: 5px solid #e60000; padding-bottom: 10px;
                }

                .news-box { 
                    width: 85%; height: 350px; background: rgba(255,255,255,0.1);
                    border-radius: 20px; display: flex; align-items: center;
                    justify-content: center; padding: 40px; text-align: center;
                }

                .news-item { 
                    font-size: 35px; line-height: 1.4;
                    animation: fadeIn 1s ease-in;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .footer { margin-top: 30px; font-size: 20px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="header">VIRU TV NEWS UPDATE</div>
            <div class="news-box" id="news-container">
                <div class="news-item">පුවත් පද්ධතිය හා සම්බන්ධ වෙමින්...</div>
            </div>
            <div class="footer">SOURCE: HELAKURU ESANA | VIRU TV LIVE</div>

            <script>
                let newsList = [];
                let currentIndex = 0;

                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        
                        // උඹ එවපු JSON එකට අනුව මෙන්න මෙතනයි දත්ත තියෙන්නේ
                        if (result.news_data && result.news_data.data) {
                            newsList = result.news_data.data.map(n => n.titleSi);
                            return true;
                        }
                    } catch (e) { console.log(e); }
                    return false;
                }

                function showNextNews() {
                    if (newsList.length > 0) {
                        const container = document.getElementById('news-container');
                        container.innerHTML = '<div class="news-item">' + newsList[currentIndex] + '</div>';
                        currentIndex = (currentIndex + 1) % newsList.length;
                    }
                }

                async function start() {
                    const ok = await fetchNews();
                    if (ok) {
                        showNextNews();
                        setInterval(showNextNews, 10000); // තත්පර 10න් 10ට නිවුස් මාරු වේ
                    } else {
                        setTimeout(start, 5000);
                    }
                }

                start();
                setInterval(fetchNews, 300000); // විනාඩි 5කට වරක් අලුත් නිවුස් ගනී
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
