# Google Sheets Cloud Database Setup for Yug Smart IVR CRM

This guide walks you through setting up your **Google Sheet** as the permanent, 100% free cloud database for **Yug Smart IVR**. Once configured, leads submitted on any browser or mobile phone will automatically be saved into your sheet and sync live to the CRM dashboard.

---

## ⏱️ Setup Time: 2 Minutes

### Step 1: Create a Google Sheet
1. Open [sheets.new](https://sheets.new) in your web browser.
2. Name your sheet at the top: `Yug Smart IVR Leads`.
*(Note: You do not need to add headers manually. The script will automatically create and style the headers for you!)*

---

### Step 2: Open Google Apps Script
1. In your Google Sheet, click **Extensions** in the top menu bar.
2. Click **Apps Script**.
3. A new tab will open with the Apps Script code editor.

---

### Step 3: Paste the Script Code
1. In the Apps Script code editor, delete any sample code (like `function myFunction() { ... }`).
2. Open [`google-apps-script/Code.gs`](google-apps-script/Code.gs) from this repository, copy all the code, and paste it into the editor.
3. Click the **Save** icon (diskette icon) or press `Ctrl + S` (`Cmd + S` on Mac).

---

### Step 4: Deploy as Web App
1. Click the blue **Deploy** button at the top right, then select **New deployment**.
2. Next to "Select type", click the **Gear icon (⚙️)** and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Yug Smart IVR Lead Engine`
   - **Execute as**: `Me (your email address)`
   - **Who has access**: `Anyone` *(IMPORTANT: This must be set to "Anyone" so website form submissions and CRM can send/fetch leads without logging in).*
4. Click **Deploy**.
5. Google may ask to authorize permissions:
   - Click **Authorize access**.
   - Select your Google account.
   - If you see "Google hasn't verified this app", click **Advanced** (bottom left), then click **Go to Untitled project (unsafe)**.
   - Click **Allow**.
6. Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 5: Connect URL in CRM Dashboard
1. Open your CRM Portal at `/crm` (or `https://yugsmartivr.com/crm`).
2. Log in (`admin` / `yug@2026`).
3. Click the **Google Sheet** button in the top action bar.
4. Paste your Web App URL into the input field.
5. Click **Test Connection** — it will verify with a green message: `✅ Connected!`.
6. Click **Save & Fetch Leads**!

---

## 🚀 That's it!
- **Zero Data Loss**: Every new inquiry submitted on the website or chatbot is instantly appended as a row in your Google Sheet.
- **Cross-Browser Sync**: Opening the CRM on any device or browser fetches from this sheet automatically.
- **Bi-Directional Updates**: When you change lead status ("Converted", "In Progress", etc.), edit notes, or delete leads in the CRM, it updates directly in your Google Sheet.
- **Mobile Access**: You can also open the Google Sheets app on your phone anytime to view all your leads on the go!
