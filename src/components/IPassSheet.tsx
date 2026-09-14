import React from 'react';
import { Plus, Trash2, Calculator, Info } from 'lucide-react';
import { IPassFormData, CalculationResult, FamilyMember } from '../types';
import { formatINR, getCurrentMonthYear } from '../utils/calculations';
import { ManualDateInput } from './ManualDateInput';

interface IPassSheetProps {
  data: IPassFormData;
  onChange: <K extends keyof IPassFormData>(field: K, value: IPassFormData[K]) => void;
  onAddFamilyMember: () => void;
  onRemoveFamilyMember: (id: string) => void;
  onUpdateFamilyMember: (id: string, field: keyof FamilyMember, val: string) => void;
  calc: CalculationResult;
  onOpenDcrgModal: () => void;
}

export const IPassSheet: React.FC<IPassSheetProps> = ({
  data,
  onChange,
  onAddFamilyMember,
  onRemoveFamilyMember,
  onUpdateFamilyMember,
  calc,
  onOpenDcrgModal,
}) => {
  const { totalService, qualService, hasService, pension, commutation, commValue, reducedPension, dcrg, leaveSalary } = calc;

  const totalServiceText = hasService && totalService
    ? `${totalService.y} Yrs ${totalService.m} Mos ${totalService.d} Days`
    : '—';

  const qualServiceText = hasService && qualService
    ? `${qualService.y} Yrs ${qualService.m} Mos ${qualService.d} Days`
    : '—';

  return (
    <div className="railway-sheet w-full max-w-[960px] mx-auto text-slate-800 bg-white print:max-w-none print:w-full print:m-0">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-[#122238] text-[#e7e2d3] font-plex-mono text-[9.5px] print:text-[8px] tracking-wider uppercase px-3.5 py-1.5 print:py-1 border-b border-slate-700">
        <span>Government of India · Ministry of Railways</span>
        <span>Form NR-IP-01</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-4 py-3 print:py-1.5 print:px-3 border-b-2 border-[#1f3350]">
        <div>
          <h1 className="font-source-serif font-bold text-lg sm:text-[19px] print:text-[15px] text-[#122238] uppercase tracking-wide m-0">
            NR Case — I-Pass Data Sheet
          </h1>
          <p className="text-[10.5px] print:text-[9px] text-slate-500 italic mt-0.5 mb-0">
            Staff Section, Kharagpur Workshop
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] print:text-[9px] text-slate-500 whitespace-nowrap self-stretch sm:self-auto justify-end">
          <label htmlFor="month-input" className="font-semibold text-slate-600">Month</label>
          <input
            id="month-input"
            type="text"
            value={data.month}
            onChange={(e) => onChange('month', e.target.value)}
            placeholder={getCurrentMonthYear()}
            title="Month of Settlement"
            className="font-plex-mono text-[11px] print:text-[9.5px] px-2 py-1 print:py-0.5 border border-slate-300 rounded-xs w-36 print:w-28 bg-white focus:outline-none focus:border-[#1f3350]"
          />
        </div>
      </div>

      {/* 2-Column Main Grid */}
      <div className="sheet-grid-container grid grid-cols-1 md:grid-cols-2 print:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="border-b md:border-b-0 md:border-r border-slate-300 print:border-b-0 print:border-r">
          
          {/* Employee Information */}
          <div className="border-b border-slate-300">
            <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] tracking-wider uppercase px-2.5 py-1">
              Employee Information
            </div>
            <div className="grid grid-cols-2 text-xs">
              <div className="border-r border-b border-slate-300 p-1.5">
                <label htmlFor="empName" className="block text-[9px] uppercase tracking-wider text-slate-500">Name</label>
                <input
                  id="empName"
                  type="text"
                  value={data.empName}
                  onChange={(e) => onChange('empName', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-b border-slate-300 p-1.5">
                <label htmlFor="designation" className="block text-[9px] uppercase tracking-wider text-slate-500">Designation</label>
                <input
                  id="designation"
                  type="text"
                  value={data.designation}
                  onChange={(e) => onChange('designation', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-r border-b border-slate-300 p-1.5">
                <label htmlFor="fatherName" className="block text-[9px] uppercase tracking-wider text-slate-500">Father's Name</label>
                <input
                  id="fatherName"
                  type="text"
                  value={data.fatherName}
                  onChange={(e) => onChange('fatherName', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-b border-slate-300 p-1.5">
                <label htmlFor="buNo" className="block text-[9px] uppercase tracking-wider text-slate-500">B.U. No.</label>
                <input
                  id="buNo"
                  type="text"
                  value={data.buNo}
                  onChange={(e) => onChange('buNo', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-r border-b border-slate-300 p-1.5">
                <label htmlFor="pfNo" className="block text-[9px] uppercase tracking-wider text-slate-500">PF No. / Emp No.</label>
                <input
                  id="pfNo"
                  type="text"
                  value={data.pfNo}
                  onChange={(e) => onChange('pfNo', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-b border-slate-300 p-1.5">
                <label htmlFor="tNo" className="block text-[9px] uppercase tracking-wider text-slate-500">T. No.</label>
                <input
                  id="tNo"
                  type="text"
                  value={data.tNo}
                  onChange={(e) => onChange('tNo', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="col-span-2 border-b border-slate-300 p-1.5">
                <label htmlFor="address" className="block text-[9px] uppercase tracking-wider text-slate-500">Address</label>
                <input
                  id="address"
                  type="text"
                  value={data.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="col-span-2 p-1.5">
                <label htmlFor="idMarks" className="block text-[9px] uppercase tracking-wider text-slate-500">Identification Marks</label>
                <input
                  id="idMarks"
                  type="text"
                  value={data.idMarks}
                  onChange={(e) => onChange('idMarks', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-b border-slate-300">
            <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] tracking-wider uppercase px-2.5 py-1">
              Service Details
            </div>
            <table className="svc-table w-full">
              <thead>
                <tr>
                  <th className="w-6 text-center">Sl</th>
                  <th>Particulars</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">1</td>
                  <td>Date of Birth</td>
                  <td>
                    <ManualDateInput
                      id="dob"
                      value={data.dob}
                      onChange={(val) => onChange('dob', val)}
                      placeholder="DD-MM-YYYY"
                      title="Date of Birth"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">2</td>
                  <td>Date of Appointment</td>
                  <td>
                    <ManualDateInput
                      id="doa"
                      value={data.doa}
                      onChange={(val) => onChange('doa', val)}
                      placeholder="DD-MM-YYYY"
                      title="Date of Appointment"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">3</td>
                  <td>Date of Retirement</td>
                  <td>
                    <ManualDateInput
                      id="dor"
                      value={data.dor}
                      onChange={(val) => onChange('dor', val)}
                      placeholder="DD-MM-YYYY"
                      title="Date of Retirement"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">4</td>
                  <td>Non-Qualifying / Sub Period</td>
                  <td>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Yrs"
                        value={data.nqY === '' ? '' : data.nqY}
                        onChange={(e) => onChange('nqY', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-[32%] text-center border-b border-slate-300 font-plex-mono text-[11px] focus:outline-none focus:border-[#1f3350] bg-transparent"
                        title="Years"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Mos"
                        value={data.nqM === '' ? '' : data.nqM}
                        onChange={(e) => onChange('nqM', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-[32%] text-center border-b border-slate-300 font-plex-mono text-[11px] focus:outline-none focus:border-[#1f3350] bg-transparent"
                        title="Months"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Days"
                        value={data.nqD === '' ? '' : data.nqD}
                        onChange={(e) => onChange('nqD', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-[32%] text-center border-b border-slate-300 font-plex-mono text-[11px] focus:outline-none focus:border-[#1f3350] bg-transparent"
                        title="Days"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">5</td>
                  <td>Total Service</td>
                  <td className="readout-cell">{totalServiceText}</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="font-plex-mono text-[10px] text-center text-slate-400"></td>
                  <td className="pl-4 italic text-slate-600 font-medium">Qualifying Service</td>
                  <td className="readout-cell font-bold text-[#122238]">{qualServiceText}</td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">6</td>
                  <td>Last Rate of Pay (₹)</td>
                  <td>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data.basicPay === '' ? '' : data.basicPay}
                      onChange={(e) => onChange('basicPay', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 60000"
                      className="w-full font-plex-mono font-semibold text-[11.5px] bg-transparent focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">7</td>
                  <td>Pay Band + Grade Pay</td>
                  <td>
                    <input
                      type="text"
                      value={data.payBand}
                      onChange={(e) => onChange('payBand', e.target.value)}
                      placeholder="Level-6 / GP 4200"
                      className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">8</td>
                  <td>Leave Details (LAP / LHAP)</td>
                  <td>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-slate-600">
                      <span>LAP</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.lap === '' ? '' : data.lap}
                        onChange={(e) => onChange('lap', e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="0"
                        className="w-11 text-center border-b border-slate-300 font-plex-mono text-[11px] text-slate-900 focus:outline-none focus:border-[#1f3350] bg-transparent"
                      />
                      <span className="ml-1">LHAP</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.lhap === '' ? '' : data.lhap}
                        onChange={(e) => onChange('lhap', e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="0"
                        className="w-11 text-center border-b border-slate-300 font-plex-mono text-[11px] text-slate-900 focus:outline-none focus:border-[#1f3350] bg-transparent"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">9</td>
                  <td>Dearness Allowance (%)</td>
                  <td>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.daPercent === '' ? '' : data.daPercent}
                      onChange={(e) => onChange('daPercent', e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0"
                      className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">10</td>
                  <td>Commutation (%)</td>
                  <td>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.commPercent === '' ? '' : data.commPercent}
                      onChange={(e) => onChange('commPercent', e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0"
                      className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500">11</td>
                  <td>Reason for Exit</td>
                  <td>
                    <select
                      value={data.reason}
                      onChange={(e) => onChange('reason', e.target.value as any)}
                      className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none py-0.5 cursor-pointer"
                    >
                      <option value="Retirement/Resignation">Retirement / Resignation</option>
                      <option value="Death in Service">Death in Service</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div>

          {/* Bank Details */}
          <div className="border-b border-slate-300">
            <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] tracking-wider uppercase px-2.5 py-1">
              Bank Details
            </div>
            <div className="grid grid-cols-2 text-xs">
              <div className="border-r border-b border-slate-300 p-1.5">
                <label htmlFor="bankName" className="block text-[9px] uppercase tracking-wider text-slate-500">Bank Name</label>
                <input
                  id="bankName"
                  type="text"
                  value={data.bankName}
                  onChange={(e) => onChange('bankName', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-b border-slate-300 p-1.5">
                <label htmlFor="branch" className="block text-[9px] uppercase tracking-wider text-slate-500">Branch</label>
                <input
                  id="branch"
                  type="text"
                  value={data.branch}
                  onChange={(e) => onChange('branch', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="border-r border-slate-300 p-1.5">
                <label htmlFor="accNo" className="block text-[9px] uppercase tracking-wider text-slate-500">Account No.</label>
                <input
                  id="accNo"
                  type="text"
                  value={data.accNo}
                  onChange={(e) => onChange('accNo', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>

              <div className="p-1.5">
                <label htmlFor="ifsc" className="block text-[9px] uppercase tracking-wider text-slate-500">IFSC Code</label>
                <input
                  id="ifsc"
                  type="text"
                  value={data.ifsc}
                  onChange={(e) => onChange('ifsc', e.target.value)}
                  className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                />
              </div>
            </div>
          </div>

          {/* Family Composition & Allowances */}
          <div className="border-b border-slate-300">
            <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] tracking-wider uppercase px-2.5 py-1">
              Family Composition &amp; Allowances
            </div>
            <table className="fam-table w-full">
              <thead>
                <tr>
                  <th className="w-6 text-center">Srl</th>
                  <th>Name</th>
                  <th>Relation</th>
                  <th>DOB</th>
                  <th className="w-6 no-print"></th>
                </tr>
              </thead>
              <tbody>
                {data.family.map((fam, idx) => (
                  <tr key={fam.id}>
                    <td className="font-plex-mono text-[10px] text-center text-slate-500">{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={fam.name}
                        onChange={(e) => onUpdateFamilyMember(fam.id, 'name', e.target.value)}
                        className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={fam.relation}
                        onChange={(e) => onUpdateFamilyMember(fam.id, 'relation', e.target.value)}
                        className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none"
                      />
                    </td>
                    <td>
                      <ManualDateInput
                        value={fam.dob}
                        onChange={(val) => onUpdateFamilyMember(fam.id, 'dob', val)}
                        placeholder="DD-MM-YYYY"
                        title="Family member DOB"
                      />
                    </td>
                    <td className="text-center no-print p-0">
                      {data.family.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveFamilyMember(fam.id)}
                          className="text-[#8a2b2b] hover:text-red-800 p-1 cursor-pointer"
                          title="Remove family member"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-1.5 no-print bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={onAddFamilyMember}
                className="inline-flex items-center gap-1 font-plex-sans text-[9.5px] font-medium text-[#1f3350] hover:bg-slate-200 border border-dashed border-[#1f3350] rounded-xs px-2 py-0.5 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Family Member</span>
              </button>
            </div>

            {/* Quarter & Medical Option */}
            <div className="grid grid-cols-2 border-t border-slate-300 text-xs">
              <div className="border-r border-slate-300 p-1.5">
                <label htmlFor="quarter" className="block text-[9px] uppercase tracking-wider text-slate-500">Railway Quarter</label>
                <select
                  id="quarter"
                  value={data.quarter}
                  onChange={(e) => onChange('quarter', e.target.value as any)}
                  className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none py-0.5"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="p-1.5">
                <label htmlFor="medical" className="block text-[9px] uppercase tracking-wider text-slate-500">Medical Allowance Option</label>
                <select
                  id="medical"
                  value={data.medical}
                  onChange={(e) => onChange('medical', e.target.value as any)}
                  className="w-full font-plex-mono text-[11px] bg-transparent focus:outline-none py-0.5"
                >
                  <option value="Not Opted">Not Opted</option>
                  <option value="Opted">Opted</option>
                </select>
              </div>

              {data.quarter === 'Yes' && (
                <div className="col-span-2 border-t border-slate-300 p-1.5 bg-blue-50/30">
                  <label htmlFor="quarterDetail" className="block text-[9px] uppercase tracking-wider text-slate-500">Quarter No. &amp; Address</label>
                  <input
                    id="quarterDetail"
                    type="text"
                    value={data.quarterDetail}
                    onChange={(e) => onChange('quarterDetail', e.target.value)}
                    placeholder="e.g. Qtr No. 244/B, Traffic Colony, Kharagpur"
                    className="w-full font-plex-mono text-[11.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Calculation Block */}
          <div className="border-b border-slate-300">
            <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] tracking-wider uppercase px-2.5 py-1 flex items-center justify-between">
              <span>Calculation</span>
              <span className="font-plex-mono text-[9.5px] font-normal text-slate-200">
                Staff Settlement
              </span>
            </div>
            <table className="calc-table w-full">
              <tbody>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">1</td>
                  <td>Pension</td>
                  <td className="readout-cell text-right">{formatINR(pension)}</td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">2</td>
                  <td>Commutation</td>
                  <td className="readout-cell text-right">{formatINR(commutation)}</td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">3</td>
                  <td>Commutation Value</td>
                  <td className="readout-cell text-right">{formatINR(commValue)}</td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">4</td>
                  <td>Reduced Pension</td>
                  <td className="readout-cell text-right">{formatINR(reducedPension)}</td>
                </tr>

                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">5</td>
                  <td>DCRG</td>
                  <td className="readout-cell text-right">{formatINR(dcrg.finalPayable)}</td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">6</td>
                  <td>Leave Salary</td>
                  <td className="readout-cell text-right">{formatINR(leaveSalary)}</td>
                </tr>
                <tr>
                  <td className="font-plex-mono text-[10px] text-center text-slate-500 w-5">7</td>
                  <td>GIS (Group – "D" 1990, Group – "C" 2003)</td>
                  <td className="readout-cell text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-plex-mono text-[11px] font-bold text-[#122238] select-none">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.gis === '' ? '' : data.gis}
                        onChange={(e) => onChange('gis', e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="0"
                        style={{
                          width: `${Math.max(1, String(data.gis === '' ? '' : data.gis).length)}ch`,
                        }}
                        className="ml-1 text-right font-plex-mono font-bold text-[#122238] bg-transparent focus:outline-none p-0 border-b border-transparent focus:border-slate-400"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Signature Row - Only Dealer at left side & Asst. Personnel Officer at right side */}
      <div className="grid grid-cols-2 mt-6 sm:mt-8 print:mt-3 px-6 print:px-4">
        <div>
          <div className="border-t border-slate-800 pt-1.5 w-3/4 sm:w-3/5 text-[10.5px] print:text-[9px] text-slate-700 font-semibold">
            Signature of Dealer
          </div>
        </div>
        <div className="flex justify-end">
          <div className="border-t border-slate-800 pt-1.5 w-3/4 sm:w-3/5 text-[10.5px] print:text-[9px] text-slate-700 font-semibold text-right">
            Asst. Personnel Officer
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-right font-source-serif italic text-[10.5px] print:text-[8px] text-slate-500 px-6 print:px-4 pt-2 print:pt-0.5 pb-3 print:pb-0.5 m-0">
        Prepared by Biswajyoti Roy Sarkar
      </p>
    </div>
  );
};
