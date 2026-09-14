import React from 'react';
import { Calendar } from 'lucide-react';

interface ManualDateInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  title?: string;
}

export const ManualDateInput: React.FC<ManualDateInputProps> = ({
  id,
  value,
  onChange,
  placeholder = 'DD-MM-YYYY',
  className = '',
  inputClassName = '',
  title = 'Date (type manually or pick)',
}) => {
  // Convert current string to valid YYYY-MM-DD for the native datepicker input if possible
  const getPickerValue = (): string => {
    if (!value) return '';
    const trimmed = String(value).trim();
    // If already YYYY-MM-DD
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10);
      const day = parseInt(ymdMatch[3], 10);
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return trimmed;
      }
    }

    // If DD-MM-YYYY or DD/MM/YYYY
    const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmy) {
      const day = parseInt(dmy[1], 10);
      const month = parseInt(dmy[2], 10);
      const year = parseInt(dmy[3], 10);
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const dStr = String(day).padStart(2, '0');
        const mStr = String(month).padStart(2, '0');
        return `${year}-${mStr}-${dStr}`;
      }
    }
    return '';
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const val = e.target.value; // format: YYYY-MM-DD
      if (val) {
        const parts = val.split('-');
        if (parts.length === 3) {
          // Convert to DD-MM-YYYY for display & manual consistency
          onChange(`${parts[2]}-${parts[1]}-${parts[0]}`);
          return;
        }
      }
      onChange(val);
    } catch (err) {
      console.warn('Date picker change handling warning:', err);
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Primary manual text input */}
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        title={title}
        className={`w-full font-plex-mono text-[11px] bg-transparent focus:outline-none pr-6 ${inputClassName}`}
      />

      {/* Calendar picker button with native date input overlay */}
      <div 
        className="no-print absolute right-0 flex items-center justify-center w-5 h-5 text-slate-400 hover:text-slate-700 cursor-pointer transition overflow-hidden"
        title="Click to pick date from calendar"
      >
        <Calendar className="h-3.5 w-3.5 pointer-events-none" />
        <input
          type="date"
          value={getPickerValue()}
          onChange={handlePickerChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full border-0 p-0 m-0"
          tabIndex={-1}
          aria-label="Calendar date selector"
        />
      </div>
    </div>
  );
};
