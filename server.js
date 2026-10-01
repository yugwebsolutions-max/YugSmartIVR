/**
 * ============================================================================
 * YUG SMART IVR - PURE NODE.JS LEAD CAPTURE & JSON TRACKING SERVER
 * ============================================================================
 * Zero dependencies (runs on vanilla Node.js: `node api/server.js`).
 * Listens on port 3000.
 * Automatically records leads directly to `api/leads.json`.
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');
const ROOT_DIR = __dirname;

// Ensure leads.json exists
if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]', 'utf8');
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Enterprise Security Headers
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    // Helper: Generate HTML email template styled with Yug Smart IVR website theme
    function generateEmailTemplate(lead) {
        const cleanMobile = String(lead.mobile || lead.customerMobileNumber || '9899285923').replace(/\D/g, '');
        const custName = lead.name || lead.customerName || 'Valued Customer';
        const requirement = lead.requirement || 'IVR Solution';
        const email = lead.email || 'Not Provided';
        const timestamp = lead.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
        const directCall = '+91 7387829461';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New IVR Lead - Yug Smart IVR</title>
</head>
<body style="margin:0; padding:20px 0; background-color:#0f1419; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.35);">
        <!-- Top Emerald Accent Bar -->
        <tr>
            <td style="background:linear-gradient(90deg, #009640 0%, #10b981 100%); height:6px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <!-- Header Section (Dark Slate) -->
        <tr>
            <td style="background:#161b20; padding:28px 32px 24px; border-bottom:1px solid #232a32;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div style="display:inline-block; vertical-align:middle;">
                                <h1 style="margin:0; font-size:22px; font-weight:800; color:#ffffff; letter-spacing:0.5px;">
                                    YUG <span style="color:#009640;">SMART IVR</span>
                                </h1>
                                <p style="margin:4px 0 0; font-size:12px; color:#9ca3af; font-weight:500;">
                                    Cloud Telephony Solutions by Yug Web Solutions
                                </p>
                            </div>
                        </td>
                        <td align="right" style="vertical-align:middle;">
                            <span style="background:rgba(0,150,64,0.18); border:1px solid rgba(0,150,64,0.4); color:#34d399; font-size:11px; font-weight:700; padding:6px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:1px;">
                                🟢 New Lead
                            </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Alert Notification Banner -->
        <tr>
            <td style="background:#eafaf1; padding:16px 32px; border-bottom:1px solid #d1fae5;">
                <p style="margin:0; font-size:14px; color:#065f46; font-weight:600;">
                    🎉 You have received a new business lead from your website!
                </p>
            </td>
        </tr>

        <!-- Main Details Content -->
        <tr>
            <td style="padding:28px 32px 20px;">
                <h3 style="margin:0 0 16px; font-size:14px; text-transform:uppercase; color:#6b7280; letter-spacing:1px; font-weight:700;">
                    Customer Details
                </h3>

                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; border-collapse:separate;">
                    <tr style="background:#f9fafb;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563; width:40%; border-bottom:1px solid #e5e7eb;">
                            👤 Customer Name
                        </td>
                        <td style="padding:14px 18px; font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #e5e7eb;">
                            ${custName}
                        </td>
                    </tr>
                    <tr style="background:#ffffff;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563; border-bottom:1px solid #e5e7eb;">
                            📱 Customer Mobile Number
                        </td>
                        <td style="padding:14px 18px; font-size:15px; font-weight:800; color:#009640; border-bottom:1px solid #e5e7eb;">
                            <a href="tel:+91${cleanMobile}" style="color:#009640; text-decoration:none;">
                                +91 ${cleanMobile}
                            </a>
                        </td>
                    </tr>
                    <tr style="background:#f9fafb;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563; border-bottom:1px solid #e5e7eb;">
                            💼 Requirement
                        </td>
                        <td style="padding:14px 18px; font-size:14px; font-weight:700; color:#1f2937; border-bottom:1px solid #e5e7eb;">
                            <span style="background:#e0f2fe; color:#0369a1; padding:3px 10px; border-radius:6px; font-size:13px;">
                                ${requirement}
                            </span>
                        </td>
                    </tr>
                    <tr style="background:#ffffff;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563; border-bottom:1px solid #e5e7eb;">
                            ✉️ Customer Email
                        </td>
                        <td style="padding:14px 18px; font-size:13px; font-weight:500; color:#374151; border-bottom:1px solid #e5e7eb;">
                            ${email !== 'Not Provided' ? `<a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>` : 'Not Provided'}
                        </td>
                    </tr>
                    <tr style="background:#f9fafb;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563; border-bottom:1px solid #e5e7eb;">
                            📞 Direct Call (Company)
                        </td>
                        <td style="padding:14px 18px; font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #e5e7eb;">
                            <a href="tel:+917387829461" style="color:#009640; text-decoration:none;">
                                ${directCall}
                            </a>
                        </td>
                    </tr>
                    <tr style="background:#ffffff;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563;">
                            🕒 Submission Time
                        </td>
                        <td style="padding:14px 18px; font-size:13px; font-weight:500; color:#6b7280;">
                            ${timestamp}
                        </td>
                    </tr>
                </table>

                <!-- One-Tap Action Buttons -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:22px;">
                    <tr>
                        <td align="center" style="padding:6px 4px;">
                            <a href="tel:+91${cleanMobile}" style="display:inline-block; width:85%; background:#009640; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:13px 20px; border-radius:8px; text-align:center; box-shadow:0 4px 12px rgba(0,150,64,0.3);">
                                📞 Call Customer (+91 ${cleanMobile})
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background:#f9fafb; padding:20px 32px; border-top:1px solid #e5e7eb; text-align:center;">
                <p style="margin:0 0 6px; font-size:12px; color:#6b7280; font-weight:600;">
                    Yug Smart IVR | Yug Web Solutions
                </p>
                <p style="margin:0; font-size:11px; color:#9ca3af;">
                    Sales & Support: <a href="tel:+917387829461" style="color:#009640; text-decoration:none; font-weight:600;">+91 7387829461</a> &bull;
                    <a href="mailto:yugwebsolutions@gmail.com" style="color:#6b7280; text-decoration:none;">yugwebsolutions@gmail.com</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
    }

    // Security: Input Sanitizer Helper
    function cleanInput(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/<[^>]+>/g, '').replace(/javascript:/gi, '').trim();
    }

    // API: Modular endpoints
    if (url.pathname === '/api/leads') {
        const leadsHandler = require('./api/leads.js');
        leadsHandler(req, res);
        return;
    }

    if (url.pathname === '/api/send-lead') {
        const sendLeadHandler = require('./api/send-lead.js');
        sendLeadHandler(req, res);
        return;
    }

    // API: GET /api/email-preview -> Preview HTML email template matching website theme
    if (url.pathname === '/api/email-preview' && req.method === 'GET') {
        let sampleLead = {
            customerName: 'Yug Web Solutions Client',
            name: 'Yug Web Solutions Client',
            customerMobileNumber: '+91 9899285923',
            mobile: '9899285923',
            requirement: '2 SIM IVR Solution',
            email: 'yugwebsolutions@gmail.com',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
        };

        try {
            const fileContent = fs.readFileSync(LEADS_FILE, 'utf8');
            const leads = JSON.parse(fileContent || '[]');
            if (leads.length > 0) {
                sampleLead = leads[0];
            }
        } catch (e) {}

        const html = generateEmailTemplate(sampleLead);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
    }

    // 0. Explicit Directory Traversal Block
    if (req.url.includes('..') || url.pathname.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 Forbidden - Directory Traversal Denied</h1>');
        return;
    }

    // Static File Serving with Path-Traversal Defense & Sensitive File Shielding
    const safePath = path.normalize(url.pathname === '/' ? '/index.html' : url.pathname);
    const filePath = path.join(ROOT_DIR, safePath);
    const resolvedPath = path.resolve(filePath);
    const resolvedRoot = path.resolve(ROOT_DIR);

    // 1. Path Traversal Defense
    if (!resolvedPath.startsWith(resolvedRoot)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 Forbidden - Path Traversal Denied</h1>');
        return;
    }

    // 2. Sensitive File & Hidden Directory Shielding
    const fileName = path.basename(filePath).toLowerCase();
    const pathSegments = safePath.split(/[/\\]/).filter(Boolean);
    const sensitiveNames = ['leads.json', 'leads_log.json', '.env', '.git', '.htaccess', 'server.js', 'package.json'];
    const isForbidden = pathSegments.some(seg => seg.startsWith('.') || sensitiveNames.includes(seg.toLowerCase())) || sensitiveNames.includes(fileName);

    if (isForbidden) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 Forbidden - Access to Protected Resource Denied</h1>');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Yug Smart IVR Server Running at: http://localhost:${PORT}`);
    console.log(`📁 Leads file location: ${LEADS_FILE}`);
    console.log(`====================================================`);
});
