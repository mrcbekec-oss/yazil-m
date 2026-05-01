document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('css-editor');
    const jsEditor = document.getElementById('js-editor');
    const previewIframe = document.getElementById('preview-iframe');
    const fileLabel = document.getElementById('current-file-label');
    const toast = document.getElementById('toast');
    
    const navItems = document.querySelectorAll('.nav-item');
    const editorPanes = document.querySelectorAll('.editor-pane');
    const btnExport = document.getElementById('btn-export');

    // Initial Content
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

    const initialJS = `console.log('Nebula IDE hazır!');

// Küçük bir etkileşim ekleyelim
document.querySelector('h1').addEventListener('click', () => {
    alert('Kod yazmak hiç bu kadar kolay olmamıştı!');
});`;

    // Set initial values
    htmlEditor.value = initialHTML;
    cssEditor.value = initialCSS;
    jsEditor.value = initialJS;

    // Update Preview Function
    function updatePreview() {
        const html = htmlEditor.value;
        const css = `<style>${cssEditor.value}</style>`;
        const js = `<script>${jsEditor.value}<\/script>`;
        
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
        
        const blob = new Blob([combined], { type: 'text/html' });
        previewIframe.src = URL.createObjectURL(blob);
    }

    // Debounced Update
    let timeout;
    function debouncedUpdate() {
        clearTimeout(timeout);
        timeout = setTimeout(updatePreview, 500);
    }

    // Event Listeners for Input
    htmlEditor.addEventListener('input', debouncedUpdate);
    cssEditor.addEventListener('input', debouncedUpdate);
    jsEditor.addEventListener('input', debouncedUpdate);

    // Tab Switching
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Update Navigation
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update Editor Visibility
            editorPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${target}-editor`) {
                    pane.classList.add('active');
                }
            });

            // Update Label
            const extensions = { html: 'index.html', css: 'style.css', js: 'script.js' };
            fileLabel.textContent = extensions[target];
        });
    });

    // Export Functionality
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

        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nebula_proje.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Proje başarıyla indirildi! 🚀');
    });

    // Toast Notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Initialize
    updatePreview();
});
