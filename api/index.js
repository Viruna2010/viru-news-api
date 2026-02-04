const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // Hiru News එකෙන් 403 එන එක නවත්තන්න User-Agent එකක් දාමු
        const config = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        const response = await axios.get('https://www.hirunews.lk/rss/sinhala.xml', config);
        const xmlData = response.data;

        // පුවත් සිරස්තල Extract කිරීම
        const newsItems = xmlData.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)
            .map(item => item.replace('<title><![CDATA[', '').replace(']]></title>', ''))
            .slice(1, 11); 

        // HTML පෙනුම
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    margin: 0; padding: 0; 
                    background: #000 url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920') no-repeat center center; 
                    background-size: cover;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    overflow: hidden; color: white;
                }
                .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,50,0.6); z-index: 1; }
                .content { z-index: 2; width: 85%; text-align: center; }
                .header { font-size: 55px; font-weight: 900; color: #ffcc00; text-shadow: 2px 2px 10px black; border-bottom: 5px solid red; margin-bottom: 40px; }
                .news-box { height: 300px; display: flex; justify-content: center; align-items: center; }
                .news-item { font-size: 42px; line-height: 1.4; display: none; text-shadow: 3px 3px 10px black; }
                .active { display: block; animation: zoomIn 0.8s ease; }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                .footer { position: absolute; bottom: 30px; font-size: 18px; color: #ccc; z-index: 2; }
            </style>
        </head>
        <body>
            <div class="overlay"></div>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="content">
                <div class="news-box">
                    ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
                </div>
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated Live News</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                setInterval(() => {
                    items[current].classList.remove('active');
                    current = (current + 1) % items.length;
                    items[current].classList.add('active');
                }, 7000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("News fetch error (403 fix): " + e.message);
    }
};
