
// import React, { useState, useEffect, useRef } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';
// import remarkGfm from 'remark-gfm';

// /* -----------------------------------------
//    Helpers
// ----------------------------------------- */

// function parseRightTriangle(code) {
//   var raw = String(code || '').trim();
//   var out = { a: '', b: '', c: '' };

//   raw.split(/\r?\n/).forEach(function (line) {
//     var m = line.match(/^\s*([abc])\s*[:=]\s*(.*)\s*$/i);
//     if (m) out[m[1].toLowerCase()] = (m[2] || '').trim();
//   });

//   return out;
// }

// /* -----------------------------------------
//    Right Triangle SVG (real geometric diagram)
// ----------------------------------------- */

// function RightTriangleSVG({ a, b, c }) {
//   var labelA = a ? `a = ${a}` : 'a';
//   var labelB = b ? `b = ${b}` : 'b';
//   var labelC = c ? `c = ${c}` : 'c';

//   return (
//     <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 overflow-x-auto">
//       <div className="flex items-center gap-2 mb-3">
//         <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
//         <span className="text-xs text-gray-500 font-medium">Right-angled triangle</span>
//       </div>

//       <svg viewBox="0 0 260 190" className="w-full min-w-[320px] max-w-[520px] mx-auto">
//         {/* Triangle: C(30,150) A(30,30) B(220,150) */}
//         <polyline
//           points="30,150 30,30 220,150 30,150"
//           fill="none"
//           stroke="#e5e7eb"
//           strokeWidth="3"
//         />

//         {/* Right angle marker at C */}
//         <polyline
//           points="30,150 30,130 50,130 50,150"
//           fill="none"
//           stroke="#a5b4fc"
//           strokeWidth="3"
//         />

//         {/* Corner labels */}
//         <text x="18" y="165" fill="#a5b4fc" fontSize="12">C</text>
//         <text x="18" y="26" fill="#a5b4fc" fontSize="12">A</text>
//         <text x="224" y="165" fill="#a5b4fc" fontSize="12">B</text>

//         {/* Side labels */}
//         <text x="120" y="172" fill="#9ca3af" fontSize="12" textAnchor="middle">{labelA}</text>

//         <text
//           x="12"
//           y="95"
//           fill="#9ca3af"
//           fontSize="12"
//           textAnchor="middle"
//           transform="rotate(-90 12 95)"
//         >
//           {labelB}
//         </text>

//         <text
//           x="145"
//           y="70"
//           fill="#9ca3af"
//           fontSize="12"
//           textAnchor="middle"
//           transform="rotate(35 145 70)"
//         >
//           {labelC}
//         </text>

//         <text x="58" y="145" fill="#c7d2fe" fontSize="12">90°</text>
//       </svg>
//     </div>
//   );
// }


// function GeomDiagram({ code, streaming }) {
//   if (streaming) {
//     return (
//       <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
//         {code}
//       </pre>
//     );
//   }

//   let spec = null;
//   try {
//     spec = JSON.parse(String(code || ""));
//   } catch (e) {
//     return (
//       <div className="text-xs text-red-400">
//         Invalid geom JSON
//         <pre className="mt-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
//       </div>
//     );
//   }

//   if (!spec || !spec.type) {
//     return <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>;
//   }

//   switch (spec.type) {
//     case "circle":
//       return <CircleSVG center={spec.center} r={spec.r} />;
//     case "angle":
//       return <AngleSVG vertex={spec.vertex} ray1={spec.ray1} ray2={spec.ray2} measure={spec.measure} />;
//     case "coordinatePlane":
//       return <CoordinatePlaneSVG xRange={spec.xRange} yRange={spec.yRange} points={spec.points} />;
//     case "rectangle":
//   return (
//     <RectangleSVG
//       length={spec.length}
//       width={spec.width}
//       title={spec.title || "Rectangle"}
//       showRightAngles={spec.showRightAngles !== false}
//     />
//   );
//     default:
//       return (
//         <div className="text-xs text-red-400">
//           Unknown geom type: {String(spec.type)}
//           <pre className="mt-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
//         </div>
//       );
//   }
// }

// function RectangleSVG({
//   length = "l",
//   width = "w",
//   title = "Rectangle",
//   showRightAngles = true
// }) {
//   const L = length ? `l = ${length}` : "l";
//   const W = width ? `w = ${width}` : "w";

//   return (
//     <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 overflow-x-auto">
//       <div className="flex items-center gap-2 mb-3">
//         <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
//         <span className="text-xs text-gray-500 font-medium">{title}</span>
//       </div>

//       <svg viewBox="0 0 320 200" className="w-full min-w-[360px] max-w-[640px] mx-auto">
//         {/* Rectangle */}
//         <rect
//           x="70"
//           y="40"
//           width="200"
//           height="120"
//           fill="none"
//           stroke="#e5e7eb"
//           strokeWidth="3"
//         />

//         {/* Right-angle markers (optional) */}
//         {showRightAngles && (
//           <>
//             {/* top-left */}
//             <polyline points="70,60 70,40 90,40" fill="none" stroke="#a5b4fc" strokeWidth="3" />
//             {/* bottom-left */}
//             <polyline points="70,140 70,160 90,160" fill="none" stroke="#a5b4fc" strokeWidth="3" />
//             {/* top-right */}
//             <polyline points="250,40 270,40 270,60" fill="none" stroke="#a5b4fc" strokeWidth="3" />
//             {/* bottom-right */}
//             <polyline points="270,140 270,160 250,160" fill="none" stroke="#a5b4fc" strokeWidth="3" />
//           </>
//         )}

//         {/* Labels */}
//         <text x="170" y="182" fill="#9ca3af" fontSize="14" textAnchor="middle">{L}</text>

//         <text
//           x="45"
//           y="105"
//           fill="#9ca3af"
//           fontSize="14"
//           textAnchor="middle"
//           transform="rotate(-90 45 105)"
//         >
//           {W}
//         </text>

//         {/* Corner names (optional, simple) */}
//         <text x="60" y="35" fill="#a5b4fc" fontSize="12">A</text>
//         <text x="275" y="35" fill="#a5b4fc" fontSize="12">B</text>
//         <text x="275" y="175" fill="#a5b4fc" fontSize="12">C</text>
//         <text x="60" y="175" fill="#a5b4fc" fontSize="12">D</text>
//       </svg>
//     </div>
//   );
// }


// function CircleSVG({ center = "O", r = "r" }) {
//   return (
//     <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 overflow-x-auto">
//       <div className="flex items-center gap-2 mb-3">
//         <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
//         <span className="text-xs text-gray-500 font-medium">Circle</span>
//       </div>

//       <svg viewBox="0 0 260 190" className="w-full min-w-[320px] max-w-[520px] mx-auto">
//         <circle cx="130" cy="95" r="60" fill="none" stroke="#e5e7eb" strokeWidth="3" />
//         <circle cx="130" cy="95" r="3.5" fill="#a5b4fc" />
//         <line x1="130" y1="95" x2="190" y2="95" stroke="#a5b4fc" strokeWidth="3" />
//         <text x="122" y="88" fill="#a5b4fc" fontSize="12">{center}</text>
//         <text x="160" y="82" fill="#9ca3af" fontSize="12">{`r = ${r}`}</text>
//       </svg>
//     </div>
//   );
// }

// function AngleSVG({ vertex = "B", ray1 = "BA", ray2 = "BC", measure = "θ" }) {
//   // Vertex at center; two rays: one horizontal, one slanted
//   return (
//     <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 overflow-x-auto">
//       <div className="flex items-center gap-2 mb-3">
//         <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
//         <span className="text-xs text-gray-500 font-medium">Angle</span>
//       </div>

//       <svg viewBox="0 0 260 190" className="w-full min-w-[320px] max-w-[520px] mx-auto">
//         {/* Rays */}
//         <line x1="80" y1="130" x2="200" y2="130" stroke="#e5e7eb" strokeWidth="3" />
//         <line x1="80" y1="130" x2="170" y2="60" stroke="#e5e7eb" strokeWidth="3" />

//         {/* Vertex */}
//         <circle cx="80" cy="130" r="4" fill="#a5b4fc" />
//         <text x="65" y="150" fill="#a5b4fc" fontSize="12">{vertex}</text>

//         {/* Arc (simple) */}
//         <path d="M 110 130 A 30 30 0 0 1 102 108" fill="none" stroke="#a5b4fc" strokeWidth="3" />

//         {/* Labels */}
//         <text x="180" y="145" fill="#9ca3af" fontSize="12">{ray1}</text>
//         <text x="168" y="58" fill="#9ca3af" fontSize="12">{ray2}</text>
//         <text x="112" y="110" fill="#c7d2fe" fontSize="12">{measure}</text>
//       </svg>
//     </div>
//   );
// }

// function CoordinatePlaneSVG({ xRange = [-5, 5], yRange = [-5, 5], points = [] }) {
//   const [xmin, xmax] = Array.isArray(xRange) ? xRange : [-5, 5];
//   const [ymin, ymax] = Array.isArray(yRange) ? yRange : [-5, 5];

//   // Map (x,y) -> SVG coords
//   function mapX(x) {
//     return 30 + ((x - xmin) / (xmax - xmin)) * 200;
//   }
//   function mapY(y) {
//     // invert y for SVG
//     return 160 - ((y - ymin) / (ymax - ymin)) * 130;
//   }

//   return (
//     <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 overflow-x-auto">
//       <div className="flex items-center gap-2 mb-3">
//         <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
//         <span className="text-xs text-gray-500 font-medium">Coordinate plane</span>
//       </div>

//       <svg viewBox="0 0 260 190" className="w-full min-w-[360px] max-w-[620px] mx-auto">
//         {/* Axes */}
//         <line x1="30" y1="160" x2="230" y2="160" stroke="#6b7280" strokeWidth="2" />
//         <line x1="30" y1="160" x2="30" y2="30" stroke="#6b7280" strokeWidth="2" />

//         {/* Points */}
//         {Array.isArray(points) &&
//           points.map((p, i) => {
//             const x = mapX(Number(p.x));
//             const y = mapY(Number(p.y));
//             const name = p.name || `P${i + 1}`;
//             return (
//               <g key={name + i}>
//                 <circle cx={x} cy={y} r="4" fill="#a5b4fc" />
//                 <text x={x + 6} y={y - 6} fill="#e5e7eb" fontSize="12">
//                   {name}
//                 </text>
//                 <text x={x + 6} y={y + 10} fill="#9ca3af" fontSize="10">
//                   ({p.x},{p.y})
//                 </text>
//               </g>
//             );
//           })}
//       </svg>
//     </div>
//   );
// }
// /* -----------------------------------------
//    Mermaid renderer (uses window.mermaid from CDN)
// ----------------------------------------- */

// function MermaidDiagram({ code, streaming }) {
//   var ref = useRef(null);
//   var idRef = useRef('mmd-' + Math.random().toString(36).slice(2));
//   var [error, setError] = useState(null);

//   useEffect(function () {
//     if (!code || !code.trim()) return;
//     if (streaming) return;

//     var m = typeof window !== 'undefined' ? window.mermaid : null;
//     if (!m || !m.render) return;

//     // IMPORTANT: do NOT call mermaid.initialize here if you already initialize in index.html,
//     // otherwise you may override themeVariables.

//     var currentId = idRef.current + '-' + Date.now();
//     setError(null);

//     m.render(currentId, code.trim())
//       .then(function (result) {
//         if (ref.current) ref.current.innerHTML = result.svg;
//       })
//       .catch(function (e) {
//         setError(e && e.message ? e.message : 'Mermaid render failed');
//       });
//   }, [code, streaming]);

//   var hasMermaid = typeof window !== 'undefined' && window.mermaid;

//   return (
//     <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
//       <div className="flex items-center gap-2 mb-3">
//         <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
//         <span className="text-xs text-gray-500 font-medium">Diagram</span>
//       </div>

//       {!hasMermaid ? (
//         <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
//       ) : error ? (
//         <div className="text-xs text-red-400">
//           Mermaid error: {error}
//           <pre className="mt-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
//         </div>
//       ) : (
//         <div ref={ref} className="flex justify-center overflow-x-auto" />
//       )}
//     </div>
//   );
// }

// /* -----------------------------------------
//    Main Renderer
// ----------------------------------------- */

// var plugins = {
//   remark: [remarkMath, remarkGfm],
//   rehype: [[rehypeKatex, { throwOnError: false, strict: false, output: 'html' }]]
// };

// export default function MathRenderer({ text, streaming }) {
//   if (!text) return null;

//   // Build components with streaming in closure (no global mutation)
//   var components = {
//     pre: function ({ children }) {
//       return React.createElement(React.Fragment, null, children);
//     },

//     code: function ({ className, children, inline }) {
//       var codeStr = String(children).replace(/\n$/, '');
//       var langMatch = /language-([a-zA-Z0-9_-]+)/.exec(className || '');
//       var lang = langMatch ? langMatch[1] : null;

//       // Custom geometry: right triangle
//       if (!inline && (lang === 'right-triangle' || lang === 'righttriangle')) {
//         if (streaming) {
//           return (
//             <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
//               {codeStr}
//             </pre>
//           );
//         }
//         var t = parseRightTriangle(codeStr);
//         return <RightTriangleSVG a={t.a} b={t.b} c={t.c} />;
//       }

//       // Mermaid diagrams
//       if (!inline && lang === 'mermaid') {
//         return <MermaidDiagram code={codeStr} streaming={!!streaming} />;
//       }


//       // Geom JSON diagrams
// if (!inline && lang === 'geom') {
//   return <GeomDiagram code={codeStr} streaming={!!streaming} />;
// }

//       // Regular block code
//       if (!inline) {
//         return (
//           <div className="my-4 rounded-xl overflow-hidden border border-gray-700">
//             {lang && (
//               <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-500 font-mono border-b border-gray-700 flex items-center gap-2">
//                 <i className="fas fa-code text-[10px]"></i>
//                 {lang}
//               </div>
//             )}
//             <pre className="p-4 bg-gray-900 overflow-x-auto">
//               <code className="text-emerald-300 font-mono text-sm">{codeStr}</code>
//             </pre>
//           </div>
//         );
//       }

//       // Inline code
//       return (
//         <code className="text-indigo-300 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded text-sm border border-indigo-500/20">
//           {children}
//         </code>
//       );
//     },

//     // Headings
//     h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-gray-700/50">{children}</h1>,
//     h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-5 mb-2">{children}</h2>,
//     h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-4 mb-1.5">{children}</h3>,
//     h4: ({ children }) => <h4 className="text-sm font-semibold text-white mt-3 mb-1">{children}</h4>,

//     // Paragraph
//     p: ({ children }) => <p className="my-2 leading-relaxed text-gray-300">{children}</p>,

//     // Lists
//     ul: ({ children }) => <ul className="my-2 ml-1 space-y-1">{children}</ul>,
//     ol: ({ children }) => <ol className="my-2 ml-1 space-y-1 list-none counter-reset-none">{children}</ol>,
//     li: ({ children, ordered, index }) => (
//       <li className="flex gap-2.5 items-start">
//         <span className="text-indigo-400 shrink-0 mt-0.5 text-sm font-medium select-none min-w-[1rem]">
//           {ordered ? ((index || 0) + 1) + '.' : '•'}
//         </span>
//         <span className="flex-1 leading-relaxed">{children}</span>
//       </li>
//     ),

//     blockquote: ({ children }) => (
//       <blockquote className="border-l-[3px] border-indigo-500 pl-4 py-1 my-3 bg-indigo-500/5 rounded-r-lg italic text-gray-400">
//         {children}
//       </blockquote>
//     ),

//     strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
//     em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,

//     a: ({ href, children }) => (
//       <a
//         href={href}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
//       >
//         {children}
//       </a>
//     ),

//     hr: () => <hr className="border-gray-700 my-5" />,

//     table: ({ children }) => (
//       <div className="my-4 overflow-x-auto rounded-xl border border-gray-700">
//         <table className="w-full text-sm">{children}</table>
//       </div>
//     ),
//     thead: ({ children }) => <thead className="bg-gray-800">{children}</thead>,
//     th: ({ children }) => <th className="text-left px-4 py-2.5 text-gray-300 font-semibold border-b border-gray-700">{children}</th>,
//     td: ({ children }) => <td className="px-4 py-2 text-gray-400 border-b border-gray-800/50">{children}</td>,
//     tr: ({ children }) => <tr className="hover:bg-gray-800/30 transition">{children}</tr>,

//     img: ({ src, alt }) => <img src={src} alt={alt || ''} className="my-4 rounded-xl max-w-full border border-gray-700" />
//   };

//   return (
//     <ReactMarkdown
//       remarkPlugins={plugins.remark}
//       rehypePlugins={plugins.rehype}
//       components={components}
//     >
//       {String(text)}
//     </ReactMarkdown>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

/* =========================================================
   Utils
========================================================= */

function parseNum(x) {
  if (x === null || x === undefined) return null;
  const s = String(x).trim();
  const m = s.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function fmtLabel(name, value, unit) {
  if (value === null || value === undefined || value === '') return name;
  if (unit) return `${name} = ${value} ${unit}`;
  return `${name} = ${value}`;
}

function escapeHtml(s) {
  return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fitToView(points, viewW, viewH, pad) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  const minX = Math.min.apply(null, xs);
  const maxX = Math.max.apply(null, xs);
  const minY = Math.min.apply(null, ys);
  const maxY = Math.max.apply(null, ys);

  const w = Math.max(maxX - minX, 1e-6);
  const h = Math.max(maxY - minY, 1e-6);

  const scale = Math.min((viewW - 2 * pad) / w, (viewH - 2 * pad) / h);

  // Note: flip y for SVG
  function map(p) {
    const x = pad + (p.x - minX) * scale;
    const y = viewH - pad - (p.y - minY) * scale;
    return { x, y };
  }

  return { map, scale };
}

/* =========================================================
   Mermaid renderer (CDN: window.mermaid)
========================================================= */

function MermaidDiagram({ code, streaming }) {
  const ref = useRef(null);
  const idRef = useRef('mmd-' + Math.random().toString(36).slice(2));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code || !code.trim()) return;
    if (streaming) return;

    const m = typeof window !== 'undefined' ? window.mermaid : null;
    if (!m || !m.render) return;

    // Do NOT initialize here if you already initialize in index.html
    const currentId = idRef.current + '-' + Date.now();
    setError(null);

    m.render(currentId, code.trim())
      .then((result) => {
        if (ref.current) ref.current.innerHTML = result.svg;
      })
      .catch((e) => {
        setError(e && e.message ? e.message : 'Mermaid render failed');
      });
  }, [code, streaming]);

  const hasMermaid = typeof window !== 'undefined' && window.mermaid;

  if (error) {
    return null;
  }

  return (
    <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
        <span className="text-xs text-gray-500 font-medium">Diagram</span>
      </div>

      {!hasMermaid ? (
        <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
      ) : (
        <div ref={ref} className="flex justify-center overflow-x-auto" />
      )}
    </div>
  );
}

/* =========================================================
   Legacy right-triangle parser (a=, b=, c=)
========================================================= */

function parseRightTriangleLegacy(code) {
  const raw = String(code || '').trim();
  const out = { a: '', b: '', c: '' };

  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([abc])\s*[:=]\s*(.*)\s*$/i);
    if (m) out[m[1].toLowerCase()] = (m[2] || '').trim();
  });

  return out;
}

/* =========================================================
   Geometry SVG Renderers (to-scale where applicable)
========================================================= */

function DiagramShell({ title, children }) {
  return (
    <div className="my-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 overflow-x-auto">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-diagram-project text-indigo-400 text-xs"></i>
        <span className="text-xs text-gray-500 font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
}

function WarningNote({ text }) {
  if (!text) return null;
  return (
    <div className="mb-3 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
      {text}
    </div>
  );
}

/** Right triangle drawn to scale from legs a, b. Optional c is validated. */
function RightTriangleToScaleSVG({ a, b, c, unit }) {
  const A = parseNum(a);
  const B = parseNum(b);
  const Cgiven = parseNum(c);

  if (!A || !B) {
    return <div className="text-xs text-red-400">Right triangle needs numeric a and b.</div>;
  }

  const hyp = Math.sqrt(A * A + B * B);
  let warning = null;

  if (Cgiven !== null) {
    // validate: c should be the hypotenuse, and approximately sqrt(a^2+b^2)
    const tol = 1e-2;
    if (Cgiven < Math.max(A, B)) {
      warning = `Given c = ${Cgiven} looks smaller than a or b. In a right triangle, the hypotenuse is the longest side.`;
    } else if (Math.abs(Cgiven - hyp) > Math.max(tol, 0.02 * hyp)) {
      warning = `Given c = ${Cgiven} does not match √(a²+b²) ≈ ${hyp.toFixed(2)}. One value may be wrong.`;
    }
  }

  // World coords: Cw=(0,0), Bw=(A,0), Aw=(0,B)
  const Cw = { x: 0, y: 0 };
  const Bw = { x: A, y: 0 };
  const Aw = { x: 0, y: B };

  const viewW = 360, viewH = 240, pad = 28;
  const { map } = fitToView([Cw, Bw, Aw], viewW, viewH, pad);

  const Cpt = map(Cw);
  const Bpt = map(Bw);
  const Apt = map(Aw);

  const cLabelVal = (Cgiven !== null) ? Cgiven : Number(hyp.toFixed(2));

  return (
    <DiagramShell title="Right triangle (to scale)">
      <WarningNote text={warning} />
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[360px] max-w-[640px] mx-auto">
        <polyline
          points={`${Cpt.x},${Cpt.y} ${Apt.x},${Apt.y} ${Bpt.x},${Bpt.y} ${Cpt.x},${Cpt.y}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />

        {/* Right angle marker at C */}
        <polyline
          points={`${Cpt.x},${Cpt.y} ${Cpt.x},${Cpt.y - 20} ${Cpt.x + 20},${Cpt.y - 20} ${Cpt.x + 20},${Cpt.y}`}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="3"
        />
        <text x={Cpt.x + 30} y={Cpt.y - 10} fill="#c7d2fe" fontSize="12">90°</text>

        {/* Labels */}
        <text x={(Cpt.x + Bpt.x) / 2} y={Cpt.y + 18} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('a', A, unit)}
        </text>

        <text
          x={Cpt.x - 16}
          y={(Cpt.y + Apt.y) / 2}
          fill="#9ca3af"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90 ${Cpt.x - 16} ${(Cpt.y + Apt.y) / 2})`}
        >
          {fmtLabel('b', B, unit)}
        </text>

        <text x={(Apt.x + Bpt.x) / 2} y={(Apt.y + Bpt.y) / 2 - 8} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('c', cLabelVal, unit)}
        </text>

        {/* Vertex labels */}
        <text x={Apt.x - 10} y={Apt.y - 8} fill="#a5b4fc" fontSize="12">A</text>
        <text x={Bpt.x + 6} y={Bpt.y + 16} fill="#a5b4fc" fontSize="12">B</text>
        <text x={Cpt.x - 14} y={Cpt.y + 16} fill="#a5b4fc" fontSize="12">C</text>
      </svg>
    </DiagramShell>
  );
}

/** Any triangle from SSS, drawn to scale. Accepts AB, BC, CA. */
function TriangleSSSSVG({ AB, BC, CA, unit }) {
  const ab = parseNum(AB);
  const bc = parseNum(BC);
  const ca = parseNum(CA);

  if (!ab || !bc || !ca) {
    return <div className="text-xs text-red-400">Triangle (SSS) needs numeric AB, BC, CA.</div>;
  }

  // Triangle inequality
  if (ab + bc <= ca || ab + ca <= bc || bc + ca <= ab) {
    return (
      <div className="text-xs text-red-400">
        These sides cannot form a triangle (triangle inequality fails).
      </div>
    );
  }

  // Place A=(0,0), B=(ab,0)
  // Compute C via circle intersection:
  // cx = (ca^2 + ab^2 - bc^2)/(2ab)
  // cy = sqrt(ca^2 - cx^2)
  const A = { x: 0, y: 0 };
  const B = { x: ab, y: 0 };
  const cx = (ca * ca + ab * ab - bc * bc) / (2 * ab);
  const cy2 = ca * ca - cx * cx;
  const cy = Math.sqrt(Math.max(cy2, 0));
  const C = { x: cx, y: cy };

  const viewW = 360, viewH = 240, pad = 28;
  const { map } = fitToView([A, B, C], viewW, viewH, pad);

  const A2 = map(A), B2 = map(B), C2 = map(C);

  return (
    <DiagramShell title="Triangle (SSS, to scale)">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[360px] max-w-[640px] mx-auto">
        <polyline
          points={`${A2.x},${A2.y} ${B2.x},${B2.y} ${C2.x},${C2.y} ${A2.x},${A2.y}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />

        {/* Vertex labels */}
        <text x={A2.x - 12} y={A2.y + 16} fill="#a5b4fc" fontSize="12">A</text>
        <text x={B2.x + 6} y={B2.y + 16} fill="#a5b4fc" fontSize="12">B</text>
        <text x={C2.x - 6} y={C2.y - 8} fill="#a5b4fc" fontSize="12">C</text>

        {/* Side labels at midpoints */}
        <text x={(A2.x + B2.x) / 2} y={(A2.y + B2.y) / 2 + 18} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('AB', ab, unit)}
        </text>
        <text x={(B2.x + C2.x) / 2} y={(B2.y + C2.y) / 2 - 6} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('BC', bc, unit)}
        </text>
        <text x={(C2.x + A2.x) / 2 - 6} y={(C2.y + A2.y) / 2} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('CA', ca, unit)}
        </text>
      </svg>
    </DiagramShell>
  );
}

function RectangleToScaleSVG({ length, width, unit }) {
  const L = parseNum(length);
  const W = parseNum(width);
  if (!L || !W) return <div className="text-xs text-red-400">Rectangle needs numeric length and width.</div>;

  const A = { x: 0, y: 0 };
  const B = { x: L, y: 0 };
  const C = { x: L, y: W };
  const D = { x: 0, y: W };

  const viewW = 360, viewH = 240, pad = 28;
  const { map } = fitToView([A, B, C, D], viewW, viewH, pad);

  const A2 = map(A), B2 = map(B), C2 = map(C), D2 = map(D);

  return (
    <DiagramShell title="Rectangle (to scale)">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[360px] max-w-[640px] mx-auto">
        <polyline
          points={`${A2.x},${A2.y} ${B2.x},${B2.y} ${C2.x},${C2.y} ${D2.x},${D2.y} ${A2.x},${A2.y}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />

        {/* right-angle marker at A */}
        <polyline
          points={`${A2.x},${A2.y} ${A2.x},${A2.y - 18} ${A2.x + 18},${A2.y - 18} ${A2.x + 18},${A2.y}`}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="3"
        />

        <text x={(A2.x + B2.x) / 2} y={A2.y + 18} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('l', L, unit)}
        </text>

        <text
          x={A2.x - 14}
          y={(A2.y + D2.y) / 2}
          fill="#9ca3af"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90 ${A2.x - 14} ${(A2.y + D2.y) / 2})`}
        >
          {fmtLabel('w', W, unit)}
        </text>

        <text x={A2.x - 12} y={A2.y + 16} fill="#a5b4fc" fontSize="12">A</text>
        <text x={B2.x + 6} y={B2.y + 16} fill="#a5b4fc" fontSize="12">B</text>
        <text x={C2.x + 6} y={C2.y - 8} fill="#a5b4fc" fontSize="12">C</text>
        <text x={D2.x - 12} y={D2.y - 8} fill="#a5b4fc" fontSize="12">D</text>
      </svg>
    </DiagramShell>
  );
}

function CuboidSVG({ length, width, height, unit }) {
  const L = parseNum(length);
  const W = parseNum(width);
  const H = parseNum(height);
  if (!L || !W || !H) return <div className="text-xs text-red-400">Cuboid needs numeric length, width, height.</div>;

  // Isometric-ish depth based on W (clamp so depth is visible)
  const depth = Math.max(W, 1);
  const depthX = depth * 0.55;
  const depthY = depth * 0.35;

  // Front face (world)
  const FBL = { x: 0, y: 0 };
  const FBR = { x: L, y: 0 };
  const FTL = { x: 0, y: H };
  const FTR = { x: L, y: H };

  // Back face (world)
  const BBL = { x: depthX, y: depthY };
  const BBR = { x: L + depthX, y: depthY };
  const BTL = { x: depthX, y: H + depthY };
  const BTR = { x: L + depthX, y: H + depthY };

  const pts = [FBL, FBR, FTR, FTL, BBL, BBR, BTR, BTL];

  // More space so labels never clip
  const viewW = 420, viewH = 280, pad = 42;
  const { map } = fitToView(pts, viewW, viewH, pad);

  const p = (P) => map(P);

  const fbl = p(FBL), fbr = p(FBR), ftr = p(FTR), ftl = p(FTL);
  const bbl = p(BBL), bbr = p(BBR), btr = p(BTR), btl = p(BTL);

  // Screen centroid (used to push dimension labels outward)
  const centroid = {
    x: (fbl.x + fbr.x + ftr.x + ftl.x + bbl.x + bbr.x + btr.x + btl.x) / 8,
    y: (fbl.y + fbr.y + ftr.y + ftl.y + bbl.y + bbr.y + btr.y + btl.y) / 8
  };

  function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  // Dimension line with end-caps + auto "outside" direction
  function dimLine(p1, p2, label, offset = 22) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    // normal candidates
    let nx = -dy / len;
    let ny = dx / len;

    // choose sign that moves label farther from centroid (outward)
    const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const midPlus = { x: mid.x + nx * offset, y: mid.y + ny * offset };
    const midMinus = { x: mid.x - nx * offset, y: mid.y - ny * offset };
    if (dist2(midMinus, centroid) > dist2(midPlus, centroid)) {
      nx = -nx; ny = -ny;
    }

    const q1 = { x: p1.x + nx * offset, y: p1.y + ny * offset };
    const q2 = { x: p2.x + nx * offset, y: p2.y + ny * offset };

    const cap = 8;
    const cap1a = { x: q1.x - nx * (cap / 2), y: q1.y - ny * (cap / 2) };
    const cap1b = { x: q1.x + nx * (cap / 2), y: q1.y + ny * (cap / 2) };
    const cap2a = { x: q2.x - nx * (cap / 2), y: q2.y - ny * (cap / 2) };
    const cap2b = { x: q2.x + nx * (cap / 2), y: q2.y + ny * (cap / 2) };

    const lx = (q1.x + q2.x) / 2 + nx * 12;
    const ly = (q1.y + q2.y) / 2 + ny * 12;

    return (
      <g>
        {/* extension lines */}
        <line x1={p1.x} y1={p1.y} x2={q1.x} y2={q1.y} stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
        <line x1={p2.x} y1={p2.y} x2={q2.x} y2={q2.y} stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />

        {/* dimension line */}
        <line x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} stroke="#a5b4fc" strokeWidth="2.5" />

        {/* end caps */}
        <line x1={cap1a.x} y1={cap1a.y} x2={cap1b.x} y2={cap1b.y} stroke="#a5b4fc" strokeWidth="2.5" />
        <line x1={cap2a.x} y1={cap2a.y} x2={cap2b.x} y2={cap2b.y} stroke="#a5b4fc" strokeWidth="2.5" />

        {/* label with outline */}
        <text
          x={lx}
          y={ly}
          fontSize="12"
          fill="#e5e7eb"
          textAnchor="middle"
          dominantBaseline="middle"
          paintOrder="stroke"
          stroke="#0b1220"
          strokeWidth="4"
        >
          {label}
        </text>
      </g>
    );
  }

  return (
    <DiagramShell title="Box / Cuboid">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[420px] max-w-[820px] mx-auto">
        {/* wireframe */}
        <polyline points={`${fbl.x},${fbl.y} ${fbr.x},${fbr.y} ${ftr.x},${ftr.y} ${ftl.x},${ftl.y} ${fbl.x},${fbl.y}`} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <polyline points={`${bbl.x},${bbl.y} ${bbr.x},${bbr.y} ${btr.x},${btr.y} ${btl.x},${btl.y} ${bbl.x},${bbl.y}`} fill="none" stroke="#e5e7eb" strokeWidth="3" opacity="0.85" />
        <line x1={fbl.x} y1={fbl.y} x2={bbl.x} y2={bbl.y} stroke="#e5e7eb" strokeWidth="3" opacity="0.85" />
        <line x1={fbr.x} y1={fbr.y} x2={bbr.x} y2={bbr.y} stroke="#e5e7eb" strokeWidth="3" opacity="0.85" />
        <line x1={ftr.x} y1={ftr.y} x2={btr.x} y2={btr.y} stroke="#e5e7eb" strokeWidth="3" opacity="0.85" />
        <line x1={ftl.x} y1={ftl.y} x2={btl.x} y2={btl.y} stroke="#e5e7eb" strokeWidth="3" opacity="0.85" />

        {/* dimension lines - chosen to avoid overlap */}
        {dimLine(fbl, fbr, fmtLabel('l', L, unit), 26)}   {/* length: bottom front */}
        {dimLine(fbl, ftl, fmtLabel('h', H, unit), 30)}   {/* height: left front */}
        {dimLine(ftl, btl, fmtLabel('w', W, unit), 24)}   {/* width: top-left depth */}
      </svg>
    </DiagramShell>
  );
}

function AngleSVG({ measure, vertex = 'B', ray1 = 'BA', ray2 = 'BC' }) {
  const deg = parseNum(measure);
  const theta = deg !== null ? Math.max(1, Math.min(179, deg)) : 60;

  const viewW = 360, viewH = 240;
  const vx = 90, vy = 160;
  const L = 140;

  // ray1: horizontal right
  const r1x = vx + L, r1y = vy;

  // ray2: rotated up by theta degrees
  const rad = (theta * Math.PI) / 180;
  const r2x = vx + L * Math.cos(rad);
  const r2y = vy - L * Math.sin(rad);

  return (
    <DiagramShell title="Angle">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[360px] max-w-[640px] mx-auto">
        <line x1={vx} y1={vy} x2={r1x} y2={r1y} stroke="#e5e7eb" strokeWidth="3" />
        <line x1={vx} y1={vy} x2={r2x} y2={r2y} stroke="#e5e7eb" strokeWidth="3" />
        <circle cx={vx} cy={vy} r="4" fill="#a5b4fc" />

        {/* arc */}
        <path
          d={`M ${vx + 40} ${vy} A 40 40 0 0 1 ${vx + 40 * Math.cos(rad)} ${vy - 40 * Math.sin(rad)}`}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="3"
        />

        <text x={vx - 12} y={vy + 20} fill="#a5b4fc" fontSize="12">{vertex}</text>
        <text x={r1x - 6} y={r1y + 18} fill="#9ca3af" fontSize="12">{ray1}</text>
        <text x={r2x - 6} y={r2y - 8} fill="#9ca3af" fontSize="12">{ray2}</text>
        <text x={vx + 55} y={vy - 20} fill="#c7d2fe" fontSize="12">{deg !== null ? `${theta}°` : 'θ'}</text>
      </svg>
    </DiagramShell>
  );
}

function CircleSVG({ center = 'O', r, unit }) {
  const R = parseNum(r) || 5;

  // draw to scale in its own view: world circle radius=R
  const left = { x: -R, y: 0 };
  const right = { x: R, y: 0 };
  const top = { x: 0, y: R };
  const bottom = { x: 0, y: -R };

  const viewW = 360, viewH = 240, pad = 40;
  const { map, scale } = fitToView([left, right, top, bottom], viewW, viewH, pad);

  const Cw = { x: 0, y: 0 };
  const C = map(Cw);
  const edge = map({ x: R, y: 0 });

  const svgR = Math.abs(edge.x - C.x);

  return (
    <DiagramShell title="Circle">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[360px] max-w-[640px] mx-auto">
        <circle cx={C.x} cy={C.y} r={svgR} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle cx={C.x} cy={C.y} r="4" fill="#a5b4fc" />
        <line x1={C.x} y1={C.y} x2={edge.x} y2={edge.y} stroke="#a5b4fc" strokeWidth="3" />

        <text x={C.x - 14} y={C.y - 10} fill="#a5b4fc" fontSize="12">{center}</text>
        <text x={(C.x + edge.x) / 2} y={C.y - 10} fill="#9ca3af" fontSize="12" textAnchor="middle">
          {fmtLabel('r', R, unit)}
        </text>
      </svg>
    </DiagramShell>
  );
}

function CoordinatePlaneSVG({ xRange = [-5, 5], yRange = [-5, 5], points = [] }) {
  const xr = Array.isArray(xRange) ? xRange : [-5, 5];
  const yr = Array.isArray(yRange) ? yRange : [-5, 5];
  const xmin = Number(xr[0]), xmax = Number(xr[1]);
  const ymin = Number(yr[0]), ymax = Number(yr[1]);

  const viewW = 420, viewH = 260;
  const padL = 48, padB = 40, padT = 20, padR = 18;

  function mapX(x) {
    return padL + ((x - xmin) / (xmax - xmin)) * (viewW - padL - padR);
  }
  function mapY(y) {
    return (viewH - padB) - ((y - ymin) / (ymax - ymin)) * (viewH - padT - padB);
  }

  const showYAxis = xmin <= 0 && xmax >= 0;
  const showXAxis = ymin <= 0 && ymax >= 0;

  // light grid with ~10 steps
  const steps = 10;
  const gx = [];
  const gy = [];
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (i * (xmax - xmin)) / steps;
    gx.push(x);
    const y = ymin + (i * (ymax - ymin)) / steps;
    gy.push(y);
  }

  return (
    <DiagramShell title="Coordinate plane">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full min-w-[420px] max-w-[820px] mx-auto">
        {/* grid */}
        {gx.map((x, i) => (
          <line key={'gx' + i} x1={mapX(x)} y1={padT} x2={mapX(x)} y2={viewH - padB} stroke="#374151" strokeWidth="1" />
        ))}
        {gy.map((y, i) => (
          <line key={'gy' + i} x1={padL} y1={mapY(y)} x2={viewW - padR} y2={mapY(y)} stroke="#374151" strokeWidth="1" />
        ))}

        {/* border */}
        <rect x={padL} y={padT} width={viewW - padL - padR} height={viewH - padT - padB} fill="none" stroke="#4b5563" strokeWidth="1.5" />

        {/* axes */}
        {showYAxis && (
          <line x1={mapX(0)} y1={padT} x2={mapX(0)} y2={viewH - padB} stroke="#9ca3af" strokeWidth="2" />
        )}
        {showXAxis && (
          <line x1={padL} y1={mapY(0)} x2={viewW - padR} y2={mapY(0)} stroke="#9ca3af" strokeWidth="2" />
        )}

        {/* points */}
        {Array.isArray(points) && points.map((p, i) => {
          const px = Number(p.x);
          const py = Number(p.y);
          if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
          const name = p.name || `P${i + 1}`;
          const x = mapX(px);
          const y = mapY(py);

          return (
            <g key={name + i}>
              <circle cx={x} cy={y} r="4" fill="#a5b4fc" />
              <text x={x + 7} y={y - 7} fill="#e5e7eb" fontSize="12">{name}</text>
              <text x={x + 7} y={y + 11} fill="#9ca3af" fontSize="10">({px},{py})</text>
            </g>
          );
        })}
      </svg>
    </DiagramShell>
  );
}

/* =========================================================
   GEOM dispatcher
========================================================= */

function GeomDiagram({ code, streaming }) {
  if (streaming) {
    return (
      <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    );
  }

  let spec = null;
  try {
    spec = JSON.parse(String(code || ''));
  } catch (e) {
    return (
      <div className="text-xs text-red-400">
        Invalid geom JSON
        <pre className="mt-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  if (!spec || !spec.type) {
    return (
      <div className="text-xs text-red-400">
       geom JSON must include  geom JSON must include <code className="text-gray-300">{'{"type":"..."}'}</code>
        <pre className="mt-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  const type = String(spec.type).toLowerCase();
  const unit = spec.unit ? String(spec.unit) : undefined;

  // Normalize triangle fields
  if (type === 'righttriangle' || type === 'right-triangle') {
    return <RightTriangleToScaleSVG a={spec.a} b={spec.b} c={spec.c} unit={unit} />;
  }

  if (type === 'triangle') {
    const mode = (spec.mode ? String(spec.mode) : 'SSS').toUpperCase();
    if (mode === 'SSS') {
      // accept AB,BC,CA or a,b,c
      const AB = spec.AB ?? spec.ab ?? spec.a;
      const BC = spec.BC ?? spec.bc ?? spec.b;
      const CA = spec.CA ?? spec.ca ?? spec.c;
      return <TriangleSSSSVG AB={AB} BC={BC} CA={CA} unit={unit} />;
    }
    return <div className="text-xs text-red-400">Triangle mode not supported yet: {mode}</div>;
  }

  if (type === 'rectangle') {
    return <RectangleToScaleSVG length={spec.length} width={spec.width} unit={unit} />;
  }

  if (type === 'cuboid' || type === 'box') {
    return <CuboidSVG length={spec.length} width={spec.width} height={spec.height} unit={unit} />;
  }

  if (type === 'angle') {
    return <AngleSVG measure={spec.measure} vertex={spec.vertex} ray1={spec.ray1} ray2={spec.ray2} />;
  }

  if (type === 'circle') {
    return <CircleSVG center={spec.center} r={spec.r} unit={unit} />;
  }

  if (type === 'coordinateplane' || type === 'coordinate-plane') {
    return <CoordinatePlaneSVG xRange={spec.xRange} yRange={spec.yRange} points={spec.points} />;
  }

  return (
    <div className="text-xs text-red-400">
      Unknown geom type: {escapeHtml(type)}
      <pre className="mt-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

/* =========================================================
   Markdown renderer components (styled)
========================================================= */

const plugins = {
  remark: [remarkMath, remarkGfm],
  rehype: [[rehypeKatex, { throwOnError: false, strict: false, output: 'html' }]]
};

export default function MathRenderer({ text, streaming }) {
  if (!text) return null;

  const components = useMemo(() => {
    return {
      pre: function ({ children }) {
        return React.createElement(React.Fragment, null, children);
      },

      code: function ({ className, children, inline }) {
        const codeStr = String(children).replace(/\n$/, '');

        // IMPORTANT: allow hyphens in language name
        const langMatch = /language-([a-zA-Z0-9_-]+)/.exec(className || '');
        const lang = langMatch ? langMatch[1] : null;

        // New geometry system
        if (!inline && lang === 'geom') {
          return <GeomDiagram code={codeStr} streaming={!!streaming} />;
        }

        // Legacy right-triangle block (still supported)
        if (!inline && (lang === 'right-triangle' || lang === 'righttriangle')) {
          if (streaming) {
            return (
              <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
                {codeStr}
              </pre>
            );
          }
          const t = parseRightTriangleLegacy(codeStr);
          // Render as to-scale using parsed a,b and validate c if given
          return <RightTriangleToScaleSVG a={t.a} b={t.b} c={t.c} unit={undefined} />;
        }

        // Mermaid for flowcharts
        if (!inline && lang === 'mermaid') {
          return <MermaidDiagram code={codeStr} streaming={!!streaming} />;
        }

        // Regular block code
        if (!inline) {
          return (
            <div className="my-4 rounded-xl overflow-hidden border border-gray-700">
              {lang && (
                <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-500 font-mono border-b border-gray-700 flex items-center gap-2">
                  <i className="fas fa-code text-[10px]"></i>
                  {lang}
                </div>
              )}
              <pre className="p-4 bg-gray-900 overflow-x-auto">
                <code className="text-emerald-300 font-mono text-sm">{codeStr}</code>
              </pre>
            </div>
          );
        }

        // Inline code
        return (
          <code className="text-indigo-300 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded text-sm border border-indigo-500/20">
            {children}
          </code>
        );
      },

      h1: ({ children }) => (
        <h1 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-gray-700/50">
          {children}
        </h1>
      ),
      h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-5 mb-2">{children}</h2>,
      h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-4 mb-1.5">{children}</h3>,
      h4: ({ children }) => <h4 className="text-sm font-semibold text-white mt-3 mb-1">{children}</h4>,

      p: ({ children }) => <p className="my-2 leading-relaxed text-gray-300">{children}</p>,

      ul: ({ children }) => <ul className="my-2 ml-1 space-y-1">{children}</ul>,
      ol: ({ children }) => <ol className="my-2 ml-1 space-y-1 list-none counter-reset-none">{children}</ol>,
      li: ({ children, ordered, index }) => (
        <li className="flex gap-2.5 items-start">
          <span className="text-indigo-400 shrink-0 mt-0.5 text-sm font-medium select-none min-w-[1rem]">
            {ordered ? ((index || 0) + 1) + '.' : '•'}
          </span>
          <span className="flex-1 leading-relaxed">{children}</span>
        </li>
      ),

      blockquote: ({ children }) => (
        <blockquote className="border-l-[3px] border-indigo-500 pl-4 py-1 my-3 bg-indigo-500/5 rounded-r-lg italic text-gray-400">
          {children}
        </blockquote>
      ),

      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
      em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,

      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
        >
          {children}
        </a>
      ),

      hr: () => <hr className="border-gray-700 my-5" />,

      table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead className="bg-gray-800">{children}</thead>,
      th: ({ children }) => (
        <th className="text-left px-4 py-2.5 text-gray-300 font-semibold border-b border-gray-700">
          {children}
        </th>
      ),
      td: ({ children }) => <td className="px-4 py-2 text-gray-400 border-b border-gray-800/50">{children}</td>,
      tr: ({ children }) => <tr className="hover:bg-gray-800/30 transition">{children}</tr>,

      img: ({ src, alt }) => (
        <img src={src} alt={alt || ''} className="my-4 rounded-xl max-w-full border border-gray-700" />
      )
    };
  }, [streaming]);

  return (
    <ReactMarkdown
      remarkPlugins={plugins.remark}
      rehypePlugins={plugins.rehype}
      components={components}
    >
      {String(text)}
    </ReactMarkdown>
  );
}