const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
    try {
        // NewsFirst Sinhala News Google RSS Proxy හරහා
        const url = 'https://news.google.com/rss/search?q=source:newsfirst.lk+when:24h&hl=si&gl=LK&ceid=LK:si';
        
        const feed = await parser.parseURL(url);
        
        // පුවත් සිරස්තල 10ක් ගැනීම
        const newsItems = feed.items.map(item => {
            return item.title.split(' - ')[0].trim();
        }).slice(0, 10);

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                body { 
                    margin: 0; padding: 0; background: #000;
                    background-image: radial-gradient(circle, #001f3f, #000);
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    color: white; overflow: hidden;
                }
                .header { font-size: 55px; color: #ffcc00; border-bottom: 6px solid #e60000; margin-bottom: 40px; text-shadow: 2px 2px 15px black; }
                .news-box { width: 90%; height: 300px; text-align: center; display: flex; align-items: center; justify-content: center; }
                .news-item { font-size: 42px; line-height: 1.6; display: none; text-shadow: 3px 3px 12px black; animation: zoomIn 0.8s; }
                .active { display: block; }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .footer { position: absolute; bottom: 30px; font-size: 20px; color: #ffcc00; }
            </style>
        </head>
        <body>
            <div class="header">VIRU TV NEWS</div>
            <div class="news-box">
                ${newsItems.length > 0 ? newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('') : '<div class="news-item active">පුවත් පද්ධතිය හා සම්බන්ධ වෙමින්...</div>'}
            </div>
            <div class="footer">📡 සිරස පුවත් ඇසුරින් | VIRU TV LIVE</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => document.getElementById('bgMusic').play();
                const items = document.querySelectorAll('.news-item');
                let curr = 0;
                if(items.length > 0) {
                    setInterval(() => {
                        items[curr].classList.remove('active');
                        curr = (curr + 1) % items.length;
                        items[curr].classList.add('active');
                    }, 8000);
                }
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
