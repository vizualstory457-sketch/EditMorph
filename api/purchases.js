const fs = require('fs');
const path = require('path');

function formatPrivacySafeName(rawName) {
    if (!rawName || typeof rawName !== 'string') return 'Someone';
    const trimmed = rawName.trim();
    if (!trimmed || trimmed.toLowerCase() === 'customer' || trimmed.toLowerCase() === 'someone') return 'Someone';
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let purchases = [];
    try {
        const purchasesFile = path.join(process.cwd(), 'purchases.json');
        if (fs.existsSync(purchasesFile)) {
            const data = JSON.parse(fs.readFileSync(purchasesFile, 'utf8') || '[]');
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

    res.status(200).json({ purchases });
};
