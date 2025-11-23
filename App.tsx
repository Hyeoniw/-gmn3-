import React, { useState, useCallback, useEffect } from 'react';
import DropZone from './components/DropZone';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import { ProcessorSettings, ImageDimensions } from './types';
import { Layers, Sparkles } from 'lucide-react';

const DEFAULT_SETTINGS: ProcessorSettings = {
  tileSize: 40,
  horizontalShift: 20,
  verticalShift: 20,
  scatterIntensity: 0,
  opacity: 100,
  pattern: 'plain',
  seed: 123
};

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProcessorSettings>(DEFAULT_SETTINGS);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const src = e.target.result as string;
        setSourceImage(src);
        
        // Get dimensions
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setDimensions({ width: img.width, height: img.height });
            // Set intelligent defaults based on image size
            setSettings({
                ...DEFAULT_SETTINGS,
                tileSize: Math.floor(Math.min(img.width, img.height) / 10),
                horizontalShift: Math.floor(img.width / 20),
                verticalShift: Math.floor(img.height / 20)
            });
        };
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => {
    setSourceImage(null);
    setDimensions(null);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] text-slate-100 selection:bg-cyan-500/30 flex flex-col">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-cyan-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Mosaic Weaver
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Pixel-Perfect Rearrangement Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>NO PIXELS HARMED</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8 flex flex-col">
        {!sourceImage ? (
          <div className="max-w-2xl mx-auto my-auto animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Deconstruct. Shift. Rebuild.</h2>
              <p className="text-lg text-slate-400">
                Transform your photos into woven digital tapestries using non-destructive pixel rearrangement.
              </p>
            </div>
            <DropZone onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start h-full animate-in slide-in-from-bottom-4 duration-500">
            {/* Left: Controls */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-6">
              <ControlPanel 
                settings={settings} 
                setSettings={setSettings} 
                disabled={false}
                imageDimensions={dimensions}
              />
              
              <div className="hidden lg:block p-5 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-slate-400 backdrop-blur-sm">
                <p className="mb-3 font-semibold text-slate-300 flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
                    Visualization Logic
                </p>
                <ul className="space-y-2 opacity-80 text-xs leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-cyan-500">•</span>
                    <span>Image acts as a toroidal surface (wraps continuously).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Shift algorithms displace pixels without deletion.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    <span>Scatter applies deterministic chaos theory.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex-1 w-full min-w-0 h-[calc(100vh-10rem)] min-h-[500px]">
              <PreviewArea 
                originalSrc={sourceImage}
                settings={settings}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;