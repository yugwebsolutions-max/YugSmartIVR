/**
 * ============================================================================
 * YUG SMART IVR - GOOGLE APPS SCRIPT CLOUD DATABASE & CRM SYNC ENGINE
 * ============================================================================
 * Author: Yug Web Solutions
 * Version: 2.0.0
 * 
 * Instructions:
 * 1. Open your Google Sheet (e.g. named "Yug Smart IVR Leads").
 * 2. Click Extensions > Apps Script.
 * 3. Delete any existing template code and paste this entire file.
 * 4. Click the blue "Deploy" button (top right) > "New deployment".
 * 5. Click the gear icon (Select type) > choose "Web app".
 * 6. Set Description: "Yug Smart IVR Lead Engine"
 * 7. Set "Execute as": "Me" (your Google account)
 * 8. Set "Who has access": "Anyone" (Crucial! Allows website & CRM to sync).
 * 9. Click "Deploy", approve permissions, and copy the Web App URL (ends with /exec).
 * 10. Paste the Web App URL into your CRM Dashboard > "Google Sheet" settings!
 * ============================================================================
 */

const SHEET_NAME = 'Leads';
const HEADERS = [
  'Lead ID',
  'Date & Time (IST)',
  'Customer Name',
  'Mobile Number',
  'Requirement',
  'Customer Email',
  'Status',
  'Sales Notes',
  'Source'
];

/**
 * Auto-run when the spreadsheet is opened
 */
function onOpen() {
  setupSheetNow();
}

/**
 * Click "Run" on this function in Apps Script to immediately initialize headers!
 */
function setupSheetNow() {
  getOrCreateSheet();
}

/**
 * Click "Run" on this function to immediately test inserting a sample lead!
 */
function testAddSampleLead() {
  const sheet = getOrCreateSheet();
  const testId = 'LEAD_TEST_' + new Date().getTime();
  const testTime = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a') + ' IST';
  sheet.appendRow([
    testId,
    testTime,
    'Sample Customer',
    '9876543210',
    '4 SIM IVR (Popular)',
    'customer@example.com',
    'New Lead',
    'Testing Google Sheet connection from Apps Script',
    'Setup Test'
  ]);
}

/**
 * Helper: Retrieve or create the "Leads" worksheet with formatted emerald headers
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    const sheets = ss.getSheets();
    // If only default "Sheet1" exists and it is empty, reuse and rename it to "Leads"
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }
  
  // Initialize headers if brand new sheet
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#009640'); // Yug Emerald
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);
    
    // Column widths
    sheet.setColumnWidth(1, 190); // Lead ID
    sheet.setColumnWidth(2, 190); // Date & Time
    sheet.setColumnWidth(3, 180); // Customer Name
    sheet.setColumnWidth(4, 150); // Mobile Number
    sheet.setColumnWidth(5, 160); // Requirement
    sheet.setColumnWidth(6, 200); // Email
    sheet.setColumnWidth(7, 140); // Status
    sheet.setColumnWidth(8, 260); // Sales Notes
    sheet.setColumnWidth(9, 180); // Source
  }
  return sheet;
}

/**
 * Handle HTTP GET Requests (Used by CRM to fetch all leads or test connection)
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'get';
    
    // Ping action for quick connection test
    if (action === 'ping') {
      return respondJson({
        success: true,
        message: 'Google Apps Script is connected successfully to Google Sheet!',
        timestamp: new Date().toISOString()
      }, e);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return respondJson({ success: true, count: 0, leads: [] }, e);
    }
    
    const numRows = lastRow - 1;
    const values = sheet.getRange(2, 1, numRows, HEADERS.length).getValues();
    const leads = [];
    
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const leadId = String(row[0] || '').trim();
      const timestamp = String(row[1] || '').trim();
      const name = String(row[2] || '').trim();
      const mobileRaw = String(row[3] || '').trim();
      const req = String(row[4] || 'IVR Solution').trim();
      const email = String(row[5] || '').trim();
      const status = String(row[6] || 'New Lead').trim();
      const notes = String(row[7] || '').trim();
      const source = String(row[8] || 'Website').trim();
      
      // Skip completely blank rows
      if (!leadId && !mobileRaw && !name) continue;
      
      const cleanMobile = mobileRaw.replace(/\D/g, '').slice(-10);
      const formattedMobile = cleanMobile ? ('+91 ' + cleanMobile) : (mobileRaw || 'Not Provided');
      
      leads.push({
        id: leadId || ('LEAD_' + (i + 1)),
        timestamp: timestamp || '',
        name: name || 'Customer',
        customerName: name || 'Customer',
        mobile: cleanMobile || mobileRaw,
        customerMobileNumber: formattedMobile,
        requirement: req || 'IVR Solution',
        email: email || 'Not Provided',
        status: status || 'New Lead',
        notes: notes || '',
        source: source || 'Website Form'
      });
    }
    
    // Return newest first so CRM renders the latest leads at the top
    leads.reverse();
    
    return respondJson({
      success: true,
      count: leads.length,
      leads: leads
    }, e);
    
  } catch (err) {
    return respondJson({ success: false, error: err.toString() }, e);
  }
}

/**
 * Handle HTTP POST Requests (Lead capture, Status updates, Notes, Deletions)
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    let data = {};
    
    // Parse incoming payload (supports JSON body, form parameters, or query string)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (pe) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    const action = data.action || (e.parameter ? e.parameter.action : 'add');
    
    // ----------------------------------------------------
    // Action 1: DELETE LEAD
    // ----------------------------------------------------
    if (action === 'delete') {
      const targetId = String(data.id || data.leadId || '').trim();
      const targetMobile = String(data.mobile || '').replace(/\D/g, '').slice(-10);
      
      const lastRow = sheet.getLastRow();
      let deletedCount = 0;
      
      if (lastRow > 1) {
        const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
        // Traverse backwards when deleting rows to maintain accurate index
        for (let i = values.length - 1; i >= 0; i--) {
          const rowId = String(values[i][0]).trim();
          const rowMobile = String(values[i][3]).replace(/\D/g, '').slice(-10);
          
          let isMatch = false;
          if (targetId && rowId && rowId === targetId) isMatch = true;
          if (targetMobile && rowMobile && rowMobile === targetMobile) isMatch = true;
          
          if (isMatch) {
            sheet.deleteRow(i + 2); // 1-indexed, +1 header offset
            deletedCount++;
          }
        }
      }
      
      return respondJson({ success: true, action: 'delete', deletedCount: deletedCount });
    }
    
    // ----------------------------------------------------
    // Action 2: UPDATE STATUS OR NOTES
    // ----------------------------------------------------
    if (action === 'update' || action === 'update_status') {
      const targetId = String(data.id || data.leadId || '').trim();
      const targetMobile = String(data.mobile || '').replace(/\D/g, '').slice(-10);
      const newStatus = data.status;
      const newNotes = data.notes;
      
      const lastRow = sheet.getLastRow();
      let isUpdated = false;
      
      if (lastRow > 1) {
        const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
        for (let i = 0; i < values.length; i++) {
          const rowId = String(values[i][0]).trim();
          const rowMobile = String(values[i][3]).replace(/\D/g, '').slice(-10);
          
          let isMatch = false;
          if (targetId && rowId && rowId === targetId) isMatch = true;
          if (!isMatch && targetMobile && rowMobile && rowMobile === targetMobile) isMatch = true;
          
          if (isMatch) {
            const rowIndex = i + 2;
            if (newStatus !== undefined && newStatus !== null) {
              sheet.getRange(rowIndex, 7).setValue(String(newStatus)); // Col 7: Status
            }
            if (newNotes !== undefined && newNotes !== null) {
              sheet.getRange(rowIndex, 8).setValue(String(newNotes)); // Col 8: Notes
            }
            isUpdated = true;
            break;
          }
        }
      }
      
      return respondJson({ success: true, action: 'update', updated: isUpdated });
    }
    
    // ----------------------------------------------------
    // Action 3: CAPTURE / ADD NEW LEAD (Default)
    // ----------------------------------------------------
    const leadId = data.id || ('LEAD_' + new Date().getTime());
    const timestamp = data.timestamp || Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a') + ' IST';
    const name = data.name || data.customerName || 'Customer';
    const mobile = String(data.mobile || data.customerMobileNumber || '').replace(/\D/g, '').slice(-10);
    const requirement = data.requirement || 'IVR Solution';
    const email = data.email || 'Not Provided';
    const status = data.status || 'New Lead';
    const notes = data.notes || '';
    const source = data.source || 'Website Form';
    
    // Deduplication check: Avoid inserting duplicates within recent 20 rows
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const checkCount = Math.min(lastRow - 1, 20);
      const startCheckRow = lastRow - checkCount + 1;
      const recentValues = sheet.getRange(startCheckRow, 1, checkCount, 4).getValues();
      
      for (let i = recentValues.length - 1; i >= 0; i--) {
        const existingId = String(recentValues[i][0]).trim();
        const existingMobile = String(recentValues[i][3]).replace(/\D/g, '').slice(-10);
        
        if (leadId && existingId && leadId === existingId) {
          return respondJson({ success: true, action: 'add', duplicateIgnored: true, id: leadId });
        }
        if (mobile && existingMobile && mobile === existingMobile && mobile.length >= 10) {
          // Double submission within seconds ignored
          return respondJson({ success: true, action: 'add', duplicateIgnored: true, id: existingId });
        }
      }
    }
    
    // Append the row to Google Sheet
    sheet.appendRow([
      leadId,
      timestamp,
      name,
      mobile,
      requirement,
      email,
      status,
      notes,
      source
    ]);
    
    return respondJson({ success: true, action: 'add', id: leadId });
    
  } catch (err) {
    return respondJson({ success: false, error: err.toString() });
  }
}

/**
 * Format response as standard JSON or JSONP
 */
function respondJson(obj, e) {
  const jsonStr = JSON.stringify(obj);
  
  // JSONP support when callback parameter is provided
  if (e && e.parameter && e.parameter.callback) {
    const cb = e.parameter.callback;
    return ContentService.createTextOutput(cb + '(' + jsonStr + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService.createTextOutput(jsonStr)
    .setMimeType(ContentService.MimeType.JSON);
}
