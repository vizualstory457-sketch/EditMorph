const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SERVER_SECRET = process.env.OFFER_SECRET || 'editmorph_textmorph_secret_key_2026';
const OFFER_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
const PROMO_PRICE_INR = 99;
const REGULAR_PRICE_INR = 899;
const PROMO_PAYMENT_URL = 'https://rzp.io/rzp/textmorphpro';
const REGULAR_PAYMENT_URL = 'https://rzp.io/rzp/textmorphpro'; // In production, regular payment link

function signOffer(visitorId, expiresAt) {
    const data = `${visitorId}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', SERVER_SECRET).update(data).digest('hex');
    return `${data}:${hmac}`;
}

function verifyOffer(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split(':');
    if (parts.length !== 3) return null;
    const [visitorId, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt)) return null;

    const expectedHmac = crypto.createHmac('sha256', SERVER_SECRET).update(`${visitorId}:${expiresAt}`).digest('hex');
    if (signature !== expectedHmac) return null;

    const now = Date.now();
    const isExpired = now >= expiresAt;
    const remainingMs = Math.max(0, expiresAt - now);

    return {
        visitorId,
        expiresAt,
        isExpired,
        remainingMs,
        isValid: !isExpired
    };
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const action = url.searchParams.get('action') || 'status';
    const visitorIdQuery = url.searchParams.get('visitor_id');
    const tokenQuery = url.searchParams.get('token');

    let body = {};
    if (req.method === 'POST') {
        try {
            body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
        } catch (e) {
            body = {};
        }
    }

    const visitorId = body.visitor_id || visitorIdQuery || ('vid_' + crypto.randomBytes(8).toString('hex'));
    const token = body.token || tokenQuery;

    // 1. If existing valid token is provided, verify it
    if (token) {
        const verified = verifyOffer(token);
        if (verified && verified.visitorId === visitorId) {
            if (verified.isValid) {
                return res.status(200).json({
                    success: true,
                    visitor_id: verified.visitorId,
                    token: token,
                    expires_at: verified.expiresAt,
                    remaining_ms: verified.remainingMs,
                    is_expired: false,
                    price_inr: PROMO_PRICE_INR,
                    regular_price_inr: REGULAR_PRICE_INR,
                    discount_badge: 'SAVE 89%',
                    checkout_url: PROMO_PAYMENT_URL
                });
            } else {
                return res.status(200).json({
                    success: true,
                    visitor_id: verified.visitorId,
                    token: token,
                    expires_at: verified.expiresAt,
                    remaining_ms: 0,
                    is_expired: true,
                    price_inr: REGULAR_PRICE_INR,
                    regular_price_inr: REGULAR_PRICE_INR,
                    discount_badge: null,
                    checkout_url: REGULAR_PAYMENT_URL
                });
            }
        }
    }

    // 2. Otherwise initialize a brand new 6-hour offer for this visitor
    const now = Date.now();
    const expiresAt = now + OFFER_DURATION_MS;
    const newToken = signOffer(visitorId, expiresAt);

    return res.status(200).json({
        success: true,
        visitor_id: visitorId,
        token: newToken,
        expires_at: expiresAt,
        remaining_ms: OFFER_DURATION_MS,
        is_expired: false,
        price_inr: PROMO_PRICE_INR,
        regular_price_inr: REGULAR_PRICE_INR,
        discount_badge: 'SAVE 89%',
        checkout_url: PROMO_PAYMENT_URL
    });
};
