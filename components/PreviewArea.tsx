import React, { useEffect, useRef } from 'react';
import { Download, X, Maximize2 } from 'lucide-react';
import { ProcessorSettings } from '../types';
import { renderWeave } from '../utils/imageProcessing';

interface PreviewAreaProps {
  originalSrc: string | null;
  settings: ProcessorSettings;
  onReset: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ originalSrc, settings, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // We keep a "current" state for animation interpolation
  const currentSettingsRef = useRef<ProcessorSettings>({ ...settings });
  
  // Persistent resources
  const imageRef = useRef<HTMLImageElement | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize helper canvas once
  useEffect(() => {
    tempCanvasRef.current = document.createElement('canvas');
    return () => {
      if (tempCanvasRef.current) tempCanvasRef.current.remove();
    };
  }, []);

  // Load image
  useEffect(() => {
    if (originalSrc) {
      const img = new Image();
      img.src = originalSrc;
      img.onload = () => {
        imageRef.current = img;
        // Reset animation state to "zero" effect to show entrance animation
        currentSettingsRef.current = {
            ...settings,
            horizontalShift: 0,
            verticalShift: 0,
            scatterIntensity: 0
        };
      };
    } else {
      imageRef.current = null;
    }
  }, [originalSrc]); // Only reload if src string changes

  // Animation Loop
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      const tempCanvas = tempCanvasRef.current;

      if (canvas && img && tempCanvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          // LERP logic for smooth transitions
          // We interpolate numeric values. For enums (pattern), we switch instantly.
          const target = settings;
          const current = currentSettingsRef.current;
          
          // Interpolation factor (speed)
          const t = 0.1; 

          // Lerp helper
          const lerp = (a: number, b: number) => a + (b - a) * t;

          // Update current state towards target
          current.horizontalShift = lerp(current.horizontalShift, target.horizontalShift);
          current.verticalShift = lerp(current.verticalShift, target.verticalShift);
          current.scatterIntensity = lerp(current.scatterIntensity, target.scatterIntensity);
          current.tileSize = lerp(current.tileSize, target.tileSize);
          
          // Instant switches
          current.pattern = target.pattern;
          current.seed = target.seed;

          // Apply render
          renderWeave(ctx, img, current, tempCanvas);
        }
      }
      
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [settings, originalSrc]); // Re-bind loop if dependencies change, but mostly relies on refs

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `woven-mosaic-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  if (!originalSrc) {
     return (
        <div className="h-full w-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/30">
            <div className="text-center">
                <Maximize2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Preview will appear here</p>
            </div>
        </div>
     )
  }

  return (
    <div className="w-full flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="font-semibold text-slate-200">Live Render</h3>
        </div>
        <div className="flex gap-2">
           <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-md shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export Image
          </button>
        </div>
      </div>

      <div className="relative group w-full flex-1 min-h-[400px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Canvas is centered and contained */}
        <canvas 
            ref={canvasRef}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl"
        />
        
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400 border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            WEBGL-LIKE CANVAS
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;