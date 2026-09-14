import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Calculator, BookOpen } from 'lucide-react';
import { DCRGResult, IPassFormData, DateDiffResult } from '../types';
import { formatINR } from '../utils/calculations';

interface DcrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IPassFormData;
  dcrg: DCRGResult;
  qualService: DateDiffResult | null;
}

export const DcrgModal: React.FC<DcrgModalProps> = ({
  isOpen,
  onClose,
  data,
  dcrg,
  qualService,
}) => {
  if (!isOpen) return null;

  const years = qualService?.y ?? 0;
  const months = qualService?.m ?? 0;
  const days = qualService?.d ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl border border-slate-300 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dcrg-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#122238] px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <Calculator className="h-5 w-5 text-amber-400" />
            <div>
              <h3 id="dcrg-modal-title" className="text-base font-semibold tracking-wide">
                DCRG Calculation &amp; Rule Assessment
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Railway Services (Pension) Rules · Kharagpur Workshop
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4 text-slate-800 text-xs sm:text-sm">
          {/* Summary Banner */}
          <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Case Type</span>
              <span className="font-semibold text-slate-800">{data.reason}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assessment Status</span>
              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-xs ${
                dcrg.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {dcrg.isEligible ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                {dcrg.statusText}
              </span>
            </div>
          </div>

          {/* Step 1: Emoluments */}
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="bg-[#1f3350] text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>1. Emoluments (Basic + DA)</span>
              <span className="font-mono text-[11px] font-normal text-slate-200">Formula: Basic + (Basic × DA%)</span>
            </div>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <td className="px-3 py-2 text-slate-600">Last Drawn Basic Pay (₹)</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">{formatINR(Number(data.basicPay) || 0, 2)}</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Dearness Allowance (DA @ {data.daPercent}%)</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">{formatINR(dcrg.daAmount, 2)}</td>
                </tr>
                <tr className="bg-amber-50/50 font-semibold">
                  <td className="px-3 py-2 text-slate-800">Total Monthly Emoluments (₹)</td>
                  <td className="px-3 py-2 text-right font-mono text-slate-900 text-sm">{formatINR(dcrg.totalEmoluments, 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step 2: Qualifying Service & 6-Monthly Periods */}
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="bg-[#1f3350] text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>2. Qualifying Service &amp; Completed Periods</span>
              <span className="font-mono text-[11px] font-normal text-slate-200">3-8 Mos = 1 Period, ≥9 Mos = 2 Periods</span>
            </div>
            <div className="p-3 bg-white space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Net Qualifying Service:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {years} Years {months} Months {days} Days
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Computed Half-Yearly Periods:</span>
                  <span className="font-mono font-bold text-sm text-slate-800">{dcrg.rawPeriods} Periods</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">({years} × 2) + {months >= 9 ? '2' : months >= 3 ? '1' : '0'} rounded period</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Final Eligible Periods (Cap = 66):</span>
                  <span className="font-mono font-bold text-sm text-[#1f3350]">{dcrg.cappedPeriods} Periods</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Capped at max 33 yrs (66 half-years)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payout Calculation & Statutory Ceiling */}
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="bg-[#1f3350] text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>3. Payout Calculation &amp; Statutory Ceiling</span>
              <span className="font-mono text-[11px] font-normal text-slate-200">7th CPC Gratuity Rules</span>
            </div>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <td className="px-3 py-2 text-slate-600">
                    <div>Applied Formula</div>
                    <div className="text-[11px] text-slate-500 font-mono">{dcrg.formulaNote}</div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-600 align-middle">
                    {dcrg.isEligible ? (
                      data.reason === 'Death in Service' ? 'Rule 70 Scale' : `(${formatINR(dcrg.totalEmoluments)} / 4) × ${dcrg.cappedPeriods}`
                    ) : 'Not Eligible'}
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Calculated Gratuity (₹)</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">{formatINR(dcrg.calculatedGratuity, 2)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 text-slate-600">
                    <div>Statutory Ceiling Limit (₹)</div>
                    <div className="text-[10px] text-slate-500">
                      {Number(data.daPercent) >= 50 ? 'Enhanced to ₹25,00,000 (DA ≥ 50%)' : 'Standard 7th CPC Limit (₹20,00,000)'}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-slate-700">{formatINR(dcrg.ceilingLimit, 2)}</td>
                </tr>
                <tr className="bg-emerald-50 border-t-2 border-emerald-600 font-bold">
                  <td className="px-3 py-2.5 text-emerald-950 text-xs sm:text-sm">
                    FINAL DCRG PAYABLE (₹)
                    <div className="text-[10px] font-normal text-emerald-800">
                      Minimum of Calculated Gratuity vs Statutory Ceiling
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-emerald-900 text-sm sm:text-base font-bold">
                    {formatINR(dcrg.finalPayable, 2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Regulatory Note */}
          <div className="flex items-start gap-2 p-2.5 rounded bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px]">
            <BookOpen className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-semibold">Rule Reference:</span> Railway Services (Pension) Rules 1993 (Rule 70 for Death Gratuity &amp; Retirement Gratuity provisions). This calculated figure is directly synchronized with Row 5 of Form NR-IP-01.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <span className="text-[11px] text-slate-500 italic">
            Prepared for Kharagpur Workshop · Staff Section
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-[#122238] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1f3350] transition shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
