const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
    try {
        // අද දෙරණ RSS එක මුලින්ම ට්‍රයි කරනවා
        let feed;
        try {
            feed = await parser.parseURL('http://sinhala.adaderana.lk/rss.php');
        } catch (e) {
            // ඒක වැඩ නැත්නම් හිරු නිවුස් බලනවා
            feed = await parser.parseURL('https://www.hirunews.lk/rss/sinhala.xml');
        }

        const newsItems = feed.items.map(item => item.title).slice(0, 10);

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
                .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,50,0.7); z-index: 1; }
                .header { z-index: 2; font-size: 50px; font-weight: 900; color: #ffcc00; text-shadow: 2px 2px 10px black; border-bottom: 5px solid red; margin-bottom: 40px; }
                .news-box { z-index: 2; width: 85%; height: 300px; display: flex; justify-content: center; align-items: center; text-align: center; }
                .news-item { font-size: 40px; line-height: 1.4; display: none; text-shadow: 3px 3px 10px black; font-weight: bold; }
                .active { display: block; animation: fadeIn 1s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .footer { position: absolute; bottom: 30px; font-size: 18px; color: #ccc; z-index: 2; }
            </style>
        </head>
        <body>
            <div class="overlay"></div>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="news-box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated Live News</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                if(items.length > 0) {
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

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("Fatal Error: " + e.message);
    }
};
