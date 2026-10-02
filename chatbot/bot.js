/**
 * ============================================================================
 * YUG SMART IVR - CHATBOT CONTROLLER & LEAD CAPTURE ENGINE
 * ============================================================================
 * Features:
 *  1. Dynamic DOM injection (Zero hardcoded markup needed in index.html).
 *  2. Comprehensive website intelligence via YugBotKnowledge.
 *  3. In-Chat Lead Capture Form with validation (+91, 10 digits).
 *  4. Direct integration with LeadService.submitLead() (JSON tracker + Email).
 *  5. Web Audio API subtle chime sound (no external MP3/audio files needed).
 *  6. Mobile responsive with smooth animations.
 * ============================================================================
 */

(function(window, document) {
    'use strict';

    // State Variables
    let isOpen = false;
    let soundEnabled = true;
    let hasInteracted = false;
    let isTyping = false;
    let teaserDismissed = false;

    // DOM Elements Cache
    let launcherWrap, launcherBtn, chatWindow, chatBody, inputField, sendBtn, teaserBubble;

    /**
     * Synthesize subtle audio chime using Web Audio API
     */
    function playChime() {
        if (!soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
            
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.26);
        } catch (e) {
            // AudioContext not allowed before user interaction
        }
    }

    /**
     * Convert markdown formatting to safe HTML
     */
    function formatMarkdown(text) {
        if (!text) return '';
        
        let html = text
            // Escape special chars
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Bullet points
            .replace(/^• (.*$)/gim, '<div style="display:flex; gap:6px; margin:3px 0;"><span>•</span><span>$1</span></div>')
            // Phone numbers clickable
            .replace(/(\+91\s?\d{10})/g, '<a href="tel:$1" style="color:#009640; font-weight:700; text-decoration:none;">$1</a>')
            // Email clickable
            .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color:#0284c7; text-decoration:underline;">$1</a>');

        // Handle simple markdown tables if present
        if (html.includes('|')) {
            const lines = html.split('\n');
            let inTable = false;
            let tableHtml = '<table>';
            let newLines = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('|') && line.endsWith('|')) {
                    if (!inTable) {
                        inTable = true;
                        tableHtml = '<table>';
                    }
                    if (line.includes('---')) {
                        continue; // skip separator row
                    }
                    const cells = line.split('|').slice(1, -1).map(c => c.trim());
                    const isHeader = !tableHtml.includes('<tbody>') && !tableHtml.includes('<tr>');
                    if (isHeader) {
                        tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
                    } else {
                        tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
                    }
                } else {
                    if (inTable) {
                        inTable = false;
                        tableHtml += '</tbody></table>';
                        newLines.push(tableHtml);
                    }
                    newLines.push(line);
                }
            }
            if (inTable) {
                tableHtml += '</tbody></table>';
                newLines.push(tableHtml);
            }
            html = newLines.join('\n');
        }

        // Convert double linebreaks to paragraphs
        const paragraphs = html.split(/\n\s*\n/).filter(p => p.trim());
        return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

    /**
     * Inject Chatbot UI into DOM
     */
    function initUI() {
        // 1. Floating Launcher Wrap
        launcherWrap = document.createElement('div');
        launcherWrap.className = 'yug-bot-launcher-wrap';

        // Teaser bubble
        teaserBubble = document.createElement('div');
        teaserBubble.className = 'yug-bot-teaser';
        teaserBubble.innerHTML = `
            <span>👋 Need help with IVR? Ask me anything!</span>
            <button class="yug-bot-teaser-close" aria-label="Close message">&times;</button>
        `;
        teaserBubble.addEventListener('click', (e) => {
            if (e.target.classList.contains('yug-bot-teaser-close')) {
                e.stopPropagation();
                dismissTeaser();
            } else {
                dismissTeaser();
                toggleChat(true);
            }
        });

        // Main circle button
        launcherBtn = document.createElement('button');
        launcherBtn.className = 'yug-bot-launcher-btn';
        launcherBtn.setAttribute('aria-label', 'Open Yug Smart IVR AI Assistant');
        launcherBtn.innerHTML = `
            <span class="yug-bot-pulse-dot"></span>
            <svg class="yug-bot-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg class="yug-bot-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        launcherBtn.addEventListener('click', () => toggleChat());

        launcherWrap.appendChild(teaserBubble);
        launcherWrap.appendChild(launcherBtn);

        // 2. Chat Window
        chatWindow = document.createElement('div');
        chatWindow.className = 'yug-bot-window';
        chatWindow.innerHTML = `
            <!-- Header -->
            <div class="yug-bot-header">
                <div class="yug-bot-brand">
                    <div class="yug-bot-avatar">
                        <img src="assets/yug-logo.webp" alt="Yug Smart IVR">
                    </div>
                    <div class="yug-bot-info">
                        <h3>YUG <span>SMART IVR</span></h3>
                        <p class="yug-bot-status">AI Assistant • Online</p>
                    </div>
                </div>
                <div class="yug-bot-controls">
                    <button class="yug-bot-header-btn" id="yugBotSoundToggle" title="Toggle Sound">
                        <svg class="sound-on-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                    <button class="yug-bot-header-btn" id="yugBotMinimize" title="Close / Minimize Chat" aria-label="Close Chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Body -->
            <div class="yug-bot-body" id="yugBotBody">
                <div class="yug-bot-time-divider">Today • Telecom Assistant</div>
            </div>

            <!-- Footer Input -->
            <div class="yug-bot-footer">
                <input type="text" class="yug-bot-input-field" id="yugBotInput" placeholder="Ask about IVR models, pricing, features..." aria-label="Type your message">
                <button class="yug-bot-send-btn" id="yugBotSend" aria-label="Send message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(launcherWrap);
        document.body.appendChild(chatWindow);

        // Cache elements
        chatBody = document.getElementById('yugBotBody');
        inputField = document.getElementById('yugBotInput');
        sendBtn = document.getElementById('yugBotSend');

        // Event listeners
        sendBtn.addEventListener('click', handleUserSend);
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserSend();
            }
        });

        document.getElementById('yugBotMinimize').addEventListener('click', () => toggleChat(false));
        
        const soundBtn = document.getElementById('yugBotSoundToggle');
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.style.opacity = soundEnabled ? '1' : '0.4';
            soundBtn.title = soundEnabled ? 'Sound On' : 'Sound Off';
        });

        // Auto-Open Behavior:
        // - Mobile devices (<= 768px or mobile browsers): Auto-open is DISABLED completely.
        // - Desktop devices (> 768px): Auto-open after 30 seconds if not already opened/interacted with.
        let autoOpenFired = false;
        const triggerDesktopAutoOpen = () => {
            const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
            if (!isMobile && !autoOpenFired && !isOpen && !hasInteracted) {
                autoOpenFired = true;
                toggleChat(true);
            }
        };

        // 30 seconds timer for desktop only
        setTimeout(triggerDesktopAutoOpen, 30000);

        // Render Initial Welcome Message
        renderWelcomeMessage();
    }

    /**
     * Dismiss teaser tooltip
     */
    function dismissTeaser() {
        teaserDismissed = true;
        if (teaserBubble) {
            teaserBubble.style.display = 'none';
        }
    }

    /**
     * Toggle Chat Open/Close
     */
    function toggleChat(forceState) {
        isOpen = (typeof forceState === 'boolean') ? forceState : !isOpen;
        hasInteracted = true;
        dismissTeaser();

        if (isOpen) {
            chatWindow.classList.add('is-open');
            launcherBtn.classList.add('is-active');
            if (window.innerWidth <= 768) {
                document.body.classList.add('yug-bot-mobile-open');
            } else if (inputField) {
                inputField.focus({ preventScroll: true });
            }
            scrollToBottom();
        } else {
            chatWindow.classList.remove('is-open');
            launcherBtn.classList.remove('is-active');
            document.body.classList.remove('yug-bot-mobile-open');
        }
    }

    /**
     * Scroll chat stream to bottom smoothly
     */
    function scrollToBottom() {
        setTimeout(() => {
            if (chatBody) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }, 50);
    }

    /**
     * Render Initial Welcome Message with chips
     */
    function renderWelcomeMessage() {
        const knowledge = window.YugBotKnowledge;
        if (!knowledge) return;

        addBotMessage(knowledge.welcome.text, knowledge.welcome.chips);
    }

    /**
     * Add User Message Bubble
     */
    function addUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'yug-bot-msg-row user-row';
        row.innerHTML = `
            <div class="yug-bot-msg-bubble">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
        chatBody.appendChild(row);
        scrollToBottom();
    }

    /**
     * Add Bot Message Bubble with optional quick chips and lead form
     */
    function addBotMessage(text, chips, triggerForm, formRequirement) {
        // Show typing indicator first
        showTypingIndicator();

        // Natural delay between 400ms - 750ms
        const delay = Math.min(Math.max(text.length * 3.5, 400), 750);

        setTimeout(() => {
            hideTypingIndicator();

            const row = document.createElement('div');
            row.className = 'yug-bot-msg-row bot-row';

            const bubble = document.createElement('div');
            bubble.className = 'yug-bot-msg-bubble';
            bubble.innerHTML = formatMarkdown(text);

            // Append Quick Suggestion Chips
            if (chips && chips.length > 0) {
                const chipsWrap = document.createElement('div');
                chipsWrap.className = 'yug-bot-chips-wrap';

                chips.forEach(chip => {
                    const chipBtn = document.createElement('button');
                    chipBtn.type = 'button';
                    chipBtn.className = 'yug-bot-chip-btn';
                    chipBtn.textContent = chip.label;
                    chipBtn.addEventListener('click', () => handleChipClick(chip));
                    chipsWrap.appendChild(chipBtn);
                });

                bubble.appendChild(chipsWrap);
            }

            // Append In-Chat Lead Form if triggered
            if (triggerForm) {
                const formCard = createInChatLeadForm(formRequirement);
                bubble.appendChild(formCard);
            }

            row.innerHTML = `
                <div class="yug-bot-msg-avatar">
                    <img src="assets/yug-logo.webp" alt="Yug IVR Bot">
                </div>
            `;
            row.appendChild(bubble);

            chatBody.appendChild(row);
            playChime();
            scrollToBottom();
        }, delay);
    }

    /**
     * Create interactive in-chat lead form
     */
    function createInChatLeadForm(defaultRequirement) {
        const card = document.createElement('div');
        card.className = 'yug-bot-form-card';
        card.innerHTML = `
            <div class="yug-bot-form-title">
                <span>📝</span> Request Instant Price & Demo
            </div>
            <form class="yug-bot-embedded-form" novalidate>
                <!-- Anti-Bot Honeypot Trap (Hidden from real users) -->
                <div style="display:none !important; visibility:hidden !important; position:absolute; left:-9999px;" aria-hidden="true">
                    <input type="text" class="bot-lead-hp" tabindex="-1" autocomplete="off">
                </div>

                <div class="yug-bot-form-group">
                    <label>Full Name*</label>
                    <input type="text" class="yug-bot-input bot-lead-name" placeholder="Enter your name" required>
                    <span class="yug-bot-error-text bot-err-name">Please enter your name</span>
                </div>

                <div class="yug-bot-form-group">
                    <label>Mobile Number*</label>
                    <div class="yug-bot-input-wrap">
                        <span class="yug-bot-prefix">+91</span>
                        <input type="tel" class="yug-bot-input bot-lead-mobile" placeholder="10-digit number" maxlength="10" required>
                    </div>
                    <span class="yug-bot-error-text bot-err-mobile">Please enter a valid 10-digit mobile number</span>
                </div>

                <div class="yug-bot-form-group">
                    <label>Select Requirement*</label>
                    <select class="yug-bot-select bot-lead-req">
                        <option value="1 SIM IVR">1 SIM IVR + WiFi</option>
                        <option value="2 SIM IVR">2 SIM IVR + WiFi</option>
                        <option value="4 SIM IVR" selected>4 SIM IVR + WiFi</option>
                        <option value="8 SIM IVR">8 SIM IVR + WiFi</option>
                        <option value="IVR Solution">General IVR Solution</option>
                        <option value="Distributor Enquiry">Distributor / Reseller Enquiry</option>
                    </select>
                </div>

                <button type="submit" class="yug-bot-form-submit">
                    <span>Submit Enquiry</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </form>
        `;

        // Pre-select requirement if specified
        if (defaultRequirement) {
            const selectEl = card.querySelector('.bot-lead-req');
            if (selectEl) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].value === defaultRequirement) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
        }

        const form = card.querySelector('form');
        const nameInput = card.querySelector('.bot-lead-name');
        const mobileInput = card.querySelector('.bot-lead-mobile');
        const reqSelect = card.querySelector('.bot-lead-req');
        const submitBtn = card.querySelector('.yug-bot-form-submit');
        const nameErr = card.querySelector('.bot-err-name');
        const mobileErr = card.querySelector('.bot-err-mobile');
        const hpInput = card.querySelector('.bot-lead-hp');

        // Phone input sanitization
        mobileInput.addEventListener('input', () => {
            mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
            if (mobileInput.value.length === 10 && /^[6-9]/.test(mobileInput.value)) {
                mobileErr.style.display = 'none';
            }
        });

        // Form submission handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Security: Anti-Bot Honeypot Trap Check
            if (window.SecurityShield && hpInput && !window.SecurityShield.verifyHoneypot(hpInput.value)) {
                // Silently fake success for bot with zero email dispatch
                card.innerHTML = `<div class="yug-bot-success-card"><h4>Thank You!</h4><p>Your enquiry has been received.</p></div>`;
                return;
            }

            // Security: Spam & Flood Rate-Limiter
            if (window.SecurityShield && window.SecurityShield.isRateLimited()) {
                return;
            }

            let isValid = true;
            const nameVal = nameInput.value.trim();
            const mobileVal = mobileInput.value.trim();

            if (!nameVal) {
                nameErr.style.display = 'block';
                isValid = false;
            } else {
                nameErr.style.display = 'none';
            }

            if (!mobileVal || mobileVal.length !== 10 || !/^[6-9]\d{9}$/.test(mobileVal)) {
                mobileErr.style.display = 'block';
                isValid = false;
            } else {
                mobileErr.style.display = 'none';
            }

            if (!isValid) return;

            if (window.SecurityShield) {
                window.SecurityShield.recordSubmission();
            }

            // Fast, snappy submission flow (600ms visual feedback)
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Submitting...</span>`;

            // Security: Input Sanitization
            const cleanName = window.SecurityShield ? window.SecurityShield.sanitize(nameVal) : nameVal;
            const cleanReq = window.SecurityShield ? window.SecurityShield.sanitize(reqSelect.value) : reqSelect.value;

            const leadData = {
                name: cleanName,
                mobile: mobileVal,
                requirement: cleanReq,
                source: window.location.href + ' [via AI Chatbot]'
            };

            // Fire lead dispatch in background
            if (window.LeadService && typeof window.LeadService.submitLead === 'function') {
                window.LeadService.submitLead(leadData).catch(err => {
                    console.warn('LeadService submit note:', err);
                });
            }

            // Transition smoothly to success card after 600ms
            setTimeout(() => {
                card.innerHTML = `
                    <div class="yug-bot-success-card">
                        <h4>🎉 Thank You, ${escapeHtml(cleanName)}!</h4>
                        <p>Your enquiry for <strong>${escapeHtml(cleanReq)}</strong> has been received! Our telecom specialist will connect with you on <strong>+91 ${mobileVal}</strong> shortly.</p>
                        <div class="yug-bot-success-actions">
                            <a href="tel:+917387829461" class="yug-bot-action-btn yug-bot-call-btn">
                                📞 Call Specialist
                            </a>
                            <a href="https://wa.me/917387829461?text=Hi%2C%20I%20just%20submitted%20an%20enquiry%20for%20${encodeURIComponent(cleanReq)}." target="_blank" rel="noopener" class="yug-bot-action-btn yug-bot-wa-btn">
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>
                `;
                scrollToBottom();
            }, 600);
            scrollToBottom();
        });

        return card;
    }

    /**
     * Show animated typing dots
     */
    function showTypingIndicator() {
        if (isTyping) return;
        isTyping = true;

        const row = document.createElement('div');
        row.className = 'yug-bot-msg-row bot-row yug-typing-row';
        row.innerHTML = `
            <div class="yug-bot-msg-avatar">
                <img src="assets/yug-logo.webp" alt="Typing">
            </div>
            <div class="yug-bot-typing">
                <span class="yug-bot-typing-dot"></span>
                <span class="yug-bot-typing-dot"></span>
                <span class="yug-bot-typing-dot"></span>
            </div>
        `;
        chatBody.appendChild(row);
        scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    function hideTypingIndicator() {
        isTyping = false;
        if (chatBody && typeof chatBody.querySelector === 'function') {
            const typingRow = chatBody.querySelector('.yug-typing-row');
            if (typingRow && typeof typingRow.remove === 'function') {
                typingRow.remove();
            }
        }
    }

    /**
     * Handle user text submission
     */
    function handleUserSend() {
        const rawText = inputField.value.trim();
        if (!rawText) return;

        const text = window.SecurityShield ? window.SecurityShield.sanitize(rawText) : rawText;
        if (!text) return;

        inputField.value = '';
        addUserMessage(text);

        // Query knowledge base
        const knowledge = window.YugBotKnowledge;
        if (!knowledge) return;

        const matched = knowledge.findBestMatch(text);
        const replyText = matched.response || matched.text || knowledge.fallback.text;
        const chips = matched.chips || knowledge.fallback.chips;
        const triggerForm = matched.triggerForm || false;

        addBotMessage(replyText, chips, triggerForm);
    }

    /**
     * Handle quick suggestion chip clicks
     */
    function handleChipClick(chip) {
        if (chip.action === 'show_lead_form') {
            addUserMessage(chip.label);
            addBotMessage(
                `Sure! Please provide your details below and our team will prepare a custom quotation and arrange a live product demo for you:`,
                [
                    { label: '📞 Call Directly: +91 7387829461', action: 'call_helpline' }
                ],
                true,
                chip.requirement || '4 SIM IVR'
            );
        } else if (chip.action === 'call_helpline') {
            window.location.href = 'tel:+917387829461';
        } else if (chip.action === 'open_whatsapp') {
            window.open('https://wa.me/917387829461?text=Hi%2C%20I%20am%20interested%20in%20Yug%20Smart%20IVR%20solutions.', '_blank', 'noopener');
        } else if (chip.action === 'open_gallery_1') {
            if (typeof window.openInteractive360 === 'function') {
                window.openInteractive360('1-sim', 0);
            }
        } else if (chip.query) {
            addUserMessage(chip.query);
            const knowledge = window.YugBotKnowledge;
            const matched = knowledge.findBestMatch(chip.query);
            addBotMessage(matched.response || matched.text, matched.chips, matched.triggerForm);
        }
    }

    /**
     * Helper to escape HTML tags
     */
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Expose public API
    window.YugChatbot = {
        open: () => toggleChat(true),
        close: () => toggleChat(false),
        toggle: () => toggleChat()
    };

    // Auto-init once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})(window, document);
