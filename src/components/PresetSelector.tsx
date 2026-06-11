import React from 'react';

export type Preset = {
  id: string;
  name: string;
  width: number;
  height: number;
  maxKb: number;
  type: 'photo' | 'signature' | 'custom';
};

export const PRESETS: Preset[] = [
  { id: 'ssc', name: 'SSC Photo', width: 200, height: 230, maxKb: 50, type: 'photo' },
  { id: 'upsc_photo', name: 'UPSC Photo', width: 300, height: 300, maxKb: 40, type: 'photo' },
  { id: 'upsc_sig', name: 'UPSC Signature', width: 300, height: 80, maxKb: 20, type: 'signature' },
  { id: 'rrb', name: 'Railway RRB Photo', width: 200, height: 230, maxKb: 100, type: 'photo' },
  { id: 'ibps', name: 'IBPS / Bank PO Photo', width: 200, height: 200, maxKb: 50, type: 'photo' },
  { id: 'nta', name: 'NTA / JEE / NEET Photo', width: 200, height: 230, maxKb: 100, type: 'photo' },
  { id: 'custom', name: 'Custom Size', width: 200, height: 200, maxKb: 50, type: 'custom' },
];

type PresetSelectorProps = {
  activePreset: Preset;
  onSelectPreset: (preset: Preset) => void;
};

export default function PresetSelector({ activePreset, onSelectPreset }: PresetSelectorProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label className="mb-2 block font-heading text-lg font-semibold text-navy-900">
        1. Select Exam Preset
      </label>
      <select
        className="w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20"
        value={activePreset.id}
        onChange={(e) => {
          const p = PRESETS.find((p) => p.id === e.target.value);
          if (p) onSelectPreset(p);
        }}
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.width}x{p.height}px, &le;{p.maxKb}KB)
          </option>
        ))}
      </select>
    </div>
  );
}
