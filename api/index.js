const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // අපි සිරස නිවුස් වලට කෙලින්ම නොගොස් Google RSS Proxy එක හරහා යනවා
        const url = 'https://news.google.com/rss/search?q=source:Newsfirst+when:24h&hl=si&gl=LK&ceid=LK:si';
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const xml = response.data;
        const newsItems = [];
        const items = xml.split('<item>');
        
        for (let i = 1; i < items.length && newsItems.length < 10; i++) {
            let title = items[i].split('<title>')[1].split('</title>')[0];
            // Source එක (Newsfirst) අගට එනවා නම් ඒක අයින් කරනවා
            title = title.split(' - ')[0].replace('<![CDATA[', '').replace(']]>', '').trim();
            newsItems.push(title);
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
                    background: #000b1a; 
                    background-image: radial-gradient(circle, #001f3f, #000);
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    overflow: hidden; color: white;
                }
                .header { font-size: 55px; font-weight: 900; color: #ffcc00; text-shadow: 0 0 15px rgba(255,204,0,0.6); border-bottom: 6px solid #e60000; margin-bottom: 40px; }
                .news-box { width: 85%; height: 280px; display: flex; justify-content: center; align-items: center; text-align: center; }
                .news-item { font-size: 42px; line-height: 1.5; display: none; text-shadow: 2px 2px 10px black; animation: fadeIn 0.8s ease-in-out; }
                .active { display: block; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .footer { position: absolute; bottom: 30px; font-size: 20px; color: #aaa; border-top: 1px solid #333; padding-top: 10px; width: 80%; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="news-box">
                ${newsItems.length > 0 ? newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('') : '<div class="news-item active">පුවත් ලබා ගනිමින් පවතී...</div>'}
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated Live News</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                if(items.length > 1) {
                    setInterval(() => {
                        items[current].classList.remove('active');
                        current = (current + 1) % items.length;
                        items[current].classList.add('active');
                    }, 8000);
                }
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("Viru TV System Error: " + e.message);
    }
};
