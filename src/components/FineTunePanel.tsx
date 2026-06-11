import React from 'react';

type FineTunePanelProps = {
  width: number;
  height: number;
  maxKb: number;
  format: 'image/jpeg' | 'image/png';
  maintainAspect: boolean;
  onChangeWidth: (w: number) => void;
  onChangeHeight: (h: number) => void;
  onChangeMaxKb: (kb: number) => void;
  onChangeFormat: (f: 'image/jpeg' | 'image/png') => void;
  onChangeMaintainAspect: (val: boolean) => void;
};

export default function FineTunePanel({
  width,
  height,
  maxKb,
  format,
  maintainAspect,
  onChangeWidth,
  onChangeHeight,
  onChangeMaxKb,
  onChangeFormat,
  onChangeMaintainAspect,
}: FineTunePanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label className="mb-4 block font-heading text-lg font-semibold text-navy-900">
        2. Fine-tune Requirements
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Width (px)</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            value={width}
            onChange={(e) => onChangeWidth(Math.max(1, Number(e.target.value)))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Height (px)</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            value={height}
            onChange={(e) => onChangeHeight(Math.max(1, Number(e.target.value)))}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={maintainAspect}
            onChange={(e) => onChangeMaintainAspect(e.target.checked)}
            className="rounded text-navy-600 focus:ring-navy-500 cursor-pointer"
          />
          Lock Crop Aspect Ratio
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Max Size (KB)</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            value={maxKb}
            onChange={(e) => onChangeMaxKb(Math.max(1, Number(e.target.value)))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Format</label>
          <select
            className="w-full rounded-md border border-slate-200 p-2 text-sm bg-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            value={format}
            onChange={(e) => onChangeFormat(e.target.value as 'image/jpeg' | 'image/png')}
          >
            <option value="image/jpeg">JPG / JPEG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      </div>
    </div>
  );
}
