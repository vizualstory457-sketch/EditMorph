const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    // Decode URL
    try {
        reqUrl = decodeURIComponent(reqUrl);
    } catch (e) {
        // ignore
    }

    let filePath = path.join(ROOT, reqUrl);

    // ==================== API ENDPOINTS ====================
    if (reqUrl === '/api/purchases' || reqUrl === '/api/recent-purchases') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });

        const purchasesFile = path.join(ROOT, 'purchases.json');
        let purchases = [];
        try {
            if (fs.existsSync(purchasesFile)) {
                const data = JSON.parse(fs.readFileSync(purchasesFile, 'utf8'));
                if (Array.isArray(data)) {
                    purchases = data.map(p => ({
                        id: p.id || String(Math.random()),
                        displayName: formatPrivacySafeName(p.customerName || p.name),
                        location: p.country || p.location || 'India',
                        productName: p.productName || 'TextMorph Pro 2.0',
                        createdAt: p.createdAt || p.timestamp || new Date().toISOString()
                    }));
                }
            }
        } catch (e) {
            console.error('Error reading purchases:', e);
        }

        res.end(JSON.stringify({ purchases }));
        return;
    }

    if (reqUrl === '/api/webhook/razorpay' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body || '{}');
                const payment = payload.payload?.payment?.entity || payload;
                const customerName = payment.notes?.customer_name || payment.notes?.name || payment.customer?.name || (payment.description !== 'TextMorph Pro 2.0' ? payment.description : null) || 'Someone';
                const country = payment.notes?.country || payment.country || 'India';
                
                const purchasesFile = path.join(ROOT, 'purchases.json');
                let list = [];
                if (fs.existsSync(purchasesFile)) {
                    list = JSON.parse(fs.readFileSync(purchasesFile, 'utf8') || '[]');
                }
                list.unshift({
                    id: payment.id || ('order_' + Date.now()),
                    customerName: customerName,
                    country: country,
                    productName: 'TextMorph Pro 2.0',
                    createdAt: new Date().toISOString()
                });
                // Keep last 50
                list = list.slice(0, 50);
                fs.writeFileSync(purchasesFile, JSON.stringify(list, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // If requesting directory or clean /store or /store/...
    if (reqUrl === '/store' || reqUrl === '/store/' || reqUrl.startsWith('/store/')) {
        // If it directly points to an existing file in store, e.g. store.js, store.css
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            serveFile(filePath, res);
            return;
        }
        // If it's a subfolder with index.html (like /store/textmorph-pro/index.html)
        const subIndex = path.join(filePath, 'index.html');
        if (fs.existsSync(subIndex)) {
            serveFile(subIndex, res);
            return;
        }
        // Otherwise SPA / cleanUrls rewrite to /store/index.html
        filePath = path.join(ROOT, 'store', 'index.html');
    } else if (reqUrl === '/' || reqUrl === '') {
        filePath = path.join(ROOT, 'index.html');
    } else {
        // Check if file exists as-is
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
            filePath = filePath + '.html';
        }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        serveFile(filePath, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Helper: formats names privacy-safely e.g. "Arjun Kumar" -> "Arjun K.", "Priya" -> "Priya", null -> "Someone"
function formatPrivacySafeName(rawName) {
    if (!rawName || typeof rawName !== 'string') return 'Someone';
    const trimmed = rawName.trim();
    if (!trimmed || trimmed.toLowerCase() === 'customer' || trimmed.toLowerCase() === 'someone') return 'Someone';
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
        'Content-Type': mime,
        'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
