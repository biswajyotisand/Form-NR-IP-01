export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dob: string;
}

export interface IPassFormData {
  month: string;
  // Employee Information
  empName: string;
  designation: string;
  fatherName: string;
  buNo: string;
  pfNo: string;
  tNo: string;
  address: string;
  idMarks: string;

  // Service Details
  dob: string;
  dor: string;
  doa: string;
  nqY: number | string;
  nqM: number | string;
  nqD: number | string;
  basicPay: number | string;
  payBand: string;
  lap: number | string;
  lhap: number | string;
  daPercent: number | string;
  commPercent: number | string;
  reason: 'Retirement/Resignation' | 'Death in Service';

  // Bank Details
  bankName: string;
  branch: string;
  accNo: string;
  ifsc: string;

  // Family & Allowances
  family: FamilyMember[];
  quarter: 'No' | 'Yes';
  quarterDetail: string;
  medical: 'Not Opted' | 'Opted';

  // GIS
  gis: number | string;
}

export interface DateDiffResult {
  y: number;
  m: number;
  d: number;
}

export interface DCRGResult {
  daAmount: number;
  totalEmoluments: number;
  rawPeriods: number;
  cappedPeriods: number;
  isEligible: boolean;
  statusText: string;
  statusClass: 'eligible' | 'not-eligible';
  calculatedGratuity: number;
  ceilingLimit: number;
  finalPayable: number;
  formulaNote: string;
}

export interface CalculationResult {
  totalService: DateDiffResult | null;
  qualService: DateDiffResult | null;
  hasService: boolean;
  pension: number;
  commutation: number;
  commValue: number;
  reducedPension: number;
  leaveSalary: number;
  dcrg: DCRGResult;
  gisFormatted: string;
}
