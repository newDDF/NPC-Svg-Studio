import React, { useState } from 'react';
import { ShieldCheck, FileText, ExternalLink, X, Lock, Cpu, Server, Globe } from 'lucide-react';

export default function Footer({ theme }) {
  const [modalType, setModalType] = useState(null);
  const isLight = theme === 'light';

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Comprehensive commitment to your data sovereignty and local processing security.',
      sections: [
        {
          icon: Cpu,
          heading: '1. Local-First Processing Architecture',
          text: 'NPC-Svg-Studio operates entirely on a client-side execution model. All vector parsing, geometry transformation, color extraction, and code minification (SVGO) are processed locally inside your browser via JavaScript runtime. Your raw SVG files and project assets are never transmitted, cached, or intercepted by any remote cloud servers.'
        },
        {
          icon: Server,
          heading: '2. Zero Telemetry & Cloud Storage',
          text: 'We do not operate backend databases for file storage. Since no vector files, exported components, or proprietary graphics ever leave your local machine, your design pipeline remains 100% private, isolated, and secure against third-party breaches.'
        },
        {
          icon: ShieldCheck,
          heading: '3. Local Storage & Preferences',
          text: 'The application only utilizes standard browser local storage to preserve your immediate workspace state, theme preference (Light/Dark/OLED), and UI zoom levels. No tracking cookies, behavioral analytics, or fingerprinting scripts are deployed.'
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Professional guidelines and legal framework for utilizing NPC-Svg-Studio.',
      sections: [
        {
          icon: Globe,
          heading: '1. Open-Source Utility & Scope',
          text: 'NPC-Svg-Studio is provided as a high-performance, professional open-source utility designed for developers, UI/UX designers, and software engineers to streamline vector graphic optimization and multi-framework component generation.'
        },
        {
          icon: Lock,
          heading: '2. Intellectual Property & Asset Ownership',
          text: 'You retain absolute ownership and full intellectual property rights over any vector icons, graphics, modified colors, or component code snippets (React, Vue, Svelte, Data URI, ICO) created, processed, or exported through this platform.'
        },
        {
          icon: ShieldCheck,
          heading: '3. Disclaimer of Warranty',
          text: 'The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of the software.'
        }
      ]
    }
  };

  return (
    <>
      {/* Footer Floating Card Container */}
      <footer className="w-full px-6 pb-6 shrink-0 z-30 select-none">
        <div className={`w-full h-14 px-6 rounded-2xl border shadow-xs flex items-center justify-between text-xs transition-colors duration-200 ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-600' 
            : 'bg-[#0a0f1d] border-slate-800/80 text-slate-400'
        }`}>
          
          <div className="flex items-center space-x-1.5 font-medium truncate mr-4">
            <span>© {new Date().getFullYear()} NPC-Svg-Studio. Crafted with precision by</span>
            <a 
              href="https://github.com/newddf/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`font-semibold inline-flex items-center space-x-1 transition-colors underline underline-offset-4 ${
                isLight ? 'text-slate-900 decoration-slate-300 hover:text-indigo-600' : 'text-slate-200 decoration-slate-700 hover:text-indigo-400'
              }`}
            >
              <span>newddf</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
          
          <div className="flex items-center space-x-5 font-medium shrink-0">
            <button 
              onClick={() => setModalType('privacy')} 
              className={`transition-colors cursor-pointer flex items-center space-x-1.5 py-1 px-2 rounded-lg ${
                isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Privacy</span>
            </button>
            <span className={isLight ? 'text-slate-300' : 'text-slate-800'}>/</span>
            <button 
              onClick={() => setModalType('terms')} 
              className={`transition-colors cursor-pointer flex items-center space-x-1.5 py-1 px-2 rounded-lg ${
                isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Terms</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal with Backdrop Blur & Perfect Light/Dark Adaptation */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/30 dark:bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setModalType(null)}
          />

          <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden transition-colors duration-200 ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-900' 
              : 'bg-[#0a0a0a] border-neutral-800 text-white'
          }`}>
            
            <div className={`flex items-start justify-between pb-5 border-b ${
              isLight ? 'border-slate-100' : 'border-neutral-900'
            }`}>
              <div>
                <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {contentMap[modalType].title}
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  {contentMap[modalType].subtitle}
                </p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isLight 
                    ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="py-6 max-h-[55vh] overflow-y-auto space-y-4 pr-1">
              {contentMap[modalType].sections.map((sec, idx) => {
                const IconComponent = sec.icon;
                return (
                  <div key={idx} className={`p-4 rounded-2xl border flex items-start space-x-3.5 ${
                    isLight 
                      ? 'bg-slate-50/80 border-slate-100' 
                      : 'bg-neutral-900/40 border-neutral-800/60'
                  }`}>
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isLight 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'bg-indigo-950/50 text-indigo-400'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {sec.heading}
                      </h4>
                      <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                        {sec.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`pt-4 border-t flex justify-end ${isLight ? 'border-slate-100' : 'border-neutral-900'}`}>
              <button
                onClick={() => setModalType(null)}
                className={`px-6 py-2.5 text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer ${
                  isLight 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                    : 'bg-white hover:bg-slate-200 text-slate-900'
                }`}
              >
                Acknowledge & Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
