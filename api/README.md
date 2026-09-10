# Yug Smart IVR - Pure JavaScript Lead Capture & Email API

This directory provides a 100% JavaScript lead capture, email notification, and JSON tracking system for **Yug Web Solutions** (`yugwebsolutions@gmail.com`). **No PHP is required.**

---

## Key Files & Capabilities

1. **`lead-service.js` (Client-Side JS API)**
   - Included directly in `index.html` and `thank-you.html`.
   - Sends formatted lead emails directly from JavaScript to **`yugwebsolutions@gmail.com`** via FormSubmit AJAX API.
   - Automatically records and persists every lead in **JSON format** in `localStorage` under `'yug_leads_tracker'`.
   - Exposes global functions:
     - `window.downloadLeadsJson()`: Instantly downloads all recorded leads as a `.json` file (`leads_track_YYYY-MM-DD.json`).
     - `window.getTrackedLeads()`: Returns all stored leads as a JSON array.

2. **`leads.json` (Local JSON Track File)**
   - Tracks all leads in a structured JSON array on disk when running the Node.js server.

3. **`server.js` (Optional Local / Hosted Node.js Server)**
   - Written in vanilla Node.js (zero npm dependencies).
   - Start with: `node api/server.js`
   - Serves the website at `http://localhost:3000`.
   - Provides `POST /api/leads` and automatically appends incoming leads directly into `api/leads.json`.

---

## ⚡ Important: 1-Time Email Activation (FormSubmit.co)
When the very first lead is submitted to `yugwebsolutions@gmail.com`:
1. Check the inbox (or Spam/Promotions folder) of `yugwebsolutions@gmail.com`.
2. Look for an email from **FormSubmit.co** with the subject:
   > *"Action Required: Please activate your form on formsubmit.co"*
3. Click the **"Activate Form"** button inside that email.
4. From that moment on, all form submissions will immediately arrive in your inbox with the formatted table template, customer name, mobile, requirement, and direct WhatsApp / call links!

---

## How to Test Locally with Node.js
If you want to run the full local server and record leads directly to `api/leads.json`:
```bash
node api/server.js
```
Then open `http://localhost:3000` in your browser.
