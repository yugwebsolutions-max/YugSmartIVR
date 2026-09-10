/**
 * ============================================================================
 * YUG WEB SOLUTIONS - JAVASCRIPT LEAD CAPTURE & EMAIL DISPATCH SERVICE
 * ============================================================================
 * Features:
 *  1. Pure JavaScript (No PHP required). Works on static hosting & localhost.
 *  2. Sends formatted HTML email lead notifications to yugwebsolutions@gmail.com.
 *  3. Persistently tracks all leads into JSON (.json) format in localStorage.
 *  4. Syncs with local Node.js server (api/server.js) to write api/leads.json if active.
 *  5. Provides window.downloadLeadsJson() to export leads as a .json file anytime.
 * ============================================================================
 */

(function(window) {
    'use strict';

    const LEAD_CONFIG = {
        recipientEmail: 'yugwebsolutions@gmail.com',
        companyName: 'Yug Web Solutions',
        productName: 'Yug Smart IVR',
        formSubmitEndpoint: 'https://formsubmit.co/ajax/yugwebsolutions@gmail.com',
        localNodeEndpoint: 'http://localhost:3000/api/leads',
        storageKey: 'yug_leads_tracker'
    };

    /**
     * Format current timestamp in Indian Standard Time (IST)
     */
    function getISTTimestamp() {
        const now = new Date();
        return now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) + ' IST';
    }

    /**
     * Save lead to persistent JSON tracking store
     */
    function saveLeadToJson(lead) {
        try {
            const raw = localStorage.getItem(LEAD_CONFIG.storageKey);
            const list = raw ? JSON.parse(raw) : [];
            const leadRecord = {
                id: 'LEAD_' + Date.now(),
                timestamp: lead.timestamp || getISTTimestamp(),
                customerName: lead.name,
                customerMobileNumber: '+91 ' + lead.mobile,
                name: lead.name,
                mobile: lead.mobile,
                email: lead.email || 'Not Provided',
                requirement: lead.requirement || 'IVR Solution',
                directCall: '+91 7387829461',
                source: lead.source || window.location.href,
                status: 'Dispatched to ' + LEAD_CONFIG.recipientEmail
            };
            list.unshift(leadRecord);
            localStorage.setItem(LEAD_CONFIG.storageKey, JSON.stringify(list, null, 2));
            return leadRecord;
        } catch (e) {
            console.warn('Local JSON track note:', e);
            return lead;
        }
    }

    /**
     * Retrieve all tracked leads in JSON format
     */
    function getTrackedLeads() {
        try {
            const raw = localStorage.getItem(LEAD_CONFIG.storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Download tracked leads as a .json file (Protected by Administrator Passcode)
     */
    function downloadLeadsJson() {
        // Enforce administrative authentication before exporting leads
        if (window.SecurityShield && typeof window.SecurityShield.authenticateAdmin === 'function') {
            const isAuthorized = window.SecurityShield.authenticateAdmin();
            if (!isAuthorized) return;
        }

        const leads = getTrackedLeads();
        const jsonStr = JSON.stringify(leads, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_track_' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Submit lead via JavaScript fetch:
     * - Sends email to yugwebsolutions@gmail.com
     * - Saves to local JSON tracker
     * - Attempts Node.js sync if running
     */
    async function submitLead(leadData) {
        // 0. Security Honeypot Verification: silently drop bot submissions
        if (leadData && leadData._yug_hp_trap && String(leadData._yug_hp_trap).trim().length > 0) {
            console.warn('[Security] Bot trapped in lead-service. Submission dropped.');
            return Promise.resolve({ success: true, bot: true });
        }

        // 1. Sanitize all input fields
        const cleanMobile = String(leadData.mobile || '').replace(/\D/g, '');
        const cleanName = (window.SecurityShield ? window.SecurityShield.sanitize(leadData.name) : leadData.name) || 'Customer';
        const cleanEmail = (window.SecurityShield ? window.SecurityShield.sanitize(leadData.email) : leadData.email) || '';
        const cleanReq = (window.SecurityShield ? window.SecurityShield.sanitize(leadData.requirement) : leadData.requirement) || '4 SIM IVR';
        const cleanSource = (window.SecurityShield ? window.SecurityShield.sanitize(leadData.source) : leadData.source) || window.location.href;
        const timestamp = getISTTimestamp();

        // 2. Save to JSON Tracker
        const savedRecord = saveLeadToJson({
            name: cleanName,
            mobile: cleanMobile,
            email: cleanEmail,
            requirement: cleanReq,
            source: cleanSource,
            timestamp: timestamp
        });

        // 3. Build FormData payload for ultra-fast direct delivery (1-2s response)
        const formData = new FormData();
        formData.append('_subject', `🔔 New IVR Lead: ${cleanName} - ${cleanReq} (+91 ${cleanMobile})`);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('Customer Name', cleanName);
        formData.append('Customer Mobile Number', '+91 ' + cleanMobile);
        formData.append('Requirement', leadData.requirement);
        formData.append('Customer Email', (leadData.email && leadData.email.trim()) ? leadData.email.trim() : 'Not Provided');
        formData.append('Direct Call', '+91 7387829461');
        formData.append('Submission Time', timestamp);
        formData.append('Brand & Product', `${LEAD_CONFIG.productName} by ${LEAD_CONFIG.companyName}`);
        formData.append('Source', leadData.source || window.location.href);

        // 3. Fast Dispatch to FormSubmit with safety timeout
        const dispatchPromise = fetch('https://formsubmit.co/yugwebsolutions@gmail.com', {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Ensures browser sends without CORS delays or blocking
        }).catch(err => {
            console.warn('Primary dispatch notice:', err);
        });

        // 4. Also attempt JSON dispatch in parallel as backup
        try {
            fetch('https://formsubmit.co/ajax/yugwebsolutions@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: `🔔 New IVR Lead: ${leadData.name} - ${leadData.requirement} (+91 ${cleanMobile})`,
                    _template: 'table',
                    _captcha: 'false',
                    'Customer Name': leadData.name,
                    'Customer Mobile Number': '+91 ' + cleanMobile,
                    'Requirement': leadData.requirement,
                    'Customer Email': (leadData.email && leadData.email.trim()) ? leadData.email.trim() : 'Not Provided',
                    'Direct Call': '+91 7387829461',
                    'Submission Time': timestamp,
                    'Brand & Product': `${LEAD_CONFIG.productName} by ${LEAD_CONFIG.companyName}`,
                    'Source': leadData.source || window.location.href
                })
            }).catch(() => {});
        } catch (e) {}

        // 5. Optional: Sync to local Node.js server (api/server.js) if running locally
        try {
            fetch(LEAD_CONFIG.localNodeEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedRecord)
            }).catch(() => {});
        } catch (e) {}

        // 6. Max 2.5s wait promise so caller UI is never frozen
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
        return Promise.race([dispatchPromise, timeoutPromise]);
    }

    // Export service to global window scope
    window.LeadService = {
        config: LEAD_CONFIG,
        submitLead: submitLead,
        getTrackedLeads: getTrackedLeads,
        downloadLeadsJson: downloadLeadsJson,
        saveLeadToJson: saveLeadToJson
    };

    // Global helper shortcuts for easy console access
    window.downloadLeadsJson = downloadLeadsJson;
    window.getTrackedLeads = getTrackedLeads;

})(window);
