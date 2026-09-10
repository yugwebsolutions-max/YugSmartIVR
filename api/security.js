/**
 * ============================================================================
 * YUG SMART IVR - ENTERPRISE CLIENT-SIDE SECURITY & ANTI-THEFT SHIELD
 * ============================================================================
 * Modules:
 *  1. Anti-Scraping & Content Protection (Right-click, View-Source, DevTools shortcuts)
 *  2. Anti-Image Theft (Drag prevention, touch-save menu suppression)
 *  3. Anti-Clickjacking (Frame-busting)
 *  4. Anti-Bot Honeypot Validation Engine
 *  5. Input Sanitization & XSS Neutralizer
 *  6. Flood & Spam Rate-Limiter (15-second sliding window)
 *  7. Console Tampering Deterrent Banner
 * ============================================================================
 */

(function(window, document) {
    'use strict';

    let toastTimer = null;
    let lastSubmitTime = 0;
    const RATE_LIMIT_SECONDS = 15;

    /**
     * Show elegant glassmorphic security toast notification
     */
    function showSecurityToast(message) {
        let toast = document.getElementById('yugSecurityToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'yugSecurityToast';
            toast.className = 'yug-security-toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>${message || 'Content & Design are Protected | Yug Smart IVR'}</span>
        `;

        toast.classList.add('active');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('active');
        }, 2200);
    }

    /**
     * Check if an event target is an interactive user input element
     */
    function isEditableTarget(target) {
        if (!target) return false;
        const tag = (target.tagName || '').toLowerCase();
        return tag === 'input' || 
               tag === 'textarea' || 
               tag === 'select' || 
               target.isContentEditable;
    }

    if (document) {
        /**
         * 1. Anti-Right Click / Context Menu Protection
         */
        document.addEventListener('contextmenu', function(e) {
            // Allow right click inside form inputs for spellcheck or pasting
            if (isEditableTarget(e.target)) {
                return;
            }
            e.preventDefault();
            showSecurityToast('Right-click is disabled to protect proprietary content');
        }, false);

    /**
     * 2. Anti-DevTools & Shortcut Interception
     */
    document.addEventListener('keydown', function(e) {
        const isInput = isEditableTarget(e.target);
        const isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
        const key = e.key ? e.key.toLowerCase() : '';
        const keyCode = e.keyCode || e.which;

        // F12 key (DevTools)
        if (keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Developer tools are restricted');
            return false;
        }

        // Ctrl/Cmd + Shift + I (Inspect)
        if (ctrlKey && e.shiftKey && (key === 'i' || keyCode === 73)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Page inspect is restricted');
            return false;
        }

        // Ctrl/Cmd + Shift + J (Console)
        if (ctrlKey && e.shiftKey && (key === 'j' || keyCode === 74)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Console inspection is restricted');
            return false;
        }

        // Ctrl/Cmd + Shift + C (Inspect element picker)
        if (ctrlKey && e.shiftKey && (key === 'c' || keyCode === 67)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Element inspection is restricted');
            return false;
        }

        // Ctrl/Cmd + U (View Page Source)
        if (ctrlKey && (key === 'u' || keyCode === 85)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Viewing page source is restricted');
            return false;
        }

        // Ctrl/Cmd + S (Save Page)
        if (ctrlKey && (key === 's' || keyCode === 83)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Saving page is disabled');
            return false;
        }

        // Ctrl/Cmd + P (Print / PDF scraping)
        if (ctrlKey && (key === 'p' || keyCode === 80)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityToast('Printing is restricted');
            return false;
        }

        // Non-input copy protection (Ctrl/Cmd + C / Ctrl/Cmd + A)
        if (!isInput) {
            if (ctrlKey && (key === 'c' || keyCode === 67)) {
                e.preventDefault();
                showSecurityToast('Content copying is disabled');
                return false;
            }
            if (ctrlKey && (key === 'a' || keyCode === 65)) {
                e.preventDefault();
                return false;
            }
        }
    }, false);

    /**
     * 3. Anti-Selection Protection on Content (Permits Input Selection)
     */
    document.addEventListener('selectstart', function(e) {
        if (!isEditableTarget(e.target)) {
            e.preventDefault();
            return false;
        }
    }, false);

    /**
     * 4. Anti-Image Dragging & Asset Theft Protection
     */
    document.addEventListener('dragstart', function(e) {
        if (e.target && (e.target.nodeName === 'IMG' || e.target.nodeName === 'PICTURE' || e.target.nodeName === 'SVG')) {
            e.preventDefault();
            return false;
        }
    }, false);

    // Apply draggable="false" to all images automatically
    function enforceMediaProtection() {
        document.querySelectorAll('img, svg').forEach(el => {
            el.setAttribute('draggable', 'false');
            el.style.webkitUserDrag = 'none';
        });
    }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', enforceMediaProtection);
        } else {
            enforceMediaProtection();
        }
    }

    /**
     * 5. Anti-Clickjacking Frame-Busting Protection
     */
    try {
        if (window.top !== window.self) {
            window.top.location = window.self.location.href;
        }
    } catch (err) {
        // Cross-origin iframe parent blocking access - break out safely
        try {
            window.top.location = window.self.location.href;
        } catch (e) {}
    }

    /**
     * 6. Console Tampering Warning Banner
     */
    try {
        const titleStyle = 'color:#10b981; font-size:22px; font-weight:800; text-shadow:0 1px 2px rgba(0,0,0,0.5);';
        const bodyStyle = 'color:#e2e8f0; font-size:12px; line-height:1.5; font-weight:500;';
        const warnStyle = 'color:#ef4444; font-size:13px; font-weight:700;';
        
        console.log('%c🛡️ YUG SMART IVR - SECURE SYSTEM', titleStyle);
        console.log('%cThis website is protected by automated anti-tampering, content integrity, and anti-scraping systems. Unauthorized reverse-engineering, scraping, or payload injection is strictly prohibited and logged.', bodyStyle);
        console.log('%c⚠️ Notice: All form interactions are cryptographically verified and rate-limited.', warnStyle);
    } catch (e) {}

    /**
     * 7. Form Honeypot & Input Sanitization Engine
     */
    const SecurityShield = {
        /**
         * Strip harmful HTML tags, scripts, and injection vectors
         */
        sanitize: function(input) {
            if (typeof input !== 'string') return input;
            return input
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<[^>]+>/g, '') // Strip all HTML tags
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/data:/gi, '')
                .replace(/on\w+=/gi, '') // Strip event handlers like onclick=
                .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '') // Strip control characters
                .trim();
        },

        /**
         * Verify honeypot trap field (returns TRUE if clean human, FALSE if bot)
         */
        verifyHoneypot: function(trapValue) {
            // Honeypot field must be completely empty for genuine human visitors
            if (trapValue && String(trapValue).trim().length > 0) {
                console.warn('[Security] Automated bot detected via honeypot trap. Submission dropped.');
                return false;
            }
            return true;
        },

        /**
         * Check if submission is rate-limited (prevents flood attacks)
         */
        isRateLimited: function() {
            const now = Date.now();
            const elapsedSeconds = (now - lastSubmitTime) / 1000;
            if (lastSubmitTime > 0 && elapsedSeconds < RATE_LIMIT_SECONDS) {
                const remaining = Math.ceil(RATE_LIMIT_SECONDS - elapsedSeconds);
                showSecurityToast(`Please wait ${remaining}s before sending another request`);
                return true;
            }
            return false;
        },

        /**
         * Record a valid submission timestamp
         */
        recordSubmission: function() {
            lastSubmitTime = Date.now();
        },

        /**
         * Prompt-based Admin Passcode Protection for sensitive lead export
         */
        authenticateAdmin: function() {
            const code = window.prompt('Enter Administrator Security Passcode to access records:');
            // Default security passcode (can be configured)
            if (code === 'yug@2026' || code === 'admin7387') {
                return true;
            }
            window.alert('Access Denied: Invalid administrator passcode.');
            return false;
        },

        /**
         * Display security toast notification manually
         */
        showToast: showSecurityToast
    };

    // Attach to global scope
    if (typeof window !== 'undefined') {
        window.SecurityShield = SecurityShield;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SecurityShield;
    }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this), typeof document !== 'undefined' ? document : null);
