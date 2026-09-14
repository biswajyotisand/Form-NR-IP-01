import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
}) => {
  const { totalService, qualService, hasService, pension, commutation, commValue, reducedPension, dcrg, leaveSalary } = calc;

  const totalServiceText = hasService && totalService
    ? `${totalService.y} Yrs ${totalService.m} Mos ${totalService.d} Days`
    : '—';

  const qualServiceText = hasService && qualService
    ? `${qualService.y} Yrs ${qualService.m} Mos ${qualService.d} Days`
    : '—';

  return (
    <div className="railway-sheet w-full max-w-[960px] mx-auto text-slate-800 bg-white print:max-w-none print:w-full print:m-0 border border-slate-300">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-[#122238] text-[#e7e2d3] font-plex-mono text-[9.5px] print:text-[8px] tracking-wider uppercase px-3.5 py-1.5 print:py-1 border-b border-slate-700">
        <span>Government of India · Ministry of Railways</span>
        <span>Form NR-IP-01</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-4 py-2.5 print:py-1.5 print:px-3 border-b-2 border-[#1f3350] bg-slate-50/50">
        <div>
          <h1 className="font-source-serif font-bold text-lg sm:text-[18px] print:text-[14px] text-[#122238] uppercase tracking-wide m-0">
            NR Case — I-Pass Data Sheet
          </h1>
          <p className="text-[10.5px] print:text-[8.5px] text-slate-500 italic mt-0.5 mb-0">
            Settlement Section, Kharagpur Workshop
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] print:text-[8.5px] text-slate-500 whitespace-nowrap self-stretch sm:self-auto justify-end">
          <label htmlFor="month-input" className="font-semibold text-slate-600">Month</label>
          <input
            id="month-input"
            type="text"
            value={data.month}
            onChange={(e) => onChange('month', e.target.value)}
            placeholder={getCurrentMonthYear()}
            title="Month of Settlement"
            className="font-plex-mono text-[11px] print:text-[9px] px-2 py-0.5 border border-slate-300 rounded-xs w-36 print:w-28 bg-white focus:outline-none focus:border-[#1f3350]"
          />
        </div>
      </div>

      {/* 1. TOP SECTION: Employee Information & Bank Details (Full Width) */}
      <div className="border-b border-slate-300">
        <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] print:text-[8.5px] tracking-wider uppercase px-2.5 py-1 print:py-0.5">
          Employee Information &amp; Bank Details
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 text-xs">
          <div className="border-r border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="empName" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Name</label>
            <input
              id="empName"
              type="text"
              value={data.empName}
              onChange={(e) => onChange('empName', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="border-r md:border-r border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="designation" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Designation</label>
            <input
              id="designation"
              type="text"
              value={data.designation}
              onChange={(e) => onChange('designation', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="border-r border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="fatherName" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Father's Name</label>
            <input
              id="fatherName"
              type="text"
              value={data.fatherName}
              onChange={(e) => onChange('fatherName', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="buNo" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">B.U. No.</label>
            <input
              id="buNo"
              type="text"
              value={data.buNo}
              onChange={(e) => onChange('buNo', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="border-r border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="pfNo" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">PF No. / Emp No.</label>
            <input
              id="pfNo"
              type="text"
              value={data.pfNo}
              onChange={(e) => onChange('pfNo', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="border-r md:border-r border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="tNo" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">T. No.</label>
            <input
              id="tNo"
              type="text"
              value={data.tNo}
              onChange={(e) => onChange('tNo', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="col-span-2 border-b border-slate-300 p-1.5 print:p-1">
            <label htmlFor="address" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Address</label>
            <input
              id="address"
              type="text"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="col-span-2 border-r border-b md:border-b-0 border-slate-300 p-1.5 print:p-1">
            <label htmlFor="idMarks" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Identification Marks</label>
            <input
              id="idMarks"
              type="text"
              value={data.idMarks}
              onChange={(e) => onChange('idMarks', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="border-r border-slate-300 p-1.5 print:p-1">
            <label htmlFor="bankName" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Bank Name</label>
            <input
              id="bankName"
              type="text"
              value={data.bankName}
              onChange={(e) => onChange('bankName', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="p-1.5 print:p-1">
            <label htmlFor="branch" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Branch</label>
            <input
              id="branch"
              type="text"
              value={data.branch}
              onChange={(e) => onChange('branch', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="col-span-2 border-t border-r border-slate-300 p-1.5 print:p-1">
            <label htmlFor="accNo" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Account No.</label>
            <input
              id="accNo"
              type="text"
              value={data.accNo}
              onChange={(e) => onChange('accNo', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>

          <div className="col-span-2 border-t border-slate-300 p-1.5 print:p-1">
            <label htmlFor="ifsc" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">IFSC Code</label>
            <input
              id="ifsc"
              type="text"
              value={data.ifsc}
              onChange={(e) => onChange('ifsc', e.target.value)}
              className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
            />
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: Family Composition & Quarter & Medical Details (Full Width) */}
      <div className="border-b border-slate-300">
        <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] print:text-[8.5px] tracking-wider uppercase px-2.5 py-1 print:py-0.5 flex items-center justify-between">
          <span>Family Composition &amp; Quarter &amp; Medical Details</span>
        </div>
        <table className="fam-table w-full">
          <thead>
            <tr>
              <th className="w-7 text-center">Srl</th>
              <th>Name</th>
              <th>Relation</th>
              <th>DOB</th>
              <th className="w-6 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {data.family.map((fam, idx) => (
              <tr key={fam.id}>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">{idx + 1}</td>
                <td>
                  <input
                    type="text"
                    value={fam.name}
                    onChange={(e) => onUpdateFamilyMember(fam.id, 'name', e.target.value)}
                    className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={fam.relation}
                    onChange={(e) => onUpdateFamilyMember(fam.id, 'relation', e.target.value)}
                    className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={fam.dob}
                    onChange={(e) => onUpdateFamilyMember(fam.id, 'dob', e.target.value)}
                    placeholder="DD-MM-YYYY"
                    className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none"
                  />
                </td>
                <td className="text-center no-print">
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

        <div className="p-1 no-print bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onAddFamilyMember}
            className="inline-flex items-center gap-1 font-plex-sans text-[9px] font-medium text-[#1f3350] hover:bg-slate-200 border border-dashed border-[#1f3350] rounded-xs px-2 py-0.5 cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Add Family Member</span>
          </button>
        </div>

        {/* Quarter & Medical Option */}
        <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 border-t border-slate-300 text-xs">
          <div className="border-r border-slate-300 p-1.5 print:p-1">
            <label htmlFor="quarter" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Railway Quarter</label>
            <select
              id="quarter"
              value={data.quarter}
              onChange={(e) => onChange('quarter', e.target.value as any)}
              className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none py-0.5"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className={`border-r border-slate-300 p-1.5 print:p-1 ${data.quarter === 'Yes' ? 'col-span-1' : 'col-span-3'}`}>
            <label htmlFor="medical" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Medical Allowance Option</label>
            <select
              id="medical"
              value={data.medical}
              onChange={(e) => onChange('medical', e.target.value as any)}
              className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none py-0.5"
            >
              <option value="Not Opted">Not Opted</option>
              <option value="Opted">Opted</option>
            </select>
          </div>

          {data.quarter === 'Yes' && (
            <div className="col-span-2 p-1.5 print:p-1 bg-blue-50/30">
              <label htmlFor="quarterDetail" className="block text-[9px] print:text-[7.5px] uppercase tracking-wider text-slate-500">Quarter No. &amp; Address</label>
              <input
                id="quarterDetail"
                type="text"
                value={data.quarterDetail}
                onChange={(e) => onChange('quarterDetail', e.target.value)}
                placeholder="e.g. Qtr No. 244/B, Traffic Colony, Kharagpur"
                className="w-full font-plex-mono text-[11.5px] print:text-[8.5px] bg-transparent focus:outline-none border-b border-transparent focus:border-[#1f3350] py-0.5"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. BELOW SECTION: 2 Columns - Service Details (LEFT) & Calculation (RIGHT) */}
      <div className="sheet-grid-container grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 border-b border-slate-300">
        {/* LEFT SIDE: Service Details */}
        <div className="border-b md:border-b-0 md:border-r border-slate-300 print:border-b-0 print:border-r">
          <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] print:text-[8.5px] tracking-wider uppercase px-2.5 py-1 print:py-0.5">
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
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">1</td>
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
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">2</td>
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
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">3</td>
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

              {/* Non-Qualifying Service */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">4</td>
                <td>Non-Qualifying Service</td>
                <td>
                  <div className="flex items-center gap-1.5 font-plex-mono text-[11px] print:text-[8.5px]">
                    <span className="flex items-center gap-0.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.nqY === 0 ? '0' : (data.nqY || '')}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          onChange('nqY', v === '' ? 0 : parseInt(v, 10));
                        }}
                        className="w-7 text-center border-b border-slate-300 focus:outline-none focus:border-[#1f3350]"
                      />
                      <span className="text-slate-500 text-[10px] print:text-[7.5px]">Y</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.nqM === 0 ? '0' : (data.nqM || '')}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          onChange('nqM', v === '' ? 0 : parseInt(v, 10));
                        }}
                        className="w-7 text-center border-b border-slate-300 focus:outline-none focus:border-[#1f3350]"
                      />
                      <span className="text-slate-500 text-[10px] print:text-[7.5px]">M</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.nqD === 0 ? '0' : (data.nqD || '')}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          onChange('nqD', v === '' ? 0 : parseInt(v, 10));
                        }}
                        className="w-7 text-center border-b border-slate-300 focus:outline-none focus:border-[#1f3350]"
                      />
                      <span className="text-slate-500 text-[10px] print:text-[7.5px]">D</span>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Total Service */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">5</td>
                <td>Total Service</td>
                <td className="readout-cell font-plex-mono text-[11px] print:text-[8.5px]">
                  {totalServiceText}
                </td>
              </tr>

              {/* Qualifying Service */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">6</td>
                <td>Qualifying Service</td>
                <td className="readout-cell font-plex-mono text-[11px] print:text-[8.5px] font-semibold text-[#122238]">
                  {qualServiceText}
                </td>
              </tr>

              {/* Basic Pay */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">7</td>
                <td>Basic Pay (Last)</td>
                <td>
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-1">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data.basicPay === 0 ? '0' : (data.basicPay || '')}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        onChange('basicPay', val === '' ? 0 : parseInt(val, 10));
                      }}
                      className="w-full font-plex-mono font-bold text-[#122238] bg-transparent focus:outline-none"
                    />
                  </div>
                </td>
              </tr>

              {/* Pay Band / Level */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">8</td>
                <td>Pay Band / Level</td>
                <td>
                  <input
                    type="text"
                    value={data.payBand}
                    onChange={(e) => onChange('payBand', e.target.value)}
                    className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none"
                  />
                </td>
              </tr>

              {/* Leave LAP / LHAP */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">9</td>
                <td>Leave at Credit</td>
                <td>
                  <div className="flex items-center gap-3 font-plex-mono text-[11px] print:text-[8.5px]">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 text-[10px] print:text-[7.5px]">LAP:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.lap === 0 ? '' : (data.lap || '')}
                        placeholder="0"
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          onChange('lap', v === '' ? 0 : parseInt(v, 10));
                        }}
                        className="w-12 text-center border-b border-slate-300 focus:outline-none focus:border-[#1f3350]"
                      />
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 text-[10px] print:text-[7.5px]">LHAP:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={data.lhap === 0 ? '' : (data.lhap || '')}
                        placeholder="0"
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          onChange('lhap', v === '' ? 0 : parseInt(v, 10));
                        }}
                        className="w-12 text-center border-b border-slate-300 focus:outline-none focus:border-[#1f3350]"
                      />
                    </span>
                  </div>
                </td>
              </tr>

              {/* Dearness Allowance */}
              {/* DA % */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">10</td>
                <td>Dearness Allowance (DA)</td>
                <td>
                  <div className="flex items-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.daPercent === 0 ? '' : (data.daPercent || '')}
                      placeholder="0"
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        onChange('daPercent', val === '' ? 0 : parseFloat(val));
                      }}
                      className="w-14 font-plex-mono font-semibold bg-transparent focus:outline-none"
                    />
                    <span className="text-slate-500 ml-1">%</span>
                  </div>
                </td>
              </tr>

              {/* Commutation % */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">11</td>
                <td>Commutation %</td>
                <td>
                  <div className="flex items-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.commPercent === 0 ? '' : (data.commPercent || '')}
                      placeholder="0"
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        onChange('commPercent', val === '' ? 0 : parseFloat(val));
                      }}
                      className="w-14 font-plex-mono font-semibold bg-transparent focus:outline-none"
                    />
                    <span className="text-slate-500 ml-1">%</span>
                  </div>
                </td>
              </tr>

              {/* Reason */}
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500">12</td>
                <td>Reason for Cessation</td>
                <td>
                  <select
                    value={data.reason}
                    onChange={(e) => onChange('reason', e.target.value as 'Retirement/Resignation' | 'Death in Service')}
                    className="w-full font-plex-mono text-[11px] print:text-[8.5px] bg-transparent focus:outline-none py-0.5"
                  >
                    <option value="Retirement/Resignation">Retirement/Resignation</option>
                    <option value="Death in Service">Death in Service</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: Calculation Block */}
        <div>
          <div className="bg-[#1f3350] text-white font-source-serif font-semibold text-[10.5px] print:text-[8.5px] tracking-wider uppercase px-2.5 py-1 print:py-0.5 flex items-center justify-between">
            <span>Calculation</span>
            <span className="font-plex-mono text-[9.5px] print:text-[8px] font-normal text-slate-200">
              Settlement Section
            </span>
          </div>
          <table className="calc-table w-full">
            <tbody>
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">1</td>
                <td>Pension</td>
                <td className="readout-cell text-right">{formatINR(pension)}</td>
              </tr>
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">2</td>
                <td>Commutation</td>
                <td className="readout-cell text-right">{formatINR(commutation)}</td>
              </tr>
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">3</td>
                <td>Commutation Value</td>
                <td className="readout-cell text-right">{formatINR(commValue)}</td>
              </tr>
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">4</td>
                <td>Reduced Pension</td>
                <td className="readout-cell text-right">{formatINR(reducedPension)}</td>
              </tr>

              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">5</td>
                <td>DCRG</td>
                <td className="readout-cell text-right">{formatINR(dcrg.finalPayable)}</td>
              </tr>
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">6</td>
                <td>Leave Salary</td>
                <td className="readout-cell text-right">{formatINR(leaveSalary)}</td>
              </tr>
              <tr>
                <td className="font-plex-mono text-[10px] print:text-[8px] text-center text-slate-500 w-5">7</td>
                <td>GIS (Group – "D" 1990, Group – "C" 2003)</td>
                <td className="readout-cell text-right">
                  <div className="flex items-center justify-end font-plex-mono">
                    {data.gis !== 0 && data.gis !== '' && (
                      <span className="text-slate-500 text-[10px] print:text-[8.5px] mr-1 select-none">₹</span>
                    )}
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data.gis === 0 ? '' : (data.gis || '')}
                      placeholder="0"
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        onChange('gis', v === '' ? 0 : parseInt(v, 10));
                      }}
                      className="w-16 text-right font-plex-mono font-semibold text-[#122238] bg-transparent focus:outline-none p-0 border-b border-transparent focus:border-slate-400 placeholder:text-slate-400"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BOTTOM: Signature Row - Only Dealer at left side & Asst. Personnel Officer at right side */}
      <div className="grid grid-cols-2 mt-5 sm:mt-6 print:mt-4 px-6 print:px-4">
        <div>
          <div className="border-t border-slate-800 pt-1.5 w-3/4 sm:w-3/5 text-[10.5px] print:text-[8.5px] text-slate-700 font-semibold">
            Signature of Dealer
          </div>
        </div>
        <div className="flex justify-end">
          <div className="border-t border-slate-800 pt-1.5 w-3/4 sm:w-3/5 text-[10.5px] print:text-[8.5px] text-slate-700 font-semibold text-right">
            Asst. Personnel Officer
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-right font-source-serif italic text-[10.5px] print:text-[8px] text-slate-500 px-6 print:px-4 pt-1.5 print:pt-0.5 pb-2.5 print:pb-0.5 m-0">
        Prepared by Biswajyoti Roy Sarkar
      </p>
    </div>
  );
};
