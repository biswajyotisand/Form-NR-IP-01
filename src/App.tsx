import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Calculator, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  LayoutList,
  Layers,
  HelpCircle,
  ExternalLink,
  Download
} from 'lucide-react';
import { IPassFormData, FamilyMember } from './types';
import { calculateAll, getCurrentMonthYear } from './utils/calculations';
import { generateStandaloneHtml } from './utils/generateHtml';
import { IPassSheet } from './components/IPassSheet';
import { DcrgCalculatorCard } from './components/DcrgCalculatorCard';
import { DcrgModal } from './components/DcrgModal';

const INITIAL_DATA: IPassFormData = {
  month: getCurrentMonthYear(),
  empName: 'A. K. Mukherjee',
  designation: 'Sr. Technician (Mechanical)',
  fatherName: 'Late B. N. Mukherjee',
  buNo: '07-024',
  pfNo: '50708234561',
  tNo: '4125',
  address: 'Qtr No. 412/A, South Colony, Kharagpur, Paschim Medinipur, WB - 721301',
  idMarks: 'A mole on the right side of neck',

  dob: '15-08-1966',
  dor: '31-08-2026',
  doa: '10-06-1993',
  nqY: 0,
  nqM: 0,
  nqD: 0,
  basicPay: 60000,
  payBand: 'Level-6 (GP 4200)',
  lap: 280,
  lhap: 120,
  daPercent: 50,
  commPercent: 40,
  reason: 'Retirement/Resignation',

  bankName: 'State Bank of India',
  branch: 'Kharagpur Main',
  accNo: '30294812345',
  ifsc: 'SBIN0000114',

  family: [
    { id: '1', name: 'Smt. Anjali Mukherjee', relation: 'Wife', dob: '12-04-1970' },
    { id: '2', name: 'Sourav Mukherjee', relation: 'Son', dob: '20-11-1998' },
  ],
  quarter: 'Yes',
  quarterDetail: 'Qtr No. 412/A, South Colony, Kharagpur',
  medical: 'Not Opted',

  gis: 0,
};

const BLANK_DATA: IPassFormData = {
  month: getCurrentMonthYear(),
  empName: '',
  designation: '',
  fatherName: '',
  buNo: '',
  pfNo: '',
  tNo: '',
  address: '',
  idMarks: '',

  dob: '',
  dor: '',
  doa: '',
  nqY: '',
  nqM: '',
  nqD: '',
  basicPay: '',
  payBand: '',
  lap: '',
  lhap: '',
  daPercent: '',
  commPercent: '',
  reason: 'Retirement/Resignation',

  bankName: '',
  branch: '',
  accNo: '',
  ifsc: '',

  family: [
    { id: '1', name: '', relation: '', dob: '' },
  ],
  quarter: 'No',
  quarterDetail: '',
  medical: 'Not Opted',

  gis: 0,
};

export default function App() {
  const [formData, setFormData] = useState<IPassFormData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'sheet' | 'dcrg' | 'both'>('sheet');
  const [isDcrgModalOpen, setIsDcrgModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Calculate settlement figures in real time
  const calculations = useMemo(() => calculateAll(formData), [formData]);

  const handleFieldChange = <K extends keyof IPassFormData>(field: K, value: IPassFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      family: [
        ...prev.family,
        {
          id: Date.now().toString(),
          name: '',
          relation: '',
          dob: '',
        },
      ],
    }));
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFormData((prev) => {
      if (prev.family.length <= 1) return prev;
      return {
        ...prev,
        family: prev.family.filter((f) => f.id !== id),
      };
    });
  };

  const handleUpdateFamilyMember = (id: string, field: keyof FamilyMember, val: string) => {
    setFormData((prev) => ({
      ...prev,
      family: prev.family.map((f) => (f.id === id ? { ...f, [field]: val } : f)),
    }));
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    setFormData(BLANK_DATA);
    setIsResetConfirmOpen(false);
  };

  const handleLoadSample = () => {
    setFormData(INITIAL_DATA);
  };

  const handleDownloadHtml = () => {
    const rawName = formData.empName?.trim() || 'Employee';
    const sanitizedName = rawName.replace(/\s+/g, '_').replace(/[/\\?%*:|"<>]/g, '');
    const fileName = `NR_IP_01_Settlement_Sheet_${sanitizedName}.html`;

    const htmlContent = generateStandaloneHtml(formData, calculations);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = (view: 'sheet' | 'dcrg') => {
    if (view === 'sheet') {
      setActiveTab('sheet');
    } else {
      setActiveTab('dcrg');
    }
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn('Browser print blocked in iframe sandbox:', err);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-plex-sans text-slate-800">
      {/* Top App Bar (no-print) */}
      <header className="no-print bg-[#122238] text-white border-b border-slate-700 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-serif font-bold text-white shadow-xs">
              IR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-wide">
                  NR Case &amp; DCRG Combined System
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 font-mono border border-slate-600">
                  Form NR-IP-01 + DCRG
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Settlement Section · Kharagpur Workshop · Indian Railways
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* View switcher */}
            <div className="bg-slate-800/80 p-0.5 rounded border border-slate-700 flex items-center">
              <button
                type="button"
                onClick={() => setActiveTab('sheet')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-medium transition cursor-pointer ${
                  activeTab === 'sheet'
                    ? 'bg-[#1f3350] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Full Form NR-IP-01 Data Sheet"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">I-Pass Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dcrg')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-medium transition cursor-pointer ${
                  activeTab === 'dcrg'
                    ? 'bg-[#1f3350] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="DCRG Calculator Tool (File 2)"
              >
                <Calculator className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">DCRG Tool</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-medium transition cursor-pointer ${
                  activeTab === 'both'
                    ? 'bg-[#1f3350] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Side-by-side comparative layout"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Combined View</span>
              </button>
            </div>

            {/* Load Sample Case */}
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-2.5 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded flex items-center gap-1 font-medium transition cursor-pointer"
              title="Load realistic sample data"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">Sample Case</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 rounded flex items-center gap-1 font-medium transition cursor-pointer"
              title="Clear all fields"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Download Standalone HTML button (in between Reset & Print) */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              title="Download 100% Standalone & Offline Ready HTML file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download HTML</span>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={() => handlePrint(activeTab === 'dcrg' ? 'dcrg' : 'sheet')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              title="Print to single A4 page"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Synchronized Banner Information (no-print) */}
      <div className="no-print bg-slate-200/80 border-b border-slate-300 text-slate-700 text-xs px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#122238]">Active Case Data:</span>
            <span>{formData.empName || 'Unnamed Employee'}</span>
            <span className="text-slate-400">·</span>
            <span>Basic: ₹{Number(formData.basicPay).toLocaleString('en-IN')}</span>
            <span className="text-slate-400">·</span>
            <span>DA: {formData.daPercent}%</span>
            <span className="text-slate-400">·</span>
            <span>Qualifying Service: {calculations.qualService ? `${calculations.qualService.y}Y ${calculations.qualService.m}M` : '—'}</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-500">Row 5 DCRG:</span>
            <span className="font-bold text-[#122238] bg-white px-2 py-0.5 rounded border border-slate-300">
              ₹{Math.round(calculations.dcrg.finalPayable).toLocaleString('en-IN')}
            </span>
            <span className={`text-[11px] font-sans px-1.5 py-0.5 rounded ${
              calculations.dcrg.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {calculations.dcrg.isEligible ? 'Eligible' : 'Not Eligible'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'sheet' && (
          <div className="flex justify-center">
            <IPassSheet
              data={formData}
              onChange={handleFieldChange}
              onAddFamilyMember={handleAddFamilyMember}
              onRemoveFamilyMember={handleRemoveFamilyMember}
              onUpdateFamilyMember={handleUpdateFamilyMember}
              calc={calculations}
              onOpenDcrgModal={() => setIsDcrgModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'dcrg' && (
          <div className="flex justify-center">
            <DcrgCalculatorCard
              data={formData}
              onChange={handleFieldChange}
              dcrg={calculations.dcrg}
              qualService={calculations.qualService}
              onSwitchToSheet={() => setActiveTab('sheet')}
              onPrint={() => handlePrint('dcrg')}
            />
          </div>
        )}

        {activeTab === 'both' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8">
              <div className="no-print mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#1f3350]" />
                <span>Primary Document: Form NR-IP-01</span>
              </div>
              <IPassSheet
                data={formData}
                onChange={handleFieldChange}
                onAddFamilyMember={handleAddFamilyMember}
                onRemoveFamilyMember={handleRemoveFamilyMember}
                onUpdateFamilyMember={handleUpdateFamilyMember}
                calc={calculations}
                onOpenDcrgModal={() => setIsDcrgModalOpen(true)}
              />
            </div>
            <div className="xl:col-span-4 sticky top-16">
              <div className="no-print mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-amber-600" />
                <span>Live DCRG Evaluation Engine</span>
              </div>
              <DcrgCalculatorCard
                data={formData}
                onChange={handleFieldChange}
                dcrg={calculations.dcrg}
                qualService={calculations.qualService}
                onSwitchToSheet={() => setActiveTab('sheet')}
                onPrint={() => handlePrint('dcrg')}
                isEmbedded={true}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Modal for Step-by-Step DCRG Rule Breakdown */}
      <DcrgModal
        isOpen={isDcrgModalOpen}
        onClose={() => setIsDcrgModalOpen(false)}
        data={formData}
        dcrg={calculations.dcrg}
        qualService={calculations.qualService}
      />

      {/* In-App Confirmation Modal for Reset (replaces window.confirm) */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-sm w-full p-5 text-slate-800">
            <h3 className="text-base font-bold text-[#122238] mb-2">Reset Form to Blank?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              This will clear all filled fields in the NR-IP-01 sheet and DCRG calculator to blank. You can re-load the sample case at any time.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer shadow-xs transition"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
