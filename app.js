// Sayfa tamamen yüklendiğinde çalışacak olan ana fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    
    // HTML üzerindeki elemanları JavaScript'e tanıtıyoruz (bağlıyoruz)
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('css-editor');
    const jsEditor = document.getElementById('js-editor');
    const previewIframe = document.getElementById('preview-iframe');
    const fileLabel = document.getElementById('current-file-label');
    const toast = document.getElementById('toast');
    
    const navItems = document.querySelectorAll('.nav-item');
    const editorPanes = document.querySelectorAll('.editor-pane');
    const btnExport = document.getElementById('btn-export');
    const btnShare = document.getElementById('btn-share');
    const btnOpenNew = document.getElementById('btn-open-new');

    // Başlangıçta editörde görünecek örnek HTML kodu
    const initialHTML = `<!-- Merhaba! Kodunuzu buraya yazmaya başlayın -->
<div class="welcome">
    <h1>Nebula IDE'ye Hoş Geldiniz!</h1>
    <p>Sol taraftaki sekmelerden HTML, CSS veya JS yazarak başlayabilirsiniz.</p>
    <div class="card">
        <h3>Özellikler</h3>
        <ul>
            <li>Canlı Önizleme</li>
            <li>Premium Tasarım</li>
            <li>Kolay Kullanım</li>
        </ul>
    </div>
</div>`;

    // Başlangıçta editörde görünecek örnek CSS (stil) kodu
    const initialCSS = `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.welcome {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    max-width: 500px;
}

h1 { color: #6366f1; }
.card {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 12px;
    margin-top: 1rem;
    text-align: left;
}
ul { list-style-type: '🚀 '; }`;

    // Başlangıçta editörde görünecek örnek JavaScript kodu
    const initialJS = `console.log('Nebula IDE hazır!');

// Küçük bir etkileşim ekleyelim: Başlığa tıklayınca mesaj verir
document.querySelector('h1').addEventListener('click', () => {
    alert('Kod yazmak hiç bu kadar kolay olmamıştı!');
});`;

    // Örnek Uygulamalar Veritabanı
    const examples = {
        clock: {
            html: '<div class="clock">\n  <div class="hour"></div>\n  <div class="minute"></div>\n  <div class="second"></div>\n</div>',
            css: 'body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #282c34; }\n.clock { width: 200px; height: 200px; border: 10px solid white; border-radius: 50%; position: relative; }\n.hour, .minute, .second { position: absolute; background: white; bottom: 50%; left: 50%; transform-origin: bottom; }\n.hour { width: 6px; height: 50px; margin-left: -3px; }\n.minute { width: 4px; height: 70px; margin-left: -2px; }\n.second { width: 2px; height: 80px; margin-left: -1px; background: red; }',
            js: 'function setDate() {\n  const now = new Date();\n  const seconds = now.getSeconds();\n  const minutes = now.getMinutes();\n  const hours = now.getHours();\n  document.querySelector(".second").style.transform = `rotate(${seconds * 6}deg)`;\n  document.querySelector(".minute").style.transform = `rotate(${minutes * 6}deg)`;\n  document.querySelector(".hour").style.transform = `rotate(${hours * 30}deg)`;\n}\nsetInterval(setDate, 1000);'
        },
        todo: {
            html: '<div class="todo-app">\n  <h2>Yapılacaklar</h2>\n  <input type="text" id="taskInput" placeholder="Yeni görev...">\n  <button onclick="addTask()">Ekle</button>\n  <ul id="taskList"></ul>\n</div>',
            css: 'body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }\n.todo-app { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 400px; margin: auto; }\ninput { padding: 8px; width: 70%; }\nbutton { padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 4px; }\nul { list-style: none; padding: 0; margin-top: 20px; }\nli { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }',
            js: 'function addTask() {\n  const input = document.getElementById("taskInput");\n  if (!input.value) return;\n  const li = document.createElement("li");\n  li.innerHTML = `${input.value} <button onclick="this.parentElement.remove()">Sil</button>`;\n  document.getElementById("taskList").appendChild(li);\n  input.value = "";\n}'
        },
        counter: {
            html: '<div class="counter-card">\n  <h1>Sayaç</h1>\n  <div id="count">0</div>\n  <button onclick="change(-1)">-</button>\n  <button onclick="change(1)">+</button>\n</div>',
            css: 'body { display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; }\n.counter-card { text-align: center; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }\n#count { font-size: 60px; font-weight: bold; margin: 20px 0; color: #6366f1; }\nbutton { font-size: 24px; padding: 10px 20px; margin: 5px; cursor: pointer; }',
            js: 'let currentCount = 0;\nfunction change(val) {\n  currentCount += val;\n  document.getElementById("count").textContent = currentCount;\n}'
        },
        card: {
            html: '<div class="product-card">\n  <div class="badge">Yeni</div>\n  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Ayakkabı">\n  <div class="content">\n    <h3>Nebula Air Max</h3>\n    <p>Modern tasarım, maksimum konfor.</p>\n    <div class="price">1.299 TL</div>\n    <button class="buy-btn">Sepete Ekle</button>\n  </div>\n</div>',
            css: 'body { background: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: "Outfit", sans-serif; }\n.product-card { background: white; border-radius: 24px; width: 300px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); position: relative; }\n.badge { position: absolute; top: 15px; left: 15px; background: #6366f1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }\nimg { width: 100%; height: 200px; object-fit: cover; }\n.content { padding: 20px; }\n.price { font-size: 24px; font-weight: 700; margin: 15px 0; color: #1e293b; }\n.buy-btn { width: 100%; background: #0f172a; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; }\n.buy-btn:hover { background: #6366f1; }',
            js: 'document.querySelector(".buy-btn").addEventListener("click", () => alert("Ürün sepete eklendi!"));'
        }
    };
    // Eğer URL'de kayıtlı bir kod varsa onu yükle, yoksa varsayılanları yükle
    const loadFromURL = () => {
        try {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const decoded = JSON.parse(decodeURIComponent(escape(atob(hash))));
                htmlEditor.value = decoded.html || initialHTML;
                cssEditor.value = decoded.css || initialCSS;
                jsEditor.value = decoded.js || initialJS;
                return true;
            }
        } catch (e) {
            console.error("URL'den kod yüklenemedi:", e);
        }
        return false;
    };

    if (!loadFromURL()) {
        htmlEditor.value = initialHTML;
        cssEditor.value = initialCSS;
        jsEditor.value = initialJS;
    }

    // Önizleme ekranını (sağ taraf) güncelleyen ana fonksiyon
    function updatePreview() {
        const html = htmlEditor.value;
        const css = `<style>${cssEditor.value}</style>`;
        const js = `<script>${jsEditor.value}<\/script>`;
        
        // HTML, CSS ve JS kodlarını tek bir döküman haline getiriyoruz
        const combined = `
            <!DOCTYPE html>
            <html>
                <head>${css}</head>
                <body>
                    ${html}
                    ${js}
                </body>
            </html>
        `;
        
        // Oluşturulan dökümanı tarayıcının anlayacağı bir "dosya" (blob) haline getirip iframe'e yüklüyoruz
        const blob = new Blob([combined], { type: 'text/html' });
        previewIframe.src = URL.createObjectURL(blob);
    }

    // Performans için gecikmeli güncelleme (Kullanıcı yazmayı bitirdiğinde günceller)
    let timeout;
    function debouncedUpdate() {
        clearTimeout(timeout);
        timeout = setTimeout(updatePreview, 500); // 0.5 saniye bekle
    }

    // Editörlere her yazı yazıldığında (input) önizlemeyi güncelle
    htmlEditor.addEventListener('input', debouncedUpdate);
    cssEditor.addEventListener('input', debouncedUpdate);
    jsEditor.addEventListener('input', debouncedUpdate);

    // Sekmeler arası geçişi sağlayan mantık
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Aktif sekmeyi görsel olarak değiştir
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // İlgili editör kutusunu göster, diğerlerini gizle
            editorPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${target}-editor`) {
                    pane.classList.add('active');
                }
            });

            // Başlık çubuğundaki dosya ismini güncelle (index.html, style.css vb.)
            const extensions = { 
                html: 'index.html', 
                css: 'style.css', 
                js: 'script.js',
                lib: 'Kütüphane',
                levels: 'Bölümler'
            };
            fileLabel.textContent = extensions[target];
        });
    });

    // Örnekleri Yükleme Mantığı (Kütüphane Kartları)
    const exampleCards = document.querySelectorAll('.lib-card');
    exampleCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-example');
            const data = examples[type];
            
            if (data && confirm('Bu örneği yüklemek istediğinizden emin misiniz? Mevcut kodlarınız silinecektir.')) {
                htmlEditor.value = data.html;
                cssEditor.value = data.css;
                jsEditor.value = data.js;
                
                // İlk sekmeye (HTML) geri dön
                document.getElementById('btn-html').click();
                
                updatePreview();
                showToast(`${card.querySelector('h3').textContent} örneği yüklendi! ✨`);
            }
        });
    });

    // Yazılan kodları bilgisayara dosya olarak indirme fonksiyonu
    btnExport.addEventListener('click', () => {
        const html = htmlEditor.value;
        const css = `<style>${cssEditor.value}</style>`;
        const js = `<script>${jsEditor.value}<\/script>`;
        
        const fullHTML = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Nebula Export</title>
    ${css}
</head>
<body>
    ${html}
    ${js}
</body>
</html>`;

        // Dosya indirme işlemini tetikliyoruz
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nebula_proje.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Kullanıcıya başarı mesajı gösteriyoruz
        showToast('Proje başarıyla indirildi! 🚀');
    });

    // Paylaşma Fonksiyonu: Kodları URL'e gömer ve kopyalar
    btnShare.addEventListener('click', () => {
        const data = {
            html: htmlEditor.value,
            css: cssEditor.value,
            js: jsEditor.value
        };
        
        // Veriyi Base64 formatına çeviriyoruz
        const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        const shareURL = `${window.location.origin}${window.location.pathname}#${base64}`;
        
        // Panoya kopyala
        navigator.clipboard.writeText(shareURL).then(() => {
            showToast('Paylaşım linki kopyalandı! 🔗');
        }).catch(() => {
            showToast('Link kopyalanamadı! ❌');
        });
    });

    // Yeni Sekmede Aç Fonksiyonu
    btnOpenNew.addEventListener('click', () => {
        const html = htmlEditor.value;
        const css = `<style>${cssEditor.value}</style>`;
        const js = `<script>${jsEditor.value}<\/script>`;
        
        const combined = `<!DOCTYPE html><html><head>${css}</head><body>${html}${js}</body></html>`;
        const blob = new Blob([combined], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    });

    // Ekranda kısa süreli bildirim (toast) gösterme fonksiyonu
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Resizer (Boyutlandırma) Mantığı
    const resizer = document.getElementById('resizer');
    const editorSection = document.getElementById('editor-section');
    const mainContainer = document.querySelector('.nebula-main');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'row-resize';
        // Sürükleme sırasında iframe'in mouse olaylarını engellemesi için pointer-events'i kapatıyoruz
        previewIframe.style.pointerEvents = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const containerRect = mainContainer.getBoundingClientRect();
        const relativeY = e.clientY - containerRect.top;
        
        // Yüzdelik hesaplama
        let percentage = (relativeY / containerRect.height) * 100;
        
        // Sınırları belirle (%10 ile %90 arası)
        if (percentage < 10) percentage = 10;
        if (percentage > 90) percentage = 90;

        editorSection.style.height = `${percentage}%`;
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
        previewIframe.style.pointerEvents = 'all';
    });

    // Uygulama ilk açıldığında önizlemeyi bir kez çalıştır
    updatePreview();
});
