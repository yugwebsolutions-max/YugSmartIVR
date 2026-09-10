<?php
/**
 * ============================================================================
 * YUG WEB SOLUTIONS - IVR LEAD CAPTURE & NOTIFICATION API
 * ============================================================================
 * Purpose: Receives lead form submissions, validates customer details,
 *          logs lead securely, and dispatches a responsive HTML email
 *          template to the sales team at yugwebsolutions@gmail.com.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. CONFIGURATION SETTINGS
// ----------------------------------------------------------------------------
$RECIPIENT_EMAIL   = 'yugwebsolutions@gmail.com';
$COMPANY_NAME      = 'Yug Web Solutions';
$PRODUCT_NAME      = 'Yug Smart IVR';
$SYSTEM_FROM_EMAIL = 'leads@yugsmartivr.com'; // Change to your domain email if required by your host
$SUPPORT_PHONE     = '+91 7387829461';

// Set Indian Standard Time timezone
date_default_timezone_set('Asia/Kolkata');

// ----------------------------------------------------------------------------
// 2. CORS & HTTP RESPONSE HEADERS
// ----------------------------------------------------------------------------
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Only POST is accepted.'
    ]);
    exit;
}

// ----------------------------------------------------------------------------
// 3. PARSE INCOMING DATA (JSON or URL-ENCODED FORM)
// ----------------------------------------------------------------------------
$contentType = isset($_SERVER['CONTENT_TYPE']) ? trim($_SERVER['CONTENT_TYPE']) : '';
$rawBody     = file_get_contents('php://input');

$inputData = [];
if (!empty($rawBody) && stripos($contentType, 'application/json') !== false) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $inputData = $decoded;
    }
}

// Fallback to standard $_POST if JSON body is empty
if (empty($inputData) && !empty($_POST)) {
    $inputData = $_POST;
}

// ----------------------------------------------------------------------------
// 4. SANITIZE & EXTRACT LEAD FIELDS
// ----------------------------------------------------------------------------
$name        = isset($inputData['name']) ? trim(strip_tags($inputData['name'])) : '';
$rawMobile   = isset($inputData['mobile']) ? trim($inputData['mobile']) : '';
$cleanMobile = preg_replace('/\D/', '', $rawMobile);
$email       = isset($inputData['email']) ? filter_var(trim($inputData['email']), FILTER_SANITIZE_EMAIL) : '';
$requirement = isset($inputData['requirement']) ? trim(strip_tags($inputData['requirement'])) : 'IVR Solution';
$sourceUrl   = isset($inputData['source']) ? trim(strip_tags($inputData['source'])) : (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'https://yugsmartivr.com/');

// Client Metadata
$clientIp    = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0] : (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown');
$userAgent   = isset($_SERVER['HTTP_USER_AGENT']) ? trim(strip_tags($_SERVER['HTTP_USER_AGENT'])) : 'Unknown';
$submittedAt = date('d M Y, h:i A') . ' IST';

// ----------------------------------------------------------------------------
// 5. DATA VALIDATION
// ----------------------------------------------------------------------------
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please provide a valid full name.';
}

// Check 10-digit Indian Mobile format (must start with 6, 7, 8, or 9)
if (empty($cleanMobile) || strlen($cleanMobile) !== 10 || !preg_match('/^[6-9]\d{9}$/', $cleanMobile)) {
    $errors[] = 'Please provide a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors),
        'errors'  => $errors
    ]);
    exit;
}

// ----------------------------------------------------------------------------
// 6. BUILD HIGH-CONVERTING HTML EMAIL TEMPLATE
// ----------------------------------------------------------------------------
$encodedName       = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$encodedMobile     = htmlspecialchars($cleanMobile, ENT_QUOTES, 'UTF-8');
$encodedEmail      = !empty($email) ? htmlspecialchars($email, ENT_QUOTES, 'UTF-8') : '<span style="color: #94a3b8; font-style: italic;">Not Provided</span>';
$encodedReq        = htmlspecialchars($requirement, ENT_QUOTES, 'UTF-8');
$encodedSubmitted  = htmlspecialchars($submittedAt, ENT_QUOTES, 'UTF-8');
$encodedSource     = htmlspecialchars($sourceUrl, ENT_QUOTES, 'UTF-8');
$encodedIp         = htmlspecialchars($clientIp, ENT_QUOTES, 'UTF-8');

// Action links for sales representative
$callUrl   = 'tel:+91' . $cleanMobile;
$waMessage = rawurlencode("Hello {$name}, thank you for enquiring about {$PRODUCT_NAME} ({$requirement}). I am contacting you from {$COMPANY_NAME} to assist you with pricing & demo.");
$waUrl     = 'https://wa.me/91' . $cleanMobile . '?text=' . $waMessage;

$emailSubject = "🔔 New IVR Lead: {$name} - {$requirement} (+91 {$cleanMobile})";

$htmlMessage = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">

    <!-- Wrapper Table -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 10px;">
        <tr>
            <td align="center">
                <!-- Main Container Card -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                    
                    <!-- Brand Header Banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #161b20 0%, #0d1013 100%); padding: 28px 30px; text-align: center; border-bottom: 4px solid #009640;">
                            <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #4ade80; text-transform: uppercase; margin-bottom: 6px;">
                                ⚡ NEW INCOMING LEAD NOTIFICATION
                            </div>
                            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                                {$PRODUCT_NAME}
                            </h1>
                            <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.7);">
                                Engineered by {$COMPANY_NAME}
                            </p>
                        </td>
                    </tr>

                    <!-- Urgent Notice / Badge -->
                    <tr>
                        <td style="padding: 20px 30px 10px;">
                            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; text-align: center;">
                                <span style="font-size: 13px; color: #065f46; font-weight: 600;">
                                    🎯 A prospective customer just submitted an enquiry on your website. Contact them promptly for maximum conversion!
                                </span>
                            </div>
                        </td>
                    </tr>

                    <!-- Lead Details Structured Card -->
                    <tr>
                        <td style="padding: 10px 30px 20px;">
                            <h2 style="font-size: 15px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin: 15px 0 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">
                                Customer Contact Information
                            </h2>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; width: 140px; font-size: 13px; color: #64748b; font-weight: 600;">
                                        Customer Name:
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #0f172a; font-weight: 700;">
                                        {$encodedName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #64748b; font-weight: 600;">
                                        Mobile Number:
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 16px; font-weight: 800; color: #009640;">
                                        <a href="{$callUrl}" style="color: #009640; text-decoration: none;">+91 {$encodedMobile}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #64748b; font-weight: 600;">
                                        Requirement:
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 50px; border: 1px solid #bbf7d0;">
                                            {$encodedReq}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #64748b; font-weight: 600;">
                                        Email Address:
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a;">
                                        {$encodedEmail}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                                        Submitted On:
                                    </td>
                                    <td style="padding: 10px 0; font-size: 13px; color: #334155; font-weight: 500;">
                                        {$encodedSubmitted}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Direct Action Buttons for Sales Rep -->
                    <tr>
                        <td style="padding: 10px 30px 25px; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <a href="{$callUrl}" style="display: block; width: 85%; max-width: 320px; background-color: #009640; color: #ffffff; text-decoration: none; padding: 13px 20px; border-radius: 50px; font-weight: 700; font-size: 14px; text-align: center; box-shadow: 0 4px 12px rgba(0,150,64,0.3);">
                                            📞 Call Customer (+91 {$encodedMobile})
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="{$waUrl}" style="display: block; width: 85%; max-width: 320px; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 13px 20px; border-radius: 50px; font-weight: 700; font-size: 14px; text-align: center; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                                            💬 WhatsApp Customer
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Technical Audit Section -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 18px 30px; border-top: 1px solid #e2e8f0;">
                            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                Submission Technical Details:
                            </div>
                            <div style="font-size: 11px; color: #64748b; line-height: 1.6;">
                                • <strong>Source:</strong> <a href="{$encodedSource}" style="color: #64748b;">{$encodedSource}</a><br>
                                • <strong>Client IP:</strong> {$encodedIp}<br>
                                • <strong>Device / Agent:</strong> {$userAgent}
                            </div>
                        </td>
                    </tr>

                    <!-- Email Footer -->
                    <tr>
                        <td style="background-color: #161b20; padding: 20px 30px; text-align: center; color: rgba(255,255,255,0.5); font-size: 12px;">
                            <p style="margin: 0 0 6px;">
                                Automated Lead Capture System &copy; {$COMPANY_NAME}. All Rights Reserved.
                            </p>
                            <p style="margin: 0; font-size: 11px;">
                                Destination: <span style="color: #4ade80;">{$RECIPIENT_EMAIL}</span>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
HTML;

// ----------------------------------------------------------------------------
// 7. DISPATCH EMAIL USING PHP MAIL
// ----------------------------------------------------------------------------
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: ' . $PRODUCT_NAME . ' <' . $SYSTEM_FROM_EMAIL . '>';

if (!empty($email)) {
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
} else {
    $headers[] = 'Reply-To: ' . $RECIPIENT_EMAIL;
}

$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'X-Priority: 1 (Highest)';
$headers[] = 'Importance: High';

$headersStr = implode("\r\n", $headers);

// Attempt mail dispatch
$mailSent = @mail($RECIPIENT_EMAIL, $emailSubject, $htmlMessage, $headersStr);

// ----------------------------------------------------------------------------
// 8. LOG LEAD TO LOCAL FILE (SAFETY BACKUP)
// ----------------------------------------------------------------------------
// Even if server mail agent has delays or DNS issues, zero leads will be lost!
$logEntry = [
    'timestamp'    => $submittedAt,
    'name'         => $name,
    'mobile'       => $cleanMobile,
    'email'        => $email,
    'requirement'  => $requirement,
    'ip'           => $clientIp,
    'source'       => $sourceUrl,
    'mail_sent'    => $mailSent
];

$logFile = __DIR__ . '/leads_log.json';
$existingLogs = [];

if (file_exists($logFile)) {
    $rawLog = @file_get_contents($logFile);
    if (!empty($rawLog)) {
        $decodedLog = json_decode($rawLog, true);
        if (is_array($decodedLog)) {
            $existingLogs = $decodedLog;
        }
    }
}

$existingLogs[] = $logEntry;
@file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// ----------------------------------------------------------------------------
// 9. RETURN JSON RESPONSE OR REDIRECT
// ----------------------------------------------------------------------------
// If submitted via standard HTML form POST without JavaScript:
if (stripos($contentType, 'application/json') === false && isset($_POST['name'])) {
    header('Location: ../thank-you.html');
    exit;
}

// JSON API Response
echo json_encode([
    'success'    => true,
    'message'    => 'Lead received and processed successfully.',
    'mail_sent'  => $mailSent,
    'lead'       => [
        'name'        => $name,
        'mobile'      => $cleanMobile,
        'requirement' => $requirement
    ]
]);
exit;
