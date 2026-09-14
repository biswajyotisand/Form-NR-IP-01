import { DateDiffResult, DCRGResult, IPassFormData, CalculationResult } from '../types';

/**
 * Format a number into Indian Rupee style (e.g. ₹ 25,00,000 or ₹ 25,00,000.00)
 */
export function formatINR(val: number, decimals: number = 0): string {
  if (isNaN(val) || val === null || val === undefined) return '₹ 0';
  const isNeg = val < 0;
  const absVal = Math.abs(val);

  let numStr: string;
  let decPart = '';

  if (decimals > 0) {
    const fixed = absVal.toFixed(decimals);
    const parts = fixed.split('.');
    numStr = parts[0];
    decPart = '.' + parts[1];
  } else {
    numStr = Math.round(absVal).toString();
  }

  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  let formatted = '';
  if (otherNumbers !== '') {
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  } else {
    formatted = lastThree;
  }

  return `${isNeg ? '-' : ''}₹ ${formatted}${decPart}`;
}

/**
 * Date difference in Years, Months, and Days
 * Matching standard Excel DATEDIF logic for retirement service calculations
 */
export function dateDiffYMD(start: Date, end: Date): DateDiffResult {
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();
  let d = end.getDate() - start.getDate();

  if (d < 0) {
    m -= 1;
    // previous month's total days
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    d += prevMonthLastDay;
  }

  if (m < 0) {
    y -= 1;
    m += 12;
  }

  if (y < 0) {
    y = 0;
    m = 0;
    d = 0;
  }

  return { y, m, d };
}

/**
 * Parses date string in various formats safely:
 * - 'DD-MM-YYYY' or 'DD/MM/YYYY' or 'DD.MM.YYYY'
 * - 'YYYY-MM-DD' or 'YYYY/MM/DD'
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const trimmed = String(dateStr).trim();
  if (!trimmed) return null;

  // Check for DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()) && d.getDate() === day && d.getMonth() === month) {
      return d;
    }
    return null;
  }

  // Check for YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()) && d.getDate() === day && d.getMonth() === month) {
      return d;
    }
    return null;
  }

  try {
    const d = new Date(trimmed + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Calculates Qualifying Service by subtracting Non-Qualifying days/months/years
 * with 30-day month borrow and 12-month year borrow
 */
export function calculateQualifyingService(
  totalService: DateDiffResult | null,
  nqY: number,
  nqM: number,
  nqD: number
): DateDiffResult | null {
  if (!totalService) return null;

  let tempD = totalService.d - nqD;
  const borrowM = tempD < 0 ? 1 : 0;
  const qualD = tempD < 0 ? tempD + 30 : tempD;

  let tempM = totalService.m - nqM - borrowM;
  const borrowY = tempM < 0 ? 1 : 0;
  const qualM = tempM < 0 ? tempM + 12 : tempM;

  let qualY = totalService.y - nqY - borrowY;
  if (qualY < 0) qualY = 0;

  return { y: qualY, m: qualM, d: qualD };
}

/**
 * Calculates Death-cum-Retirement Gratuity (DCRG)
 * Integrated from File 2 (DCRG Calculator) and Railway Services (Pension) Rules
 */
export function calculateDCRG(
  reason: 'Retirement/Resignation' | 'Death in Service',
  basicPay: number,
  daPercent: number,
  qualifyingService: DateDiffResult | null
): DCRGResult {
  const daAmount = (basicPay * daPercent) / 100;
  const totalEmoluments = basicPay + daAmount;

  const years = qualifyingService ? qualifyingService.y : 0;
  const months = qualifyingService ? qualifyingService.m : 0;

  // 6-Monthly Periods calculation from File 2:
  // Standard DCRG logic: 3 months or more = 1 half-year (6-monthly period)
  // 9 months or more = 2 half-years
  let rawPeriods = years * 2;
  if (months >= 3 && months < 9) {
    rawPeriods += 1;
  } else if (months >= 9) {
    rawPeriods += 2;
  }

  // Maximum cap of 66 half-yearly periods (33 years of service)
  const cappedPeriods = Math.min(rawPeriods, 66);

  // Statutory Ceiling limit
  // Base 7th CPC is ₹20 Lakhs; enhanced to ₹25 Lakhs when DA reaches or exceeds 50%
  const ceilingLimit = daPercent >= 50 ? 2500000 : 2000000;

  let isEligible = true;
  let statusText = 'ELIGIBLE';
  let statusClass: 'eligible' | 'not-eligible' = 'eligible';
  let calculatedGratuity = 0;
  let formulaNote = '';

  const totalMonths = (years * 12) + months;

  if (reason === 'Death in Service') {
    // Railway Services (Pension) Rules 1993 Rule 70 Death Gratuity Scale
    isEligible = true;
    statusClass = 'eligible';
    if (totalMonths < 12) {
      calculatedGratuity = 2 * totalEmoluments;
      statusText = 'ELIGIBLE (< 1 Yr Service: 2 × Emoluments)';
      formulaNote = '2 × Emoluments (Service < 1 year)';
    } else if (totalMonths < 60) {
      calculatedGratuity = 6 * totalEmoluments;
      statusText = 'ELIGIBLE (1 to < 5 Yrs: 6 × Emoluments)';
      formulaNote = '6 × Emoluments (Service 1 to < 5 years)';
    } else if (totalMonths < 132) {
      calculatedGratuity = 12 * totalEmoluments;
      statusText = 'ELIGIBLE (5 to < 11 Yrs: 12 × Emoluments)';
      formulaNote = '12 × Emoluments (Service 5 to < 11 years)';
    } else if (totalMonths < 240) {
      calculatedGratuity = 20 * totalEmoluments;
      statusText = 'ELIGIBLE (11 to < 20 Yrs: 20 × Emoluments)';
      formulaNote = '20 × Emoluments (Service 11 to < 20 years)';
    } else {
      calculatedGratuity = (totalEmoluments * 0.5) * cappedPeriods;
      statusText = `ELIGIBLE (≥ 20 Yrs: 1/2 × Emoluments × ${cappedPeriods} periods)`;
      formulaNote = `(Emoluments / 2) × ${cappedPeriods} half-yearly periods`;
    }
  } else {
    // Retirement / Resignation Case (From File 2)
    // Retirement requires minimum 5 years (10 six-monthly periods)
    if (years < 5 && totalMonths < 57) {
      isEligible = false;
      statusText = 'NOT ELIGIBLE (Less than 5 Yrs)';
      statusClass = 'not-eligible';
      calculatedGratuity = 0;
      formulaNote = 'Minimum 5 years of qualifying service required for Retirement Gratuity';
    } else {
      isEligible = true;
      statusText = `ELIGIBLE (${cappedPeriods} Six-Monthly Periods)`;
      statusClass = 'eligible';
      // Formula: (Emoluments / 4) * Number of 6-monthly periods (1/4th month emoluments per half-year)
      calculatedGratuity = (totalEmoluments / 4) * cappedPeriods;
      formulaNote = `(Emoluments / 4) × ${cappedPeriods} half-yearly periods`;
    }
  }

  const finalPayable = Math.min(calculatedGratuity, ceilingLimit);

  return {
    daAmount,
    totalEmoluments,
    rawPeriods,
    cappedPeriods,
    isEligible,
    statusText,
    statusClass,
    calculatedGratuity,
    ceilingLimit,
    finalPayable,
    formulaNote,
  };
}

/**
 * Calculates all settlement figures for Form NR-IP-01
 */
export function calculateAll(data: IPassFormData): CalculationResult {
  const doa = parseDateString(data.doa);
  const dor = parseDateString(data.dor);

  let totalService: DateDiffResult | null = null;
  let hasService = false;

  if (doa && dor && dor >= doa) {
    const endPlus1 = new Date(dor);
    endPlus1.setDate(endPlus1.getDate() + 1);
    totalService = dateDiffYMD(doa, endPlus1);
    hasService = true;
  }

  const qualService = calculateQualifyingService(
    totalService,
    Number(data.nqY) || 0,
    Number(data.nqM) || 0,
    Number(data.nqD) || 0
  );

  const basicPay = Number(data.basicPay) || 0;
  const daPercent = Number(data.daPercent) || 0;
  const commPercent = Number(data.commPercent) || 0;
  const lap = Number(data.lap) || 0;
  const lhap = Number(data.lhap) || 0;

  // 1. Pension = 50% of Basic Pay
  const pension = basicPay / 2;

  // 2. Commutation
  const commutation = pension * (commPercent / 100);

  // 3. Commutation Value (purchase factor for age 60 next birthday: 8.194 * 12 = 98.328)
  const commValue = commutation * 98.328;

  // 4. Reduced Pension
  const reducedPension = (1 - (commPercent / 100)) * pension;

  // 5. Leave Salary
  const daFactor = daPercent / 100;
  const emolumentsPerDayBase = basicPay + (basicPay * daFactor);
  const lapCapped = Math.min(lap, 300);
  const lhapCapped = Math.min(lhap, Math.max(0, 300 - lapCapped));
  const leaveSalary = (lapCapped * emolumentsPerDayBase / 30) + (lhapCapped * emolumentsPerDayBase / 60);

  // 6. DCRG (Integrated from File 2 engine)
  const dcrg = calculateDCRG(data.reason, basicPay, daPercent, qualService);

  // GIS formatting
  const gisNum = Number(data.gis) || 0;
  const gisFormatted = gisNum.toLocaleString('en-IN');

  return {
    totalService,
    qualService,
    hasService,
    pension,
    commutation,
    commValue,
    reducedPension,
    leaveSalary,
    dcrg,
    gisFormatted,
  };
}

/**
 * Returns the auto-detected current month & year in 'Month YYYY' format (e.g. 'September 2026')
 */
export function getCurrentMonthYear(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
