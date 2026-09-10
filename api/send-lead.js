/**
 * ============================================================================
 * YUG WEB SOLUTIONS - NODE.JS / SERVERLESS LEAD CAPTURE API
 * ============================================================================
 * Suitable for Express.js, Next.js, or Vercel Serverless functions.
 * Recipient: yugwebsolutions@gmail.com
 * ============================================================================
 */

const nodemailer = require('nodemailer');

const RECIPIENT_EMAIL = 'yugwebsolutions@gmail.com';
const COMPANY_NAME    = 'Yug Web Solutions';
const PRODUCT_NAME    = 'Yug Smart IVR';

// Configure SMTP transport (e.g. Gmail App Password or custom SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER || 'yugwebsolutions@gmail.com',
        pass: process.env.SMTP_PASS || '' // App password
    }
});

async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { name, mobile, email, requirement, source } = req.body || {};
    const cleanMobile = String(mobile || '').replace(/\D/g, '');

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Please provide a valid full name.' });
    }

    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    const callUrl = `tel:+91${cleanMobile}`;
    const waUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(`Hello ${name}, thank you for enquiring about ${PRODUCT_NAME} (${requirement || 'IVR'}).`)}`;

    const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #161b20; color: #fff; padding: 25px; text-align: center; border-bottom: 4px solid #009640;">
                <span style="color: #4ade80; font-size: 11px; font-weight: 800; letter-spacing: 1.5px;">⚡ NEW INCOMING LEAD</span>
                <h2 style="margin: 6px 0 0;">${PRODUCT_NAME}</h2>
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">Engineered by ${COMPANY_NAME}</p>
            </div>
            <div style="padding: 25px;">
                <table width="100%" cellpadding="8" style="border-collapse: collapse;">
                    <tr><td style="color:#64748b; font-weight:bold; width:130px;">Name:</td><td><strong>${name}</strong></td></tr>
                    <tr><td style="color:#64748b; font-weight:bold;">Mobile:</td><td><a href="${callUrl}" style="color:#009640; font-weight:bold; font-size:16px;">+91 ${cleanMobile}</a></td></tr>
                    <tr><td style="color:#64748b; font-weight:bold;">Requirement:</td><td><span style="background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:20px; font-weight:bold; font-size:12px;">${requirement || 'IVR Solution'}</span></td></tr>
                    <tr><td style="color:#64748b; font-weight:bold;">Email:</td><td>${email || 'Not Provided'}</td></tr>
                    <tr><td style="color:#64748b; font-weight:bold;">Submitted At:</td><td>${submittedAt}</td></tr>
                </table>
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${callUrl}" style="display:inline-block; background:#009640; color:#fff; text-decoration:none; padding:12px 24px; border-radius:50px; font-weight:bold; margin-right:8px;">📞 Call Customer</a>
                    <a href="${waUrl}" style="display:inline-block; background:#25d366; color:#fff; text-decoration:none; padding:12px 24px; border-radius:50px; font-weight:bold;">💬 WhatsApp</a>
                </div>
            </div>
            <div style="background:#f8fafc; padding: 12px 25px; font-size: 11px; color:#64748b; border-top:1px solid #e2e8f0;">
                Source: ${source || 'https://yugsmartivr.com/'}
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"${PRODUCT_NAME}" <${process.env.SMTP_USER || 'leads@yugsmartivr.com'}>`,
            to: RECIPIENT_EMAIL,
            replyTo: email || RECIPIENT_EMAIL,
            subject: `🔔 New IVR Lead: ${name} - ${requirement || 'IVR'} (+91 ${cleanMobile})`,
            html: htmlMessage
        });
        return res.status(200).json({ success: true, message: 'Lead sent successfully.' });
    } catch (err) {
        console.error('Email sending error:', err);
        return res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
}

module.exports = handler;
