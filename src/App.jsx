import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wand2, 
  Upload, 
  Copy, 
  Code2, 
  FileType2, 
  Download, 
  Eye, 
  Plus, 
  Minus, 
  Sliders, 
  Palette,
  Sun,
  Moon,
  Monitor,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { 
  extractColors, 
  replaceColor, 
  optimizeSvgWithOptions, 
  convertToReactComponent, 
  convertToVueComponent,
  convertToSvelteComponent,
  convertToCssDataUri 
} from './utils/svgProcessor';
import Footer from './components/Footer';

function CustomBrandLogo({ isLight }) {
  return (
    <svg className="w-8 h-8 rounded-xl shadow-xs transition-transform hover:scale-105" viewBox="0 0 120 120">
      <rect fill={isLight ? "#0f172a" : "#6366f1"} x="-.26" y="-.73" width="120" height="120" rx="30.16" ry="30.16"/>
      <g fill="#ffffff">
        <polygon points="49.26 75.82 34.04 84.6 34.04 74.38 20.83 92.11 34.49 100 51.33 90.28 62.29 36.46 49.26 53.95 49.26 75.82"/>
        <polygon points="89.16 78.03 89.16 85.41 77.67 78.81 77.67 62.68 67.96 49.72 67.96 84.38 98.26 90.18 95.21 86.11 89.16 78.03"/>
        <polygon points="89.16 47.55 89.16 76.53 95.99 85.66 98.5 89.01 88.39 36.74 68.17 48.51 77.67 61.18 77.67 54.24 89.16 47.55"/>
        <polygon points="98.04 91.05 70.05 85.69 88.71 96.41 98.04 91.05"/>
        <polygon points="98.86 86.17 98.86 42.39 96.37 40.96 89.34 36.91 98.86 86.17"/>
        <polygon points="20.61 87.56 33.86 18.71 20.61 26.36 20.61 87.56"/>
        <polygon points="34.04 72.88 34.04 33.74 49.26 42.64 49.26 52.46 55.17 44.52 62.47 34.72 34.81 18.54 20.97 90.42 34.04 72.88"/>
        <polygon points="62.68 39.03 52.38 89.62 62.68 83.64 62.68 39.03"/>
      </g>
    </svg>
  );
}

const PRESETS = {
  myLogo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect fill="#0f172a" x="-.26" y="-.73" width="120" height="120" rx="30.16" ry="30.16"/><g fill="#ffffff"><polygon points="49.26 75.82 34.04 84.6 34.04 74.38 20.83 92.11 34.49 100 51.33 90.28 62.29 36.46 49.26 53.95 49.26 75.82"/><polygon points="89.16 78.03 89.16 85.41 77.67 78.81 77.67 62.68 67.96 49.72 67.96 84.38 98.26 90.18 95.21 86.11 89.16 78.03"/><polygon points="89.16 47.55 89.16 76.53 95.99 85.66 98.5 89.01 88.39 36.74 68.17 48.51 77.67 61.18 77.67 54.24 89.16 47.55"/><polygon points="98.04 91.05 70.05 85.69 88.71 96.41 98.04 91.05"/><polygon points="98.86 86.17 98.86 42.39 96.37 40.96 89.34 36.91 98.86 86.17"/><polygon points="20.61 87.56 33.86 18.71 20.61 26.36 20.61 87.56"/><polygon points="34.04 72.88 34.04 33.74 49.26 42.64 49.26 52.46 55.17 44.52 62.47 34.72 34.81 18.54 20.97 90.42 34.04 72.88"/><polygon points="62.68 39.03 52.38 89.62 62.68 83.64 62.68 39.03"/></g></svg>`
};

const EXTENDED_PALETTES = [
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Slate', color: '#64748b' },
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#ffffff' }
];

export default function App() {
  const [svgCode, setSvgCode] = useState(PRESETS.myLogo);
  const [currentRawSvg, setCurrentRawSvg] = useState(PRESETS.myLogo);
  
  const [activeTab, setActiveTab] = useState('styles');
  const [viewMode, setViewMode] = useState('canvas');
  const [zoom, setZoom] = useState(100);
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState('dark');

  const [colorOpacities, setColorOpacities] = useState({});

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [opacity, setOpacity] = useState(100);

  const [exportFormat, setExportFormat] = useState('react');
  const [componentName, setComponentName] = useState('IconSvg');
  const [rasterScale, setRasterScale] = useState(2);

  const [cleanOptions, setCleanOptions] = useState({
    removeComments: true,
    removeMetadata: true,
    removeEditorData: true,
    removeEmptyAttrs: true,
    collapseWhitespace: true
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const colors = useMemo(() => extractColors(svgCode), [svgCode]);
  const originalSize = useMemo(() => new Blob([svgCode]).size, [svgCode]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleColorChange = (targetColor, newColor) => {
    setSvgCode(prev => replaceColor(prev, targetColor, newColor));
  };

  const handleSingleColorOpacityChange = (originalColor, alphaVal) => {
    setColorOpacities(prev => ({ ...prev, [originalColor]: alphaVal }));
    
    let baseHex = originalColor.slice(0, 7);
    if (!baseHex.startsWith('#') || baseHex.length < 7) {
      baseHex = '#0f172a';
    }

    const alphaHex = Math.round((alphaVal / 100) * 255).toString(16).padStart(2, '0');
    const newColorWithAlpha = `${baseHex}${alphaHex}`;

    setSvgCode(prevCode => replaceColor(prevCode, originalColor, newColorWithAlpha));
  };

  const applyPaletteColor = (newColor) => {
    if (colors.length > 0) {
      let updated = svgCode;
      colors.forEach(c => {
        updated = replaceColor(updated, c, newColor);
      });
      setSvgCode(updated);
      showToast(`Applied color: ${newColor}`);
    }
  };

  const handleReset = () => {
    setColorOpacities({});
    setSvgCode(currentRawSvg);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setOpacity(100);
    showToast('✨ Colors & styles reset');
  };

  const handleOptimize = () => {
    const optimized = optimizeSvgWithOptions(svgCode, cleanOptions);
    const newSize = new Blob([optimized]).size;
    const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
    setSvgCode(optimized);
    showToast(`✨ Optimized! Savings: ${savings}% (${newSize} B)`);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const loadedCode = event.target.result;
        setSvgCode(loadedCode);
        setCurrentRawSvg(loadedCode);
        setColorOpacities({});
        showToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const loadPreset = (presetKey) => {
    const code = PRESETS[presetKey];
    setSvgCode(code);
    setCurrentRawSvg(code);
    setColorOpacities({});
    showToast('Loaded NPC Logo');
  };

  const generatedCode = useMemo(() => {
    switch (exportFormat) {
      case 'react': return convertToReactComponent(svgCode, componentName);
      case 'vue': return convertToVueComponent(svgCode, componentName);
      case 'svelte': return convertToSvelteComponent(svgCode);
      case 'clean': return optimizeSvgWithOptions(svgCode, cleanOptions);
      case 'datauri': return convertToCssDataUri(svgCode);
      default: return svgCode;
    }
  }, [svgCode, exportFormat, componentName, cleanOptions]);

  const exportRaster = (format = 'png') => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = format === 'ico' ? 64 : 512 * rasterScale;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      
      const mimeType = format === 'ico' ? 'image/x-icon' : `image/${format}`;
      const imgUrl = canvas.toDataURL(mimeType);
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `npc-svg-export.${format}`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${format.toUpperCase()}`);
    };
    img.src = url;
  };

  const isLight = theme === 'light';

  return (
    <div className={`h-screen w-screen flex flex-col font-sans select-none overflow-hidden transition-colors duration-200 ${
      isLight ? 'bg-slate-100 text-slate-800' : theme === 'oled' ? 'bg-black text-white' : 'bg-[#060911] text-slate-100'
    }`}>
      
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-medium tracking-wide flex items-center space-x-2">
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className={`h-16 px-6 flex items-center justify-between shrink-0 z-40 border-b transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : theme === 'oled' ? 'bg-[#050505] border-neutral-800' : 'bg-[#0b0e17]/90 border-slate-800/80'
      }`}>
        <div className="flex items-center space-x-3">
          <CustomBrandLogo isLight={isLight} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight">NPC-Svg-Studio</h1>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                Pro
              </span>
            </div>
            <p className="text-[10px] opacity-60">Open Icon Studio Suite</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className="text-[11px] opacity-60 mr-1">Preset:</span>
            <button 
              onClick={() => loadPreset('myLogo')} 
              className="text-[11px] text-indigo-500 hover:underline font-medium px-1.5"
            >
              NPC Logo
            </button>
          </div>

          <div className={`flex items-center space-x-1 p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/40 border-slate-700/30'
          }`}>
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'canvas' ? (isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-indigo-600 text-white shadow-xs') : 'opacity-60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'code' ? (isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-indigo-600 text-white shadow-xs') : 'opacity-60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code Editor</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`flex items-center p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/40 border-slate-700/30'
          }`}>
            <button onClick={() => setTheme('light')} className={`p-1.5 rounded-lg transition ${theme === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'opacity-60 hover:opacity-100'}`}><Sun className="w-3.5 h-3.5" /></button>
            <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-indigo-600 text-white shadow-xs' : 'opacity-60 hover:opacity-100'}`}><Moon className="w-3.5 h-3.5" /></button>
            <button onClick={() => setTheme('oled')} className={`p-1.5 rounded-lg transition ${theme === 'oled' ? 'bg-indigo-600 text-white shadow-xs' : 'opacity-60 hover:opacity-100'}`}><Monitor className="w-3.5 h-3.5" /></button>
          </div>

          <label className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition cursor-pointer flex items-center space-x-1.5 border shadow-xs ${
            isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800 text-slate-200'
          }`}>
            <Upload className="w-3.5 h-3.5 opacity-70" />
            <span>Upload</span>
            <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleOptimize}
            className={`px-4 py-1.5 text-xs font-medium rounded-xl transition shadow-xs cursor-pointer flex items-center space-x-1.5 ${
              isLight ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Export SVG</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        
        <div className={`flex-1 flex flex-col rounded-2xl border shadow-xs overflow-hidden relative transition-colors duration-200 ${
          isLight ? 'bg-white border-slate-200' : theme === 'oled' ? 'bg-[#050505] border-neutral-800' : 'bg-[#0a0f1d]/60 border-slate-800/80'
        }`}>
          <div className={`h-12 px-6 flex items-center justify-between border-b text-xs font-mono shrink-0 ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/60 text-slate-400'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active SVG</span>
              </span>
              <span>•</span>
              <span>Size: {(originalSize / 1024).toFixed(2)} KB</span>
            </div>

            {viewMode === 'canvas' && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800/40 border-slate-700/30'
              }`}>
                <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-1 rounded opacity-70 hover:opacity-100"><Minus className="w-3 h-3" /></button>
                <span className="text-[11px] font-mono w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1 rounded opacity-70 hover:opacity-100"><Plus className="w-3 h-3" /></button>
              </div>
            )}
          </div>

          <div className={`flex-1 flex items-center justify-center p-8 overflow-auto relative ${
            isLight ? 'bg-slate-50/50 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]' : 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px]'
          }`}>
            {viewMode === 'canvas' ? (
              <div 
                className={`p-12 rounded-2xl border shadow-sm transition-all flex items-center justify-center ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#070b14] border-slate-800/80'
                }`}
                style={{ 
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
                  opacity: opacity / 100,
                  minWidth: '300px', 
                  minHeight: '300px'
                }}
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            ) : (
              <div className="w-full h-full relative p-4 flex flex-col">
                <textarea
                  value={svgCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSvgCode(val);
                    setCurrentRawSvg(val);
                  }}
                  className={`w-full h-full font-mono text-xs p-5 rounded-2xl border leading-relaxed focus:outline-none resize-none shadow-xs ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-900 font-semibold selection:bg-slate-100' 
                      : 'bg-[#03050a] border-indigo-500/30 text-indigo-200 font-mono tracking-wide selection:bg-indigo-600/50'
                  }`}
                  spellCheck="false"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`w-96 flex flex-col rounded-2xl border shadow-xs overflow-hidden shrink-0 transition-colors duration-200 ${
          isLight ? 'bg-white border-slate-200' : theme === 'oled' ? 'bg-[#050505] border-neutral-800' : 'bg-[#0a0f1d]/80 border-slate-800/80'
        }`}>
          
          <div className={`flex border-b p-2 gap-1 ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800/60 bg-slate-900/30'}`}>
            {[
              { id: 'styles', label: 'Styles', icon: Palette },
              { id: 'geometry', label: 'Geometry', icon: Sliders },
              { id: 'clean', label: 'Clean', icon: Wand2 },
              { id: 'export', label: 'Export', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl transition flex items-center justify-center space-x-1.5 ${
                    activeTab === tab.id 
                      ? (isLight ? 'bg-slate-900 text-white shadow-xs' : 'bg-indigo-600 text-white shadow-xs') 
                      : (isLight ? 'text-slate-600 hover:bg-slate-200/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            
            {activeTab === 'styles' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Extracted Colors ({colors.length})
                  </h3>

                  {colors.length === 0 ? (
                    <p className="text-xs opacity-50 italic py-2">No adjustable colors detected.</p>
                  ) : (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {colors.map((color, index) => {
                        const currentAlpha = colorOpacities[color] ?? 100;
                        return (
                          <div key={index} className={`p-3 rounded-xl border space-y-2 ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={color.startsWith('#') && (color.length === 4 || color.length === 7 || color.length === 9) ? color.slice(0, 7) : '#0f172a'}
                                  onChange={(e) => handleColorChange(color, e.target.value)}
                                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                />
                                <span className="text-xs font-mono">{color}</span>
                              </div>
                              <span className="text-[10px] font-mono opacity-60">Opacity: {currentAlpha}%</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={currentAlpha}
                                onChange={(e) => handleSingleColorOpacityChange(color, Number(e.target.value))}
                                className="w-full accent-indigo-600 h-1 cursor-pointer"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={`border-t pt-4 space-y-3 ${isLight ? 'border-slate-100' : 'border-slate-800/40'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Theme Palettes
                    </h3>
                    <button
                      onClick={handleReset}
                      className="px-2.5 py-1 text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg border border-rose-500/20 transition flex items-center space-x-1 cursor-pointer"
                      title="Reset colors for current icon"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {EXTENDED_PALETTES.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPaletteColor(p.color)}
                        className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isLight ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full shadow-xs border border-black/10" style={{ backgroundColor: p.color }}></span>
                        <span className="truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'geometry' && (
              <div className="space-y-5">
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Transformations
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setRotation(r => (r + 90) % 360)} className={`p-2 rounded-xl border flex flex-col items-center justify-center text-[10px] space-y-1 ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-200'}`}>
                      <RotateCw className="w-3.5 h-3.5 opacity-70" />
                      <span>Rotate 90°</span>
                    </button>
                    <button onClick={() => setFlipX(!flipX)} className={`p-2 rounded-xl border flex flex-col items-center justify-center text-[10px] space-y-1 ${flipX ? (isLight ? 'border-slate-900 bg-slate-900 text-white' : 'border-indigo-500 bg-indigo-500/20 text-white') : (isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-200')}`}>
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip X</span>
                    </button>
                    <button onClick={() => setFlipY(!flipY)} className={`p-2 rounded-xl border flex flex-col items-center justify-center text-[10px] space-y-1 ${flipY ? (isLight ? 'border-slate-900 bg-slate-900 text-white' : 'border-indigo-500 bg-indigo-500/20 text-white') : (isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-200')}`}>
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span>Flip Y</span>
                    </button>
                  </div>
                </div>

                <div className={`space-y-2 border-t pt-4 ${isLight ? 'border-slate-100' : 'border-slate-800/40'}`}>
                  <div className="flex justify-between text-xs opacity-70">
                    <span>Global Opacity</span>
                    <span className="font-mono">{opacity}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </div>
              </div>
            )}

            {activeTab === 'clean' && (
              <div className="space-y-4">
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  SVGO Rules
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'removeComments', label: 'XML Comments' },
                    { key: 'removeMetadata', label: 'Metadata & Doctype' },
                    { key: 'removeEditorData', label: 'Figma / Sketch Markup' },
                    { key: 'removeEmptyAttrs', label: 'Empty Attributes' },
                    { key: 'collapseWhitespace', label: 'Minify Code' }
                  ].map(({ key, label }) => (
                    <label key={key} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                      isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900/60 text-slate-300'
                    }`}>
                      <span className="text-xs">{label}</span>
                      <input
                        type="checkbox"
                        checked={cleanOptions[key]}
                        onChange={(e) => setCleanOptions({ ...cleanOptions, [key]: e.target.checked })}
                        className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleOptimize}
                  className={`w-full py-3 text-xs font-medium rounded-xl text-white transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                    isLight ? 'bg-slate-900 hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Execute SVGO Optimization</span>
                </button>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-5">
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Target Code Format
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'react', label: 'React Component' },
                      { id: 'vue', label: 'Vue 3 Component' },
                      { id: 'svelte', label: 'Svelte' },
                      { id: 'clean', label: 'Clean SVG' },
                      { id: 'datauri', label: 'Data URI' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setExportFormat(item.id)}
                        className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          exportFormat === item.id 
                            ? (isLight ? 'border-slate-900 bg-slate-900 text-white shadow-xs' : 'border-indigo-500 bg-indigo-600 text-white shadow-xs') 
                            : (isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300')
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(exportFormat === 'react' || exportFormat === 'vue') && (
                  <div>
                    <label className="text-[10px] opacity-60 block mb-1">Component Name</label>
                    <input
                      type="text"
                      value={componentName}
                      onChange={e => setComponentName(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono ${
                        isLight ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-slate-800 bg-slate-900 text-slate-200'
                      }`}
                    />
                  </div>
                )}

                <div className="relative">
                  <textarea
                    readOnly
                    value={generatedCode}
                    className={`w-full h-28 font-mono text-[11px] p-3 rounded-xl border resize-none focus:outline-none ${
                      isLight ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-slate-800 bg-[#03050a] text-indigo-300'
                    }`}
                  />
                  <button
                    onClick={() => copyToClipboard(generatedCode, exportFormat.toUpperCase())}
                    className={`absolute top-2 right-2 px-2 py-1 text-white rounded-lg text-[10px] font-medium shadow-xs cursor-pointer ${
                      isLight ? 'bg-slate-900 hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    Copy
                  </button>
                </div>

                <div className={`border-t pt-4 space-y-3 ${isLight ? 'border-slate-100' : 'border-slate-800/40'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Raster Image Export (PNG / WebP / ICO)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-60">Scale:</span>
                    {[1, 2, 4, 8].map(s => (
                      <button
                        key={s}
                        onClick={() => setRasterScale(s)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-mono border transition cursor-pointer ${
                          rasterScale === s 
                            ? (isLight ? 'bg-slate-900 text-white border-slate-900' : 'bg-indigo-600 text-white border-indigo-500') 
                            : (isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300')
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => exportRaster('png')}
                      className={`py-2 text-white text-xs font-medium rounded-xl transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer ${
                        isLight ? 'bg-slate-900 hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => exportRaster('webp')}
                      className={`py-2 text-xs font-medium rounded-xl transition flex items-center justify-center space-x-1 border shadow-xs cursor-pointer ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>WebP</span>
                    </button>
                    <button
                      onClick={() => exportRaster('ico')}
                      className={`py-2 text-xs font-medium rounded-xl transition flex items-center justify-center space-x-1 border shadow-xs cursor-pointer ${
                        isLight ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>ICO</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* Global International Footer Component */}
    <Footer theme={theme} />
    </div>
  );
}
