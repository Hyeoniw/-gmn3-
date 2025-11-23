import React from 'react';
import { ProcessorSettings, WeavePattern, ImageDimensions } from '../types';
import { Sliders, Grid3X3, MoveHorizontal, MoveVertical, Shuffle, Palette, LayoutGrid } from 'lucide-react';

interface ControlPanelProps {
  settings: ProcessorSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProcessorSettings>>;
  disabled: boolean;
  imageDimensions: ImageDimensions | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, setSettings, disabled, imageDimensions }) => {
  const handleChange = (key: keyof ProcessorSettings, value: number | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleGridPreset = (division: number) => {
    if (!imageDimensions) return;
    const size = Math.floor(Math.min(imageDimensions.width, imageDimensions.height) / division);
    handleChange('tileSize', Math.max(2, size));
  };

  const patterns: { id: WeavePattern; label: string }[] = [
    { id: 'plain', label: 'Plain Weave' },
    { id: 'twill', label: 'Twill' },
    { id: 'satin', label: 'Satin' },
    { id: 'basket', label: 'Basket' },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl h-fit">
      <div className="flex items-center gap-2 mb-6 text-cyan-400">
        <Sliders className="w-5 h-5" />
        <h2 className="text-lg font-bold tracking-wide uppercase">Weave Matrix</h2>
      </div>

      <div className="space-y-8">
        
        {/* Pattern Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Palette className="w-4 h-4 text-purple-500" />
            <span className="font-semibold">Weave Pattern</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {patterns.map((p) => (
              <button
                key={p.id}
                onClick={() => handleChange('pattern', p.id)}
                disabled={disabled}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  settings.pattern === p.id
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Size Presets */}
        <div className="space-y-3">
           <div className="flex justify-between text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-cyan-500" />
              <span>Grid Division</span>
            </div>
            {imageDimensions && (
              <span className="text-xs text-slate-500 font-mono">
                {Math.round(imageDimensions.width / settings.tileSize)}x
                {Math.round(imageDimensions.height / settings.tileSize)}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            {[2, 4, 8, 16, 32].map((div) => (
               <button
                key={div}
                onClick={() => handleGridPreset(div)}
                disabled={disabled || !imageDimensions}
                className="flex-1 py-1.5 text-xs font-mono rounded bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors disabled:opacity-50"
              >
                {div}x
              </button>
            ))}
          </div>
        </div>

        {/* Manual Tile Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-slate-400" />
              <span>Tile Size (px)</span>
            </div>
            <span className="font-mono text-cyan-400">{settings.tileSize}px</span>
          </div>
          <input
            type="range"
            min="2"
            max="200"
            step="1"
            value={settings.tileSize}
            onChange={(e) => handleChange('tileSize', Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
          />
        </div>

        {/* Shifts */}
        <div className="space-y-4 pt-2 border-t border-slate-700/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MoveHorizontal className="w-4 h-4 text-pink-500" />
                <span>Horizontal Shift</span>
              </div>
              <span className="font-mono text-pink-400">{settings.horizontalShift}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.horizontalShift}
              onChange={(e) => handleChange('horizontalShift', Number(e.target.value))}
              disabled={disabled}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MoveVertical className="w-4 h-4 text-emerald-500" />
                <span>Vertical Shift</span>
              </div>
              <span className="font-mono text-emerald-400">{settings.verticalShift}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.verticalShift}
              onChange={(e) => handleChange('verticalShift', Number(e.target.value))}
              disabled={disabled}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
            />
          </div>
        </div>

        {/* Scatter */}
        <div className="space-y-2 pt-2 border-t border-slate-700/50">
          <div className="flex justify-between text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-amber-500" />
              <span>Scatter Intensity</span>
            </div>
            <span className="font-mono text-amber-400">{settings.scatterIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.scatterIntensity}
            onChange={(e) => handleChange('scatterIntensity', Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;