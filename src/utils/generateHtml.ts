import { IPassFormData, CalculationResult } from '../types';
import { formatINR } from './calculations';

/**
 * Escapes HTML characters to prevent XSS or broken formatting in standalone HTML
 */
function escapeHtml(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a 100% Standalone, Offline-Ready HTML string for Form NR-IP-01
 * Uses pure inline styles and self-contained system fonts.
 */
export function generateStandaloneHtml(data: IPassFormData, calc: CalculationResult): string {
  const { totalService, qualService, hasService, pension, commutation, commValue, reducedPension, dcrg, leaveSalary, gisFormatted } = calc;

  const totalServiceText = hasService && totalService
    ? `${totalService.y} Yrs ${totalService.m} Mos ${totalService.d} Days`
    : '—';

  const qualServiceText = hasService && qualService
    ? `${qualService.y} Yrs ${qualService.m} Mos ${qualService.d} Days`
    : '—';

  const nqText = `${data.nqY || 0} Yrs ${data.nqM || 0} Mos ${data.nqD || 0} Days`;
  const cleanEmpName = data.empName || 'Employee';

  const familyRows = data.family.map((fam, idx) => `
    <tr>
      <td style="text-align:center; font-family: monospace; color:#64748b; font-size:8.5px;">${idx + 1}</td>
      <td style="font-family: monospace; font-size:8.5px;">${escapeHtml(fam.name) || '&nbsp;'}</td>
      <td style="font-family: monospace; font-size:8.5px;">${escapeHtml(fam.relation) || '&nbsp;'}</td>
      <td style="font-family: monospace; font-size:8.5px;">${escapeHtml(fam.dob) || '&nbsp;'}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NR_IP_01_Settlement_Sheet_${escapeHtml(cleanEmpName)}</title>
  <style>
    /* Reset & Base System Fonts - 100% Standalone & Offline Ready */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.3;
      padding: 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Floating No-Print Toolbar */
    .no-print-bar {
      max-width: 900px;
      margin: 0 auto 12px auto;
      background: #122238;
      color: #e2e8f0;
      padding: 8px 16px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 12px;
    }

    .print-btn {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }

    .print-btn:hover {
      background: #059669;
    }

    /* Main Sheet Container */
    .sheet-wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #94a3b8;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }

    /* Top Bar */
    .sheet-topbar {
      background: #122238;
      color: #f1f5f9;
      font-family: Consolas, "Courier New", Courier, monospace;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 12px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }

    /* Header */
    .sheet-header {
      padding: 8px 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #1f3350;
      background: #fafafa;
    }

    .sheet-title {
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 16px;
      font-weight: bold;
      color: #122238;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .sheet-subtitle {
      font-size: 10px;
      color: #64748b;
      font-style: italic;
      margin-top: 2px;
    }

    .sheet-month {
      font-size: 10px;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sheet-month-val {
      font-family: Consolas, "Courier New", Courier, monospace;
      font-size: 10.5px;
      font-weight: 600;
      color: #122238;
      padding: 2px 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 2px;
    }

    /* 2-Column Grid */
    .sheet-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid #cbd5e1;
    }

    .grid-col-left {
      border-right: 1px solid #cbd5e1;
    }

    .grid-col-right {
      /* right side */
    }

    /* Section Header */
    .section-head {
      background: #1f3350;
      color: #ffffff;
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 2-column info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid #cbd5e1;
    }

    .info-cell {
      padding: 3px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
    }

    .info-cell:nth-child(2n) {
      border-right: none;
    }

    .info-cell.full-span {
      grid-column: span 2;
      border-right: none;
    }

    .cell-label {
      font-size: 7.5px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 1px;
    }

    .cell-val {
      font-family: Consolas, "Courier New", Courier, monospace;
      font-size: 9.5px;
      color: #0f172a;
      min-height: 13px;
      font-weight: 500;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      padding: 2.5px 5px;
      font-size: 9px;
      vertical-align: middle;
    }

    th:last-child, td:last-child {
      border-right: none;
    }

    th {
      background: #f8fafc;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.05em;
      color: #475569;
      font-weight: 600;
      text-align: left;
    }

    .readout {
      font-family: Consolas, "Courier New", Courier, monospace;
      font-weight: 600;
      color: #122238;
      background: rgba(31, 51, 80, 0.03);
      text-align: right;
    }

    /* Signature Area */
    .signature-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 28px 24px 8px 24px;
    }

    .sig-line-left {
      width: 170px;
      border-top: 1px solid #1e293b;
      padding-top: 3px;
      font-size: 9.5px;
      font-weight: 600;
      color: #334155;
      text-align: left;
    }

    .sig-line-right {
      width: 170px;
      border-top: 1px solid #1e293b;
      padding-top: 3px;
      font-size: 9.5px;
      font-weight: 600;
      color: #334155;
      text-align: right;
      margin-left: auto;
    }

    /* Footnote */
    .footnote {
      text-align: right;
      font-family: Georgia, "Times New Roman", Times, serif;
      font-style: italic;
      font-size: 8.5px;
      color: #64748b;
      padding: 4px 24px 10px 24px;
    }

    /* A4 Print Layout - Strict 1 Page Fit */
    @media print {
      @page {
        size: A4 portrait;
        margin: 4mm 6mm;
      }

      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .no-print, .no-print-bar {
        display: none !important;
      }

      .sheet-wrapper {
        border: 1px solid #334155 !important;
        box-shadow: none !important;
        width: 100% !important;
        max-width: 100% !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .sheet-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
      }

      th, td {
        padding: 2px 4px !important;
        font-size: 8.5px !important;
        line-height: 1.15 !important;
      }

      .cell-val {
        font-size: 9px !important;
      }

      .signature-row {
        padding-top: 20px !important;
        padding-bottom: 4px !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen-Only Action Bar -->
  <div class="no-print-bar no-print">
    <div>
      <strong>Railway Form NR-IP-01</strong> · Standalone Settlement Sheet (${escapeHtml(data.empName || 'Employee')})
    </div>
    <button type="button" class="print-btn" onclick="window.print()">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="sheet-wrapper">
    <!-- Top Bar -->
    <div class="sheet-topbar">
      <span>Government of India · Ministry of Railways</span>
      <span>Form NR-IP-01</span>
    </div>

    <!-- Header -->
    <div class="sheet-header">
      <div>
        <h1 class="sheet-title">NR Case — I-Pass Data Sheet</h1>
        <p class="sheet-subtitle">Staff Section, Kharagpur Workshop</p>
      </div>
      <div class="sheet-month">
        <span>Month:</span>
        <span class="sheet-month-val">${escapeHtml(data.month || '')}</span>
      </div>
    </div>

    <!-- 2-Column Grid -->
    <div class="sheet-grid">
      <!-- LEFT COLUMN -->
      <div class="grid-col-left">

        <!-- Employee Information -->
        <div class="section-head">Employee Information</div>
        <div class="info-grid">
          <div class="info-cell">
            <div class="cell-label">Name</div>
            <div class="cell-val">${escapeHtml(data.empName)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">Designation</div>
            <div class="cell-val">${escapeHtml(data.designation)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">Father's Name</div>
            <div class="cell-val">${escapeHtml(data.fatherName)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">B.U. No.</div>
            <div class="cell-val">${escapeHtml(data.buNo)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">PF No. / Emp No.</div>
            <div class="cell-val">${escapeHtml(data.pfNo)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">T. No.</div>
            <div class="cell-val">${escapeHtml(data.tNo)}</div>
          </div>
          <div class="info-cell full-span">
            <div class="cell-label">Address</div>
            <div class="cell-val">${escapeHtml(data.address)}</div>
          </div>
          <div class="info-cell full-span">
            <div class="cell-label">Identification Marks</div>
            <div class="cell-val">${escapeHtml(data.idMarks)}</div>
          </div>
        </div>

        <!-- Service Details -->
        <div class="section-head">Service Details</div>
        <table>
          <thead>
            <tr>
              <th style="width:20px; text-align:center;">Sl</th>
              <th>Particulars</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">1</td>
              <td>Date of Birth</td>
              <td style="font-family:monospace; font-weight:600;">${escapeHtml(data.dob)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">2</td>
              <td>Date of Appointment</td>
              <td style="font-family:monospace; font-weight:600;">${escapeHtml(data.doa)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">3</td>
              <td>Date of Retirement</td>
              <td style="font-family:monospace; font-weight:600;">${escapeHtml(data.dor)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">4</td>
              <td>Non-Qualifying / Sub Period</td>
              <td style="font-family:monospace;">${escapeHtml(nqText)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">5</td>
              <td>Total Service</td>
              <td style="font-family:monospace; font-weight:600; color:#122238;">${escapeHtml(totalServiceText)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">6</td>
              <td>Qualifying Service</td>
              <td style="font-family:monospace; font-weight:600; color:#122238;">${escapeHtml(qualServiceText)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">7</td>
              <td>Last Rate of Pay (₹)</td>
              <td style="font-family:monospace; font-weight:600;">${escapeHtml(data.basicPay ? '₹ ' + Number(data.basicPay).toLocaleString('en-IN') : '')}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">8</td>
              <td>Pay Band / Scale</td>
              <td style="font-family:monospace;">${escapeHtml(data.payBand)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">9</td>
              <td>Leave Details</td>
              <td style="font-family:monospace;">LAP: ${escapeHtml(data.lap || 0)} &nbsp;&nbsp; LHAP: ${escapeHtml(data.lhap || 0)}</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">10</td>
              <td>Dearness Allowance (%)</td>
              <td style="font-family:monospace;">${escapeHtml(data.daPercent || 0)}%</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">11</td>
              <td>Commutation (%)</td>
              <td style="font-family:monospace;">${escapeHtml(data.commPercent || 0)}%</td>
            </tr>
            <tr>
              <td style="text-align:center; font-family:monospace; color:#64748b;">12</td>
              <td>Reason</td>
              <td style="font-family:monospace;">${escapeHtml(data.reason)}</td>
            </tr>
          </tbody>
        </table>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="grid-col-right">

        <!-- Bank Details -->
        <div class="section-head">Bank Details</div>
        <div class="info-grid">
          <div class="info-cell">
            <div class="cell-label">Bank Name</div>
            <div class="cell-val">${escapeHtml(data.bankName)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">Branch</div>
            <div class="cell-val">${escapeHtml(data.branch)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">Account No.</div>
            <div class="cell-val">${escapeHtml(data.accNo)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">IFSC Code</div>
            <div class="cell-val">${escapeHtml(data.ifsc)}</div>
          </div>
        </div>

        <!-- Family Composition & Allowances -->
        <div class="section-head">Family Composition &amp; Allowances</div>
        <table>
          <thead>
            <tr>
              <th style="width:20px; text-align:center;">Srl</th>
              <th>Name</th>
              <th>Relation</th>
              <th>DOB</th>
            </tr>
          </thead>
          <tbody>
            ${familyRows || '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">No family recorded</td></tr>'}
          </tbody>
        </table>

        <!-- Railway Quarter & Medical Option -->
        <div class="info-grid" style="border-top:1px solid #cbd5e1;">
          <div class="info-cell">
            <div class="cell-label">Railway Quarter</div>
            <div class="cell-val">${escapeHtml(data.quarter)}</div>
          </div>
          <div class="info-cell">
            <div class="cell-label">Medical Allowance Option</div>
            <div class="cell-val">${escapeHtml(data.medical)}</div>
          </div>
          ${data.quarter === 'Yes' && data.quarterDetail ? `
          <div class="info-cell full-span" style="background:#f0fdf4;">
            <div class="cell-label">Quarter No. &amp; Address</div>
            <div class="cell-val">${escapeHtml(data.quarterDetail)}</div>
          </div>
          ` : ''}
        </div>

        <!-- Calculation (Staff Settlement) -->
        <div class="section-head">
          <span>Calculation</span>
          <span style="font-family:monospace; font-size:8px; font-weight:normal; color:#cbd5e1;">Staff Settlement</span>
        </div>
        <table>
          <tbody>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">1</td>
              <td>Pension</td>
              <td class="readout">${formatINR(pension)}</td>
            </tr>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">2</td>
              <td>Commutation</td>
              <td class="readout">${formatINR(commutation)}</td>
            </tr>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">3</td>
              <td>Commutation Value</td>
              <td class="readout">${formatINR(commValue)}</td>
            </tr>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">4</td>
              <td>Reduced Pension</td>
              <td class="readout">${formatINR(reducedPension)}</td>
            </tr>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">5</td>
              <td>DCRG</td>
              <td class="readout">${formatINR(dcrg.finalPayable)}</td>
            </tr>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">6</td>
              <td>Leave Salary</td>
              <td class="readout">${formatINR(leaveSalary)}</td>
            </tr>
            <tr>
              <td style="width:20px; text-align:center; font-family:monospace; color:#64748b;">7</td>
              <td>GIS (Group – "D" 1990, Group – "C" 2003)</td>
              <td class="readout">${gisFormatted || '₹ ' + (Number(data.gis) || 0).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <!-- Signatures: Only Dealer at left side & Asst. Personnel Officer at right side -->
    <div class="signature-row">
      <div>
        <div class="sig-line-left">
          Signature of Dealer
        </div>
      </div>
      <div>
        <div class="sig-line-right">
          Asst. Personnel Officer
        </div>
      </div>
    </div>

    <!-- Footnote -->
    <div class="footnote">
      Prepared by Biswajyoti Roy Sarkar
    </div>

  </div>

</body>
</html>`;
}
