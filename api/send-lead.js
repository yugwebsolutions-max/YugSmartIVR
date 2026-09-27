/**
 * ============================================================================
 * YUG SMART IVR - VERCEL SERVERLESS EMAIL DISPATCH API
 * ============================================================================
 * Endpoint: POST /api/send-lead
 * 
 * Features:
 * - 100% White-Labeled Email Dispatch (ZERO sponsor ads, ZERO third-party footers)
 * - Directly sends custom-styled HTML notification to yugwebsolutions@gmail.com
 * - One-Tap "Call Customer" CTA button in every email
 * - Native Gmail SMTP / App Password support via Nodemailer
 * - Fallback support for Resend API
 * - Enterprise Security: Input sanitization, anti-bot honeypot, CORS headers
 * ============================================================================
 */

let nodemailer = null;
try {
    nodemailer = require('nodemailer');
} catch (e) {
    // Nodemailer is resolved automatically on Vercel deployment via package.json
}

// Configuration
const CONFIG = {
    recipientEmail: process.env.LEAD_RECIPIENT_EMAIL || 'yugwebsolutions@gmail.com',
    senderEmail: process.env.GMAIL_USER || 'yugwebsolutions@gmail.com',
    companyName: 'Yug Web Solutions',
    productName: 'Yug Smart IVR',
    companyPhone: '+91 7387829461'
};

// Security: Input Sanitizer
function sanitize(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]+>/g, '').replace(/javascript:/gi, '').trim();
}

// Generate IST Timestamp
function getISTTimestamp() {
    return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) + ' IST';
}

// Generate White-Labeled HTML Email Template (No Ads, No Third-Party Footers)
function buildHtmlEmail(lead) {
    const cleanMobile = String(lead.mobile || '').replace(/\D/g, '');
    const custName = lead.name || 'Valued Customer';
    const requirement = lead.requirement || 'IVR Solution';
    const email = lead.email && lead.email.trim() ? lead.email.trim() : 'Not Provided';
    const timestamp = lead.timestamp || getISTTimestamp();
    const source = lead.source || 'Website Form';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New IVR Lead - ${CONFIG.productName}</title>
</head>
<body style="margin:0; padding:24px 0; background-color:#0f1419; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.4);">
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
                                    Cloud Telephony Solutions by ${CONFIG.companyName}
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
                    🎉 You have received a new business enquiry from your website!
                </p>
            </td>
        </tr>

        <!-- Main Details Content -->
        <tr>
            <td style="padding:28px 32px 20px;">
                <h3 style="margin:0 0 16px; font-size:13px; text-transform:uppercase; color:#6b7280; letter-spacing:1px; font-weight:700;">
                    Lead Details
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
                            📞 Direct Company Line
                        </td>
                        <td style="padding:14px 18px; font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #e5e7eb;">
                            <a href="tel:${CONFIG.companyPhone.replace(/\s+/g, '')}" style="color:#009640; text-decoration:none;">
                                ${CONFIG.companyPhone}
                            </a>
                        </td>
                    </tr>
                    <tr style="background:#ffffff;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563; border-bottom:1px solid #e5e7eb;">
                            🕒 Submission Time
                        </td>
                        <td style="padding:14px 18px; font-size:13px; font-weight:500; color:#6b7280; border-bottom:1px solid #e5e7eb;">
                            ${timestamp}
                        </td>
                    </tr>
                    <tr style="background:#f9fafb;">
                        <td style="padding:14px 18px; font-size:13px; font-weight:600; color:#4b5563;">
                            🌐 Lead Source
                        </td>
                        <td style="padding:14px 18px; font-size:12px; font-weight:500; color:#6b7280; word-break:break-all;">
                            ${source}
                        </td>
                    </tr>
                </table>

                <!-- One-Tap Action Button -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:22px;">
                    <tr>
                        <td align="center" style="padding:6px 4px;">
                            <a href="tel:+91${cleanMobile}" style="display:inline-block; width:88%; background:#009640; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:13px 20px; border-radius:8px; text-align:center; box-shadow:0 4px 12px rgba(0,150,64,0.3);">
                                📞 Call Customer Now (+91 ${cleanMobile})
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Clean Footer (No Ads, No Third-Party Sponsors) -->
        <tr>
            <td style="background:#f9fafb; padding:20px 32px; border-top:1px solid #e5e7eb; text-align:center;">
                <p style="margin:0 0 6px; font-size:12px; color:#4b5563; font-weight:700;">
                    ${CONFIG.productName} | ${CONFIG.companyName}
                </p>
                <p style="margin:0; font-size:11px; color:#9ca3af;">
                    Helpline: <a href="tel:${CONFIG.companyPhone.replace(/\s+/g, '')}" style="color:#009640; text-decoration:none; font-weight:600;">${CONFIG.companyPhone}</a> &bull;
                    <a href="mailto:${CONFIG.recipientEmail}" style="color:#6b7280; text-decoration:none;">${CONFIG.recipientEmail}</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// Serverless Handler
module.exports = async function handler(req, res) {
    // Set CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    // Handle OPTIONS Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
        return;
    }

    try {
        // Parse request body
        let body = req.body;
        if (!body || typeof body !== 'object') {
            const rawBody = await new Promise((resolve) => {
                let chunks = '';
                req.on('data', chunk => { chunks += chunk; });
                req.on('end', () => resolve(chunks));
            });
            try {
                body = JSON.parse(rawBody || '{}');
            } catch (e) {
                body = {};
            }
        }

        // Anti-Bot Honeypot Protection
        if (body._yug_hp_trap && String(body._yug_hp_trap).trim().length > 0) {
            console.warn('[Security] Bot trap triggered in /api/send-lead. Discarded silently.');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Processed successfully' }));
            return;
        }

        // Sanitize Lead Data
        const cleanMobile = String(body.mobile || body.customerMobileNumber || '').replace(/\D/g, '');
        const cleanName = sanitize(body.name || body.customerName || 'Customer');
        const cleanEmail = sanitize(body.email || 'Not Provided');
        const cleanReq = sanitize(body.requirement || 'IVR Solution');
        const cleanSource = sanitize(body.source || 'Website Form');
        const timestamp = getISTTimestamp();

        if (!cleanMobile || cleanMobile.length < 10) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Valid 10-digit mobile number is required' }));
            return;
        }

        const leadRecord = {
            name: cleanName,
            mobile: cleanMobile,
            email: cleanEmail,
            requirement: cleanReq,
            source: cleanSource,
            timestamp: timestamp
        };

        const emailHtml = buildHtmlEmail(leadRecord);
        const emailSubject = `🔔 New IVR Lead: ${cleanName} - ${cleanReq} (+91 ${cleanMobile})`;

        // Dispatch Option 1: Gmail SMTP via Nodemailer
        const rawPassword = process.env.GMAIL_APP_PASSWORD;
        const gmailPassword = rawPassword ? String(rawPassword).replace(/\s+/g, '') : null;
        const gmailUser = (process.env.GMAIL_USER ? String(process.env.GMAIL_USER).trim() : null) || CONFIG.senderEmail;

        if (gmailPassword && nodemailer) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailPassword
                }
            });

            await transporter.sendMail({
                from: `"${CONFIG.productName}" <${gmailUser}>`,
                to: CONFIG.recipientEmail,
                replyTo: cleanEmail && cleanEmail !== 'Not Provided' ? cleanEmail : gmailUser,
                subject: emailSubject,
                html: emailHtml
            });

            console.log(`[Success] Lead email dispatched via Gmail SMTP: ${cleanName} (${cleanMobile})`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Lead email sent successfully via Gmail SMTP (Zero Ads)',
                lead: leadRecord
            }));
            return;
        }

        // Dispatch Option 2: Resend API (if RESEND_API_KEY is configured)
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: `${CONFIG.productName} <onboarding@resend.dev>`,
                    to: [CONFIG.recipientEmail],
                    subject: emailSubject,
                    html: emailHtml
                })
            });

            if (resendResponse.ok) {
                console.log(`[Success] Lead email dispatched via Resend API: ${cleanName} (${cleanMobile})`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Lead email sent successfully via Resend (Zero Ads)',
                    lead: leadRecord
                }));
                return;
            }
        }

        // Fallback Notice: If environment variables are not yet configured in Vercel
        console.warn('[Notice] GMAIL_APP_PASSWORD or RESEND_API_KEY not set in environment variables.');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            fallback_needed: true,
            message: 'Serverless endpoint reached, waiting for GMAIL_APP_PASSWORD in Vercel settings.',
            lead: leadRecord
        }));

    } catch (err) {
        console.error('[Error] Lead dispatch failed:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message || 'Internal server error' }));
    }
};
