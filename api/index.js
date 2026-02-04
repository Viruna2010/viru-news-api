const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // Google News - Sri Lanka Sinhala Feed
        const url = 'https://news.google.com/rss/search?q=Sri+Lanka+when:24h&hl=si&gl=LK&ceid=LK:si';
        const response = await axios.get(url);
        const xml = response.data;

        // ඉතා සරලව අකුරු ටික වෙන් කර ගැනීම
        const newsItems = [];
        const items = xml.split('<item>');
        
        for (let i = 1; i < items.length && newsItems.length < 10; i++) {
            let title = items[i].split('<title>')[1].split('</title>')[0];
            // Google News එකේ අන්තිමට තියෙන Source එක අයින් කරනවා
            title = title.split(' - ')[0]; 
            newsItems.push(title);
        }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    margin: 0; padding: 0; 
                    background: #001a33; 
                    background-image: radial-gradient(circle, #002b52, #00050a);
                    font-family: 'Segoe UI', Arial, sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    overflow: hidden; color: white;
                }
                .header { font-size: 50px; font-weight: 900; color: #ffcc00; text-shadow: 0 0 20px rgba(255,204,0,0.5); border-bottom: 5px solid red; margin-bottom: 40px; }
                .news-box { width: 85%; height: 250px; display: flex; justify-content: center; align-items: center; text-align: center; }
                .news-item { font-size: 38px; line-height: 1.4; display: none; font-weight: bold; animation: fadeIn 1s; }
                .active { display: block; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .footer { position: absolute; bottom: 30px; font-size: 18px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="news-box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated Live News</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                setInterval(() => {
                    items[current].classList.remove('active');
                    current = (current + 1) % items.length;
                    items[current].classList.add('active');
                }, 8000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("Viru TV News System Error: " + e.message);
    }
};
