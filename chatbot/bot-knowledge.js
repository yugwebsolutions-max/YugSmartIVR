/**
 * ============================================================================
 * YUG SMART IVR - AI CHATBOT KNOWLEDGE BASE & INTENT RECOGNITION ENGINE
 * ============================================================================
 * Comprehensive knowledge base extracted directly from the website.
 * Contains:
 *  - 1/2/4/8 SIM Product Models & Hardware Specs
 *  - 4-in-1 Operating Modes (IVR, Auto-Dialer, Bulk SMS, Missed Call)
 *  - Inbound & Outbound Calling, Multi-level IVR, Routing
 *  - Business Applications & Industry Recommendations
 *  - Warranty (1-Year Replacement), Shipping (5-8 days, ₹100-150), Return Policies
 *  - Direct Contact Info (+91 7387829461, yugwebsolutions@gmail.com)
 *  - Smart Intent Matcher with score ranking & suggestion chips
 * ============================================================================
 */

(function(window) {
    'use strict';

    const BOT_KNOWLEDGE = {
        meta: {
            brandName: 'Yug Smart IVR',
            company: 'Yug Web Solutions',
            phone: '+91 7387829461',
            email: 'yugwebsolutions@gmail.com',
            whatsapp: 'https://wa.me/917387829461?text=Hi%2C%20I%20am%20interested%20in%20Yug%20Smart%20IVR%20solutions.',
            warranty: '1-Year Full Replacement Warranty for any technical defect (from purchase & activation date)',
            shipping: '₹100 - ₹150 per device depending on pin code. Delivery in 5-8 business days across India.',
            refundPolicy: 'No return or refund after sale. However, full replacement is provided under the 1-year warranty for technical issues.'
        },

        // Default greeting message
        welcome: {
            text: `👋 **Welcome to Yug Smart IVR!** I am your virtual telecom assistant.

I can help you explore our **Multi-SIM IVR hardware**, compare models, learn about features, get pricing quotes, or book a live demo.

How can I assist your business today?`,
            chips: [
                { label: '💰 Get Price & Quote', action: 'show_lead_form' },
                { label: '📱 Compare 1, 2, 4 & 8 SIM', query: 'Compare all IVR models' },
                { label: '⚡ 4 Modes in 1 Device', query: 'What are the 4 modes?' },
                { label: '🛡️ Warranty & Shipping', query: 'Warranty and delivery details' },
                { label: '📞 Talk to a Specialist', query: 'Contact telecom specialist' }
            ]
        },

        // Topics and Q&A Knowledge Base
        topics: [
            // ----------------------------------------------------
            // 1. LEAD CAPTURE / PRICING / DEMO / QUOTE INTENTS
            // ----------------------------------------------------
            {
                id: 'pricing_quote',
                intent: 'lead_form',
                keywords: ['price', 'pricing', 'cost', 'rate', 'quote', 'quotation', 'demo', 'buy', 'purchase', 'order', 'book', 'enquire', 'enquiry', 'charges'],
                response: `✨ **Yug Smart IVR Pricing & Live Demo**

Our solutions are **100% on-premise hardware** with **zero monthly subscription rentals** and **unlimited talk time**! 

Prices vary based on whether you need a **1 SIM, 2 SIM, 4 SIM, or 8 SIM** configuration. Please share your details below to receive an instant price quotation and schedule a personalized demo:`,
                triggerForm: true,
                chips: [
                    { label: '📱 Compare Models First', query: 'Which model should I choose?' },
                    { label: '📞 Call Now: +91 7387829461', action: 'call_helpline' }
                ]
            },

            // ----------------------------------------------------
            // 2. PRODUCT OVERVIEW & WHAT IS YUG SMART IVR
            // ----------------------------------------------------
            {
                id: 'what_is_yug_ivr',
                keywords: ['what is yug', 'about yug', 'about yug smart ivr', 'what is yug smart ivr', 'product overview', 'introduction', 'tell me about yug', 'about the ivr system'],
                response: `🏢 **Yug Smart IVR** is a dedicated business telephony hardware solution engineered to automate and manage incoming and outgoing calls using your regular mobile SIM cards.

**Key Highlights:**
• **1 Device 4 Modes**: Inbound IVR, Auto-Dialer, Bulk SMS & Missed Call.
• **No Monthly Rental**: 100% on-premise hardware with lifetime ownership.
• **Works with Any SIM**: Compatible with Jio, Airtel, Vi, BSNL.
• **Scalable**: Available in **1 SIM, 2 SIM, 4 SIM, and 8 SIM** configurations.
• **Centralized PC Software**: Manage call logs, recordings, and greetings easily.`,
                chips: [
                    { label: '📱 View 1, 2, 4 & 8 SIM', query: 'Show all product models' },
                    { label: '⚡ 4 Operating Modes', query: 'Explain 4 modes' },
                    { label: '💰 Get Price Quote', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 3. THE 4 MODES (1 DEVICE 4 MODES)
            // ----------------------------------------------------
            {
                id: 'four_modes',
                keywords: ['4 mode', 'four mode', 'modes', 'operating mode', 'ivr mode', 'bulk calling mode', 'bulk sms mode', 'missed call mode'],
                response: `⚡ **1 Device, 4 Powerful Operating Modes:**

Every Yug Smart IVR hardware comes equipped with 4 flexible modes:

1. 🟢 **IVR Mode**: Automatically greets callers with professional multi-level voice menus and routes calls to specific agents or departments.
2. 📢 **Bulk Calling Mode (Auto Dialer)**: Automatically dials through contact lists and plays pre-recorded voice messages (up to 1,00,000 numbers saved at once).
3. 💬 **Bulk SMS Mode**: Send business notifications, alerts, and follow-ups directly through the active SIM channels.
4. 📞 **Missed Call Mode**: Captures missed customer calls instantly and triggers automated SMS responses so you never lose a lead.`,
                chips: [
                    { label: '💼 How does Auto Dialer work?', query: 'How does Auto Dialer work?' },
                    { label: '💰 Get Price for IVR', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 4. 1 SIM IVR MODEL
            // ----------------------------------------------------
            {
                id: 'model_1_sim',
                keywords: ['1 sim', 'one sim', 'single sim', '1 sim ivr', 'basic ivr', '1 sim wifi'],
                response: `📱 **1 SIM IVR + WiFi Version**
*Best suited for small offices, clinics, consultants, and basic single-line IVR requirements.*

**Specifications & Capabilities:**
• **Concurrent Calls**: 1 active line at a time.
• **Modes**: IVR Mode, Auto-Dialer, Bulk SMS, Missed Call.
• **Storage**: Saves up to 1,00,000 phone numbers for voice campaigns.
• **Connectivity**: WiFi + SIM connectivity with high-gain RF antenna.
• **Key Features**: Custom greetings, live call transfer, office open/close timing, internet call logs, unlimited talk time, zero monthly subscriptions.`,
                chips: [
                    { label: '💰 Get 1 SIM Price', action: 'show_lead_form', requirement: '1 SIM IVR' },
                    { label: '🔄 Compare with 2 SIM', query: 'Difference between 1 SIM and 2 SIM' },
                    { label: '360° Hardware View', action: 'open_gallery_1' }
                ]
            },

            // ----------------------------------------------------
            // 5. 2 SIM IVR MODEL
            // ----------------------------------------------------
            {
                id: 'model_2_sim',
                keywords: ['2 sim', 'two sim', 'dual sim', '2 sim ivr', 'standard ivr', '2 sim wifi'],
                response: `📱 **2 SIM IVR + WiFi Version**
*Designed for businesses requiring greater calling flexibility and dual-line handling.*

**Specifications & Capabilities:**
• **Concurrent Calls**: **2 simultaneous calls** at the same time (Two Lines).
• **Hardware**: Dual push-pull SIM slots with dual high-gain RF antennas and heavy-duty metal chassis.
• **Modes**: Inbound IVR, Auto-Dialer, Bulk SMS, Missed Call on both channels.
• **Storage**: Up to 1 Lakh numbers saved for outbound campaigns.
• **Features**: Custom IVR tones, live call forwarding, office hours scheduling, software call management, zero monthly fees.`,
                chips: [
                    { label: '💰 Get 2 SIM Price', action: 'show_lead_form', requirement: '2 SIM IVR' },
                    { label: '🔄 Compare 2 vs 4 SIM', query: 'Difference between 2 SIM and 4 SIM' }
                ]
            },

            // ----------------------------------------------------
            // 6. 4 SIM IVR MODEL
            // ----------------------------------------------------
            {
                id: 'model_4_sim',
                keywords: ['4 sim', 'four sim', 'quad sim', '4 sim ivr', '4 sim wifi', 'multi level ivr'],
                response: `📱 **4 SIM IVR + WiFi Version** *(Most Popular)*
*A suitable solution for growing businesses, sales teams, and real estate with higher calling volumes.*

**Specifications & Capabilities:**
• **Concurrent Calls**: **4 simultaneous calls** at the same time (4 Lines).
• **Multi-Level IVR Support**: Full support for hierarchical menu trees (e.g., *"Press 1 for Sales, Press 2 for Support, Press 9 to speak with an executive"*).
• **Hardware**: Quad-channel antenna array, rugged metal casing, dedicated status LEDs.
• **Features**: Smart department routing, auto-dialer for 1,00,000 numbers, internet call logs, PC manual dialer, zero monthly rental.`,
                chips: [
                    { label: '💰 Get 4 SIM Price', action: 'show_lead_form', requirement: '4 SIM IVR' },
                    { label: '🏢 Best for Real Estate & Sales', query: 'Is 4 SIM good for real estate?' }
                ]
            },

            // ----------------------------------------------------
            // 7. 8 SIM IVR MODEL
            // ----------------------------------------------------
            {
                id: 'model_8_sim',
                keywords: ['8 sim', 'eight sim', '8 sim ivr', 'enterprise ivr', 'call center ivr', 'bpo ivr', '8 sim wifi'],
                response: `📱 **8 SIM IVR + WiFi Version (Enterprise Grade)**
*Engineered for call centers, BPOs, customer support hubs, and large telemarketing teams.*

**Specifications & Capabilities:**
• **Concurrent Calls**: **8 simultaneous calls** at the same time (8 Lines).
• **Redundant Dual 12V Power**: Dual power sockets ensure zero downtime during uninterrupted enterprise calling.
• **Multi-Level IVR Support**: Advanced IVR routing with unlimited branch levels.
• **Chassis**: Industrial electro-galvanized telecom metal alloy with 8 antenna ports and independent SIM channels.
• **Capacity**: High-volume auto-dialing (1,00,000 contacts), live agent monitoring, full call detail records (CDR).`,
                chips: [
                    { label: '💰 Get 8 SIM Price', action: 'show_lead_form', requirement: '8 SIM IVR' },
                    { label: '📞 Speak with Telecom Engineer', action: 'call_helpline' }
                ]
            },

            // ----------------------------------------------------
            // 8. PRODUCT COMPARISON / WHICH ONE TO CHOOSE
            // ----------------------------------------------------
            {
                id: 'compare_models',
                keywords: ['compare', 'comparison', 'difference', 'which model', 'which one', 'table', 'choose'],
                response: `📊 **Model Comparison Matrix:**

| Feature | 1 SIM | 2 SIM | 4 SIM | 8 SIM |
| :--- | :--- | :--- | :--- | :--- |
| **Concurrent Calls** | 1 Line | 2 Lines | 4 Lines | 8 Lines |
| **Inbound IVR** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Outbound Auto-Dialer** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Bulk SMS & Missed Call** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Multi-Level IVR** | ❌ No | ❌ No | ✅ **Yes** | ✅ **Yes** |
| **Dual Power Redundancy**| ❌ No | ❌ No | ❌ No | ✅ **Yes** |
| **Recommended For** | Solo/Clinics | Small Offices | Sales/Real Estate | Call Centers/BPOs |

Need help deciding for your exact team size? Let us calculate the best configuration for you:`,
                chips: [
                    { label: '💡 Recommend for my Business', query: 'Recommend IVR for my business' },
                    { label: '💰 Get Price Quote', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 9. ZERO MONTHLY SUBSCRIPTION / 100% ON-PREMISE
            // ----------------------------------------------------
            {
                id: 'no_subscription',
                keywords: ['subscription', 'monthly fee', 'monthly rental', 'recurring', 'on premise', 'cloud vs hardware', 'cloud ivr', 'fees'],
                response: `💡 **Why Yug Smart IVR is More Cost-Effective than Cloud IVR:**

Traditional Cloud IVRs charge you **monthly per-agent rentals, per-minute call rates, and setup fees** every single month.

With **Yug Smart IVR**:
• **100% On-Premise**: You own the physical hardware device.
• **Zero Monthly Fees**: No monthly subscriptions, no renewals.
• **Unlimited Calling**: Use your existing mobile network unlimited recharge plans (Airtel, Jio, Vi).
• **Complete Privacy**: Your customer data, phone logs, and recordings remain inside your office premises.`,
                chips: [
                    { label: '💰 Request Hardware Quote', action: 'show_lead_form' },
                    { label: '⚡ How it works', query: 'How does it work?' }
                ]
            },

            // ----------------------------------------------------
            // 10. AUTO-DIALER & VOICE BROADCASTING
            // ----------------------------------------------------
            {
                id: 'auto_dialer',
                keywords: ['auto dialer', 'autodialer', 'outbound', 'broadcast', 'bulk call', 'voice broadcast', 'campaign', '1 lakh', '100000'],
                response: `📢 **Outbound Auto-Dialer & Voice Broadcasting:**

Yug Smart IVR includes built-in automated outbound calling functionality:

• **High Storage Capacity**: Save up to **1,00,000 (1 Lakh)** phone numbers directly into the campaign manager.
• **Pre-Recorded Voice Delivery**: Play customized voice messages, promotional updates, service reminders, or feedback prompts.
• **Live Transfer on Keypress**: Caller can press '1' to be immediately connected to a live agent.
• **Detailed Campaign Reports**: Track answered, missed, failed, and busy calls in real-time.
*(Note: Outbound calling must comply with local telecom and consent regulations).*`,
                chips: [
                    { label: '💰 Get Auto-Dialer Pricing', action: 'show_lead_form' },
                    { label: '📞 Talk to Sales Specialist', action: 'call_helpline' }
                ]
            },

            // ----------------------------------------------------
            // 11. HOW IT WORKS / SETUP PROCESS
            // ----------------------------------------------------
            {
                id: 'how_it_works',
                keywords: ['how it work', 'how does it work', 'steps', 'installation', 'setup', 'how to install', 'plug and play'],
                response: `🛠️ **How Yug Smart IVR Works in 4 Simple Steps:**

1. **Insert SIM Cards**: Insert standard SIMs (Jio, Airtel, Vi, BSNL) into the dedicated hardware slots.
2. **Configure Your IVR**: Upload your welcome greeting (MP3/WAV), set up keypad menus (Press 1, Press 2), and configure routing.
3. **Connect Your Office**: Plug the power adapter into 220V/12V and connect to your local WiFi or office network.
4. **Start Managing Calls**: Inbound calls are answered automatically, and outbound campaigns can be started from your PC software.

Our technical support team assists you with setup and configuration!`,
                chips: [
                    { label: '📞 Request Setup Guidance', action: 'call_helpline' },
                    { label: '💰 Get Quote & Demo', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 12. WARRANTY, GUARANTEE & REPLACEMENT
            // ----------------------------------------------------
            {
                id: 'warranty',
                keywords: ['warranty', 'guarantee', 'repair', 'broken', 'defect', 'problem', 'replace', 'replacement'],
                response: `🛡️ **Warranty & Guarantee Policy:**

• **1-Year Warranty**: Covers 1 full year from the date of device purchase and software license key activation.
• **Device Replacement**: If any technical defect or hardware problem occurs within the warranty period, **we replace the device with a brand new one**!
• **Dedicated Technical Support**: Phone, remote desktop, and WhatsApp support from our engineering team in Pune, India.`,
                chips: [
                    { label: '📦 Shipping & Delivery Info', query: 'What are shipping charges and delivery time?' },
                    { label: '💰 Get IVR Price', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 13. SHIPPING, DELIVERY & COURIER CHARGES
            // ----------------------------------------------------
            {
                id: 'shipping_delivery',
                keywords: ['shipping', 'delivery', 'courier', 'dispatch', 'time', 'how long', 'charges', 'pin code', 'cost of delivery'],
                response: `📦 **Shipping & Delivery Information:**

• **Delivery Time**: Usually takes **5 to 8 business days** across all serviceable pin codes in India (up to 10 days in remote areas).
• **Shipping Charges**: Approximately **₹100 to ₹150 per device**, calculated based on your destination pin code.
• **Packaging**: Ships in heavy-duty foam-cushioned packaging with high-gain antennas, power adapter, and setup manual.
• **International Shipping**: Currently, delivery is available **only within India** (No international delivery).`,
                chips: [
                    { label: '🛡️ Warranty Policy', query: 'What is warranty policy?' },
                    { label: '💰 Order Your Device', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 14. RETURN & REFUND POLICY
            // ----------------------------------------------------
            {
                id: 'return_refund',
                keywords: ['refund', 'return', 'cancel', 'money back', 'exchange', 'policy'],
                response: `📋 **Return & Refund Policy:**

• **No Return / No Refund**: As per company policy, devices once sold and activated cannot be returned or refunded.
• **100% Replacement Guarantee**: If there is any technical defect or performance issue, the device is **promptly replaced with a new unit** under the **1-Year Warranty**.
• **Pre-Purchase Demo**: We offer full live software and hardware demos before you buy so you can be completely confident in your purchase!`,
                chips: [
                    { label: '📝 Request Free Demo First', action: 'show_lead_form' },
                    { label: '📞 Call: +91 7387829461', action: 'call_helpline' }
                ]
            },

            // ----------------------------------------------------
            // 15. INDUSTRY-SPECIFIC USE CASES
            // ----------------------------------------------------
            {
                id: 'industries',
                keywords: ['real estate', 'hospital', 'clinic', 'healthcare', 'school', 'college', 'education', 'call center', 'bpo', 'telemarketing', 'collection', 'finance'],
                response: `🎯 **Yug Smart IVR for Your Industry:**

• **Real Estate**: Handle inbound property inquiries 24/7, route callers by project, and auto-dial prospective buyer lists. *(Recommended: 4 SIM IVR)*
• **Clinics & Healthcare**: Doctor appointment booking, department routing, and OPD schedule greetings. *(Recommended: 1 or 2 SIM IVR)*
• **Schools & Colleges**: Admission helpline, fee enquiry hotline, and parent announcements. *(Recommended: 2 or 4 SIM IVR)*
• **Call Centres & BPOs**: High-volume 8-line concurrent handling, agent transfers, and auto-dialing. *(Recommended: 8 SIM IVR)*
• **Service Centers & Support**: Ticket-based routing and after-hours emergency support.`,
                chips: [
                    { label: '💰 Get Best Model Recommendation', action: 'show_lead_form' },
                    { label: '📊 Compare All Models', query: 'Compare all models' }
                ]
            },

            // ----------------------------------------------------
            // 16. CONTACT, PHONE, EMAIL, OFFICE LOCATION
            // ----------------------------------------------------
            {
                id: 'contact_info',
                keywords: ['contact', 'phone', 'mobile', 'call', 'number', 'email', 'address', 'location', 'where are you', 'support', 'help'],
                response: `📞 **Yug Web Solutions - Contact Information:**

• **Sales & Technical Helpline**: **+91 7387829461**
• **Official Email**: **yugwebsolutions@gmail.com**
• **WhatsApp Support**: **+91 7387829461**
• **Support Hours**: Monday to Saturday, 9:30 AM – 7:00 PM IST
• **Location**: India

You can call us directly or drop your query below and our team will get in touch immediately!`,
                chips: [
                    { label: '📞 Call +91 7387829461', action: 'call_helpline' },
                    { label: '💬 WhatsApp Chat', action: 'open_whatsapp' },
                    { label: '📝 Submit Enquiry', action: 'show_lead_form' }
                ]
            },

            // ----------------------------------------------------
            // 17. DISTRIBUTOR / SYSTEM INTEGRATOR ENQUIRY
            // ----------------------------------------------------
            {
                id: 'distributor_enquiry',
                keywords: ['distributor', 'dealership', 'dealer', 'reseller', 'partner', 'wholesale', 'bulk order', 'integrator'],
                response: `🤝 **Distributor & System Integrator Partnership:**

We partner with telecom dealers, IT hardware distributors, PBX installers, and software integrators across India.

**Partner Benefits:**
• Wholesale partner pricing tiers
• Dedicated technical implementation support
• White-label integration possibilities
• 1-Year device replacement backing

Please fill out the distributor inquiry form below to discuss pricing and partnership:`,
                triggerForm: true,
                chips: [
                    { label: '📞 Call Partnerships Desk', action: 'call_helpline' }
                ]
            }
        ],

        // Fallback response when no exact intent is matched
        fallback: {
            text: `🤔 I'm not entirely sure about that specific phrase, but I can help you with anything related to **Yug Smart IVR hardware, pricing, models, or features**!

Here are some common topics you can ask me:`,
            chips: [
                { label: '💰 Get Price Quote', action: 'show_lead_form' },
                { label: '📱 Compare 1, 2, 4 & 8 SIM', query: 'Compare all models' },
                { label: '⚡ 4 Modes in 1 Device', query: 'Explain 4 modes' },
                { label: '🛡️ Warranty & Delivery', query: 'Warranty and shipping' },
                { label: '📞 Call Specialist: +91 7387829461', action: 'call_helpline' }
            ]
        }
    };

    /**
     * Smart Intent Matcher Engine:
     * Scores the user input against all knowledge topics.
     */
    function findBestMatch(userInput) {
        if (!userInput || typeof userInput !== 'string') {
            return BOT_KNOWLEDGE.fallback;
        }

        const cleanInput = userInput.toLowerCase().trim().replace(/[^\w\s]/g, ' ');
        const words = cleanInput.split(/\s+/).filter(w => w.length > 1);

        if (words.length === 0) {
            return BOT_KNOWLEDGE.fallback;
        }

        // Quick check for greetings
        const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'greetings', 'start'];
        if (words.length <= 2 && words.some(w => greetingWords.includes(w))) {
            return {
                response: `Hello! 👋 How can I help you with **Yug Smart IVR** today? Feel free to ask about pricing, 1/2/4/8 SIM models, features, or book a live demo!`,
                chips: BOT_KNOWLEDGE.welcome.chips
            };
        }

        const STOP_WORDS = new Set(['what', 'is', 'the', 'a', 'an', 'are', 'can', 'you', 'me', 'i', 'for', 'of', 'and', 'to', 'in', 'your', 'my', 'please', 'tell', 'how', 'do', 'any', 'does', 'it', 'with', 'want', 'need', 'like']);
        // Terms that are too generic across all topics to score on single tokens unless exact phrase matches
        const GENERIC_PRODUCT_WORDS = new Set(['ivr', 'system', 'device', 'solution', 'solutions']);
        const meaningfulWords = words.filter(w => !STOP_WORDS.has(w));

        let bestTopic = null;
        let highestScore = 0;

        for (const topic of BOT_KNOWLEDGE.topics) {
            let score = 0;

            for (const kw of topic.keywords) {
                const kwClean = kw.toLowerCase();

                // Exact phrase match in full input
                if (cleanInput.includes(kwClean)) {
                    score += kwClean.split(' ').length * 15;
                } else {
                    // Token match (only for non-stop and non-generic words)
                    const kwTokens = kwClean.split(' ').filter(t => !STOP_WORDS.has(t) && !GENERIC_PRODUCT_WORDS.has(t));
                    for (const token of kwTokens) {
                        if (meaningfulWords.includes(token)) {
                            score += 5;
                        }
                    }
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestTopic = topic;
            }
        }

        // Threshold to accept match
        if (highestScore >= 4 && bestTopic) {
            return bestTopic;
        }

        return BOT_KNOWLEDGE.fallback;
    }

    // Export to window
    window.YugBotKnowledge = {
        config: BOT_KNOWLEDGE.meta,
        welcome: BOT_KNOWLEDGE.welcome,
        fallback: BOT_KNOWLEDGE.fallback,
        topics: BOT_KNOWLEDGE.topics,
        findBestMatch: findBestMatch
    };

})(window);
