import React from 'react';
import { Printer, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { IPassFormData, DCRGResult, DateDiffResult } from '../types';
import { formatINR } from '../utils/calculations';
import { ManualDateInput } from './ManualDateInput';

interface DcrgCalculatorCardProps {
  data: IPassFormData;
  onChange: <K extends keyof IPassFormData>(field: K, value: IPassFormData[K]) => void;
  dcrg: DCRGResult;
  qualService: DateDiffResult | null;
  onSwitchToSheet?: () => void;
  onPrint?: () => void;
  isEmbedded?: boolean;
}

export const DcrgCalculatorCard: React.FC<DcrgCalculatorCardProps> = ({
  data,
  onChange,
  dcrg,
  qualService,
  onSwitchToSheet,
  onPrint,
  isEmbedded = false,
}) => {
  const years = qualService?.y ?? 0;
  const months = qualService?.m ?? 0;

  return (
    <div className={`w-full max-w-xl mx-auto bg-white rounded-lg border border-slate-300 shadow-lg p-6 sm:p-8 ${isEmbedded ? '' : 'my-4'}`}>
      <div className="text-center pb-4 border-b-2 border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2c3e50] tracking-tight">
          DCRG Calculator
        </h2>
        <h4 className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Establishment Tool: Kharagpur Workshop
        </h4>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>Synced with Form NR-IP-01 Data Sheet</span>
        </div>
      </div>

      {/* 1. INPUT PARAMETERS */}
      <div className="mt-5">
        <div className="bg-[#34495e] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded">
          1. INPUT PARAMETERS
        </div>

        <div className="mt-3 space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <label htmlFor="dcrg-reason" className="font-semibold text-[#34495e] text-xs sm:text-sm">
              Reason for Exit
            </label>
            <select
              id="dcrg-reason"
              value={data.reason}
              onChange={(e) => onChange('reason', e.target.value as any)}
              className="sm:w-60 px-3 py-1.5 border border-slate-300 rounded font-mono text-xs sm:text-sm focus:outline-none focus:border-[#34495e] bg-white"
            >
              <option value="Retirement/Resignation">Retirement/Resignation</option>
              <option value="Death in Service">Death Cases</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <label htmlFor="dcrg-exitDate" className="font-semibold text-[#34495e] text-xs sm:text-sm block">
              Date of Exit / Retirement (DOR)
            </label>
            <div className="sm:w-60 px-3 py-1.5 border border-slate-300 rounded font-mono text-xs sm:text-sm bg-white focus-within:border-[#34495e]">
              <ManualDateInput
                id="dcrg-exitDate"
                value={data.dor}
                onChange={(val) => onChange('dor', val)}
                placeholder="DD-MM-YYYY"
                title="Date of Exit / Retirement"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <label htmlFor="dcrg-basicPay" className="font-semibold text-[#34495e] text-xs sm:text-sm">
              Last Drawn Basic (₹)
            </label>
            <input
              id="dcrg-basicPay"
              type="text"
              inputMode="numeric"
              value={data.basicPay === '' ? '' : data.basicPay}
              onChange={(e) => onChange('basicPay', e.target.value.replace(/[^0-9]/g, ''))}
              className="sm:w-60 px-3 py-1.5 border border-slate-300 rounded font-mono text-xs sm:text-sm focus:outline-none focus:border-[#34495e]"
              placeholder="60000"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <label htmlFor="dcrg-daPercent" className="font-semibold text-[#34495e] text-xs sm:text-sm">
              DA %
            </label>
            <input
              id="dcrg-daPercent"
              type="text"
              inputMode="decimal"
              value={data.daPercent === '' ? '' : data.daPercent}
              onChange={(e) => onChange('daPercent', e.target.value.replace(/[^0-9.]/g, ''))}
              className="sm:w-60 px-3 py-1.5 border border-slate-300 rounded font-mono text-xs sm:text-sm focus:outline-none focus:border-[#34495e]"
              placeholder="50"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <div>
              <label className="font-semibold text-[#34495e] text-xs sm:text-sm block">
                Qualifying Service
              </label>
              <span className="text-[10px] text-slate-500">
                Calculated from DOA &amp; Non-Qualifying days
              </span>
            </div>
            <div className="sm:w-60 flex gap-2">
              <div className="flex-1">
                <div className="text-[10px] text-slate-500 font-medium">Years</div>
                <div className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs sm:text-sm font-semibold text-slate-800">
                  {years} Yrs
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-slate-500 font-medium">Months</div>
                <div className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs sm:text-sm font-semibold text-slate-800">
                  {months} Mos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EMOLUMENTS & EVALUATION */}
      <div className="mt-6">
        <div className="bg-[#34495e] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded">
          2. EMOLUMENTS &amp; EVALUATION
        </div>
        <table className="w-full mt-2 text-xs sm:text-sm border-collapse">
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2 text-slate-600">DA Amount (₹)</td>
              <td className="py-2 text-right font-mono font-bold text-[#2c3e50]">
                {formatINR(dcrg.daAmount, 2)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Total Monthly Emoluments (₹)</td>
              <td className="py-2 text-right font-mono font-bold text-[#2c3e50]">
                {formatINR(dcrg.totalEmoluments, 2)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Final Eligible 6-Monthly Periods</td>
              <td className="py-2 text-right font-mono font-bold text-[#2c3e50]">
                {dcrg.cappedPeriods}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Rule Assessment Status</td>
              <td className="py-2 text-right">
                <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold tracking-wide ${
                  dcrg.isEligible
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {dcrg.statusText}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. PAYOUT CALCULATION */}
      <div className="mt-6">
        <div className="bg-[#34495e] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded">
          3. PAYOUT CALCULATION
        </div>
        <table className="w-full mt-2 text-xs sm:text-sm border-collapse">
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2 text-slate-600">Calculated Gratuity (₹)</td>
              <td className="py-2 text-right font-mono font-bold text-[#2c3e50]">
                {formatINR(dcrg.calculatedGratuity, 2)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">
                <div>Statutory Ceiling Limit (₹)</div>
                <div className="text-[10px] text-slate-400">
                  {Number(data.daPercent) >= 50 ? '7th CPC Enhanced (DA ≥ 50%)' : 'Base 7th CPC (₹20 Lakhs)'}
                </div>
              </td>
              <td className="py-2 text-right font-mono font-bold text-slate-700">
                {formatINR(dcrg.ceilingLimit, 2)}
              </td>
            </tr>
            <tr className="bg-[#e8f4fd] font-bold text-sm sm:text-base border-t-2 border-blue-400">
              <td className="py-3 px-2 text-slate-800">
                FINAL GRATUITY PAYABLE (₹)
              </td>
              <td className="py-3 px-2 text-right font-mono text-[#27ae60] text-base sm:text-lg font-bold">
                {formatINR(dcrg.finalPayable, 2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 text-center text-slate-500 text-xs leading-relaxed">
        Designed for Kharagpur Workshop by <span className="font-semibold text-slate-700">Biswajyoti Roy Sarkar</span><br />
        <span className="font-mono text-[11px] text-slate-400">Rule Ref: Railway Services (Pension) Rules</span>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-2.5 no-print">
        {onSwitchToSheet && (
          <button
            type="button"
            onClick={onSwitchToSheet}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded border border-slate-300 text-[#34495e] hover:bg-slate-50 font-medium text-xs sm:text-sm cursor-pointer transition"
          >
            <span>View Full Form NR-IP-01</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (onPrint) {
              onPrint();
            } else {
              try {
                window.print();
              } catch (e) {
                console.warn('Print blocked by container sandbox:', e);
              }
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded bg-[#34495e] text-white hover:bg-[#2c3e50] font-medium text-xs sm:text-sm cursor-pointer shadow-xs transition"
        >
          <Printer className="h-4 w-4" />
          <span>Print DCRG Report</span>
        </button>
      </div>
    </div>
  );
};
