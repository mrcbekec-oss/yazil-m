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

    // Başlangıç değerlerini editör kutularına yerleştiriyoruz
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
            const extensions = { html: 'index.html', css: 'style.css', js: 'script.js' };
            fileLabel.textContent = extensions[target];
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

    // Uygulama ilk açıldığında önizlemeyi bir kez çalıştır
    updatePreview();
});
