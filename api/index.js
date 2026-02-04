const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // NewsFirst (Sirasa) Sinhala RSS Feed
        const url = 'https://www.newsfirst.lk/sinhala/feed/';
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const xml = response.data;

        // XML එකෙන් සිංහල අකුරු ටික හරියටම වෙන් කර ගැනීම
        const newsItems = [];
        const items = xml.split('<item>');
        
        for (let i = 1; i < items.length && newsItems.length < 10; i++) {
            if (items[i].includes('<title>')) {
                let title = items[i].split('<title>')[1].split('</title>')[0];
                // CDATA වගේ අනවශ්‍ය කෑලි අයින් කරනවා
                title = title.replace('<![CDATA[', '').replace(']]>', '').trim();
                newsItems.push(title);
            }
        }

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                body { 
                    margin: 0; padding: 0; 
                    background: #001a33; 
                    background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1585829365234-781f8c480385?q=80&w=1920');
                    background-size: cover;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    overflow: hidden; color: white;
                }
                .header { font-size: 60px; font-weight: 900; color: #ffcc00; text-shadow: 2px 2px 15px black; border-bottom: 6px solid #ff0000; margin-bottom: 50px; padding-bottom: 10px; }
                .news-box { width: 90%; height: 300px; display: flex; justify-content: center; align-items: center; text-align: center; }
                .news-item { font-size: 45px; line-height: 1.6; display: none; text-shadow: 3px 3px 10px black; animation: slideIn 1s; }
                .active { display: block; }
                @keyframes slideIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .footer { position: absolute; bottom: 30px; font-size: 22px; color: #ffcc00; font-weight: bold; background: rgba(0,0,0,0.5); padding: 5px 20px; border-radius: 10px; }
            </style>
        </head>
        <body>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="news-box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Viru TV | ශ්‍රී ලංකාවේ ප්‍රථම ස්වයංක්‍රීය පුවත් විකාශය</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                setInterval(() => {
                    if(items.length > 0) {
                        items[current].classList.remove('active');
                        current = (current + 1) % items.length;
                        items[current].classList.add('active');
                    }
                }, 8000); // තත්පර 8ක් එක පුවතක් පෙන්වයි
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("Viru TV News System Error: " + e.message);
    }
};
