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
