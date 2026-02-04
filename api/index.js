const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const config = {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        };

        // අපි කෙළින්ම අද දෙරණ සිංහල නිවුස් RSS එක ගන්නවා
        const response = await axios.get('http://sinhala.adaderana.lk/rss.php', config);
        const xml = response.data;

        // XML එකෙන් <title> ටැග් ඇතුළේ තියෙන පුවත් ටික වෙන් කරගන්න ලේසිම ක්‍රමය
        const newsItems = [];
        const titles = xml.split('<title>');
        
        // මුල් පේළි දෙක අත හරිනවා (ඒවා නිවුස් නෙවෙයි, චැනල් එකේ විස්තර)
        for (let i = 2; i < titles.length && newsItems.length < 10; i++) {
            let title = titles[i].split('</title>')[0];
            // අනවශ්‍ය අකුරු අයින් කරනවා
            title = title.replace('<![CDATA[', '').replace(']]>', '').trim();
            if (title) newsItems.push(title);
        }

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
            <div class="content news-box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated Live News</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                // Autoplay හදාගන්න Screen එකේ කොහේ හරි එක පාරක් Click කරන්න
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                setInterval(() => {
                    if(items.length > 0) {
                        items[current].classList.remove('active');
                        current = (current + 1) % items.length;
                        items[current].classList.add('active');
                    }
                }, 8000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("News Fetch Error: " + e.message);
    }
};
