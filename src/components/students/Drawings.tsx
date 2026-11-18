// Line drawings for the three kinds of project on the Students page: a
// microchip, the Constitution with a quill, and a researcher at a laptop.
// Strokes take the line colour from the .line-art rules in index.css, so they
// follow the site palette. The drawings are decoration: the heading beside
// each one says what it stands for.

interface DrawingProps {
  className?: string;
}

export function ChipDrawing({ className = '' }: DrawingProps) {
  return (
    <svg viewBox="0 0 330 351" aria-hidden="true" className={`line-art line-art-fine ${className}`}>
      <g className="ink">
        <rect className="solid" x="3" y="3" width="324" height="345" rx="3"/>
        <path d="M29 9 L301 9 L321 29 L321 322 L301 342 L29 342 L9 322 L9 29 Z"/>
        <path className="faint" d="M33 15 L297 15 L315 33 L315 318 L297 336 L33 336 L15 318 L15 33 Z"/>
        <rect className="faint" x="10" y="10" width="5" height="5"/>
        <rect className="faint" x="10" y="17" width="5" height="5"/>
        <rect className="faint" x="17" y="10" width="5" height="5"/>
        <rect className="faint" x="17" y="17" width="5" height="5"/>
        <rect className="faint" x="306" y="10" width="5" height="5"/>
        <rect className="faint" x="306" y="17" width="5" height="5"/>
        <rect className="faint" x="313" y="10" width="5" height="5"/>
        <rect className="faint" x="313" y="17" width="5" height="5"/>
        <rect className="faint" x="10" y="327" width="5" height="5"/>
        <rect className="faint" x="10" y="334" width="5" height="5"/>
        <rect className="faint" x="17" y="327" width="5" height="5"/>
        <rect className="faint" x="17" y="334" width="5" height="5"/>
        <rect className="faint" x="306" y="327" width="5" height="5"/>
        <rect className="faint" x="306" y="334" width="5" height="5"/>
        <rect className="faint" x="313" y="327" width="5" height="5"/>
        <rect className="faint" x="313" y="334" width="5" height="5"/>
        <clipPath id="chip-array"><path d="M28 28 H58 V148 H100 V332 H28 Z"/></clipPath>
        <path d="M28 28 H58 V148 H100 V332 H28 Z"/>
        <g className="faint" clipPath="url(#chip-array)"><path d="M32 28 V332"/><path d="M37 28 V332"/><path d="M42 28 V332"/><path d="M47 28 V332"/><path d="M52 28 V332"/><path d="M57 28 V332"/><path d="M62 28 V332"/><path d="M67 28 V332"/><path d="M72 28 V332"/><path d="M77 28 V332"/><path d="M82 28 V332"/><path d="M87 28 V332"/><path d="M92 28 V332"/><path d="M97 28 V332"/></g>
        <path d="M62 30 H100 V140 H62 Z"/>
        <rect className="faint" x="70" y="40" width="10" height="10" rx="1"/>
        <rect className="faint" x="84" y="40" width="10" height="10" rx="1"/>
        <rect className="faint" x="70" y="54" width="10" height="10" rx="1"/>
        <rect className="faint" x="84" y="54" width="10" height="10" rx="1"/>
        <rect className="faint" x="66" y="72" width="10" height="10" rx="1"/>
        <rect className="faint" x="80" y="72" width="10" height="10" rx="1"/>
        <rect className="faint" x="66" y="92" width="10" height="10" rx="1"/>
        <rect className="faint" x="80" y="92" width="10" height="10" rx="1"/>
        <rect className="faint" x="72" y="112" width="10" height="10" rx="1"/>
        <rect x="106" y="32" width="116" height="110" rx="2"/>
        <rect className="faint" x="114" y="40" width="11" height="12" rx="1"/>
        <rect className="faint" x="114" y="58" width="11" height="12" rx="1"/>
        <rect className="faint" x="114" y="76" width="11" height="12" rx="1"/>
        <rect className="faint" x="114" y="94" width="11" height="12" rx="1"/>
        <rect className="faint" x="132" y="40" width="11" height="12" rx="1"/>
        <rect className="faint" x="132" y="58" width="11" height="12" rx="1"/>
        <rect className="faint" x="132" y="76" width="11" height="12" rx="1"/>
        <rect className="faint" x="132" y="94" width="11" height="12" rx="1"/>
        <rect className="faint" x="150" y="40" width="11" height="12" rx="1"/>
        <rect className="faint" x="150" y="58" width="11" height="12" rx="1"/>
        <rect className="faint" x="150" y="76" width="11" height="12" rx="1"/>
        <rect className="faint" x="150" y="94" width="11" height="12" rx="1"/>
        <rect className="faint" x="168" y="40" width="11" height="12" rx="1"/>
        <rect className="faint" x="168" y="58" width="11" height="12" rx="1"/>
        <rect className="faint" x="168" y="76" width="11" height="12" rx="1"/>
        <rect className="faint" x="168" y="94" width="11" height="12" rx="1"/>
        <rect className="faint" x="186" y="40" width="11" height="12" rx="1"/>
        <rect className="faint" x="186" y="58" width="11" height="12" rx="1"/>
        <rect className="faint" x="186" y="76" width="11" height="12" rx="1"/>
        <rect className="faint" x="186" y="94" width="11" height="12" rx="1"/>
        <rect className="faint" x="204" y="40" width="11" height="12" rx="1"/>
        <rect className="faint" x="204" y="58" width="11" height="12" rx="1"/>
        <rect className="faint" x="204" y="76" width="11" height="12" rx="1"/>
        <rect className="faint" x="204" y="94" width="11" height="12" rx="1"/>
        <rect className="faint" x="116" y="122" width="10" height="12" rx="1"/>
        <rect className="faint" x="130" y="122" width="10" height="12" rx="1"/>
        <rect className="faint" x="144" y="122" width="10" height="12" rx="1"/>
        <rect className="faint" x="158" y="122" width="10" height="12" rx="1"/>
        <rect className="faint" x="172" y="122" width="10" height="12" rx="1"/>
        <path className="faint" d="M190 118 V138 M198 118 V138 M206 118 V138 M214 118 V138"/>
        <rect x="124" y="13" width="98" height="14" rx="2"/>
        <path className="faint" d="M132 20 H170 M178 17 H214 M178 23 H214"/>
        <rect x="226" y="28" width="72" height="42" rx="2"/>
        <g className="faint"><path d="M231 32 V66"/><path d="M236 32 V66"/><path d="M241 32 V66"/><path d="M246 32 V66"/><path d="M251 32 V66"/><path d="M256 32 V66"/><path d="M261 32 V66"/><path d="M266 32 V66"/><path d="M271 32 V66"/><path d="M276 32 V66"/><path d="M281 32 V66"/><path d="M286 32 V66"/><path d="M291 32 V66"/></g>
        <rect x="234" y="78" width="64" height="14" rx="2"/>
        <rect x="242" y="99" width="56" height="12" rx="2"/>
        <path className="faint" d="M104 30 V332 M222 118 V322 M70 146 H222 M222 116 H300"/>
        <path className="solid" d="M197 203.3 L175.3 225 L144.7 225 L123 203.3 L123 172.7 L144.7 151 L175.3 151 L197 172.7 Z"/>
        <path d="M190.9 200.8 L172.8 218.9 L147.2 218.9 L129.1 200.8 L129.1 175.2 L147.2 157.1 L172.8 157.1 L190.9 175.2 Z"/>
        <path d="M184.9 198.3 L170.3 212.9 L149.7 212.9 L135.1 198.3 L135.1 177.7 L149.7 163.1 L170.3 163.1 L184.9 177.7 Z"/>
        <circle className="faint" cx="160" cy="188" r="20"/>
        <path d="M197 188 H216"/>
        <path className="solid" d="M197 277.3 L175.3 299 L144.7 299 L123 277.3 L123 246.7 L144.7 225 L175.3 225 L197 246.7 Z"/>
        <path d="M190.9 274.8 L172.8 292.9 L147.2 292.9 L129.1 274.8 L129.1 249.2 L147.2 231.1 L172.8 231.1 L190.9 249.2 Z"/>
        <path d="M184.9 272.3 L170.3 286.9 L149.7 286.9 L135.1 272.3 L135.1 251.7 L149.7 237.1 L170.3 237.1 L184.9 251.7 Z"/>
        <circle className="faint" cx="160" cy="262" r="20"/>
        <path d="M197 262 H216"/>
        <rect x="108" y="193" width="32" height="32" rx="2"/>
        <path className="faint" d="M108 201 H140 M108 209 H140 M108 217 H140"/>
        <rect x="108" y="230" width="32" height="64" rx="2"/>
        <rect className="faint" x="113" y="236" width="4" height="8"/>
        <rect className="faint" x="113" y="248" width="4" height="8"/>
        <rect className="faint" x="113" y="260" width="4" height="8"/>
        <rect className="faint" x="113" y="272" width="4" height="8"/>
        <rect className="faint" x="113" y="282" width="4" height="8"/>
        <rect className="faint" x="121" y="236" width="4" height="8"/>
        <rect className="faint" x="121" y="248" width="4" height="8"/>
        <rect className="faint" x="121" y="260" width="4" height="8"/>
        <rect className="faint" x="121" y="272" width="4" height="8"/>
        <rect className="faint" x="121" y="282" width="4" height="8"/>
        <rect className="faint" x="129" y="236" width="4" height="8"/>
        <rect className="faint" x="129" y="248" width="4" height="8"/>
        <rect className="faint" x="129" y="260" width="4" height="8"/>
        <rect className="faint" x="129" y="272" width="4" height="8"/>
        <rect className="faint" x="129" y="282" width="4" height="8"/>
        <rect x="176" y="214" width="40" height="26" rx="2"/>
        <rect className="faint" x="180" y="218" width="8" height="7"/>
        <rect className="faint" x="180" y="228" width="8" height="7"/>
        <rect className="faint" x="192" y="218" width="8" height="7"/>
        <rect className="faint" x="192" y="228" width="8" height="7"/>
        <rect className="faint" x="204" y="218" width="8" height="7"/>
        <rect className="faint" x="204" y="228" width="8" height="7"/>
        <rect x="225" y="138" width="72" height="178" rx="2"/>
        <rect className="solid" x="229" y="143" width="28" height="28" rx="1"/>
        <rect className="faint" x="238.5" y="152.5" width="9" height="9"/>
        <rect className="solid" x="263" y="143" width="30" height="30" rx="1"/>
        <rect className="faint" x="273.5" y="153.5" width="9" height="9"/>
        <rect className="solid" x="229" y="198" width="28" height="28" rx="1"/>
        <rect className="faint" x="238.5" y="207.5" width="9" height="9"/>
        <rect className="solid" x="263" y="198" width="30" height="30" rx="1"/>
        <rect className="faint" x="273.5" y="208.5" width="9" height="9"/>
        <rect className="solid" x="250" y="233" width="27" height="27" rx="1"/>
        <rect className="faint" x="259.0" y="242.0" width="9" height="9"/>
        <rect className="solid" x="250" y="281" width="27" height="27" rx="1"/>
        <rect className="faint" x="259.0" y="290.0" width="9" height="9"/>
        <rect x="108" y="298" width="26" height="22" rx="2"/>
        <path className="faint" d="M113 302 V316 M118 302 V316 M123 302 V316 M128 302 V316"/>
        <rect x="150" y="304" width="66" height="16" rx="2"/>
        <rect className="solid" x="59" y="11" width="12" height="12" rx="1.5"/>
        <circle cx="65" cy="17" r="3.6"/>
        <rect className="solid" x="94" y="11" width="12" height="12" rx="1.5"/>
        <circle cx="100" cy="17" r="3.6"/>
        <rect className="solid" x="232" y="11" width="12" height="12" rx="1.5"/>
        <circle cx="238" cy="17" r="3.6"/>
        <rect className="solid" x="259" y="11" width="12" height="12" rx="1.5"/>
        <circle cx="265" cy="17" r="3.6"/>
        <rect className="solid" x="282" y="11" width="12" height="12" rx="1.5"/>
        <circle cx="288" cy="17" r="3.6"/>
        <rect className="solid" x="11" y="34" width="12" height="12" rx="1.5"/>
        <circle cx="17" cy="40" r="3.6"/>
        <rect className="solid" x="11" y="84" width="12" height="12" rx="1.5"/>
        <circle cx="17" cy="90" r="3.6"/>
        <rect className="solid" x="11" y="184" width="12" height="12" rx="1.5"/>
        <circle cx="17" cy="190" r="3.6"/>
        <rect className="solid" x="11" y="221" width="12" height="12" rx="1.5"/>
        <circle cx="17" cy="227" r="3.6"/>
        <rect className="solid" x="11" y="294" width="12" height="12" rx="1.5"/>
        <circle cx="17" cy="300" r="3.6"/>
        <rect className="solid" x="34" y="325" width="12" height="12" rx="1.5"/>
        <circle cx="40" cy="331" r="3.6"/>
        <rect className="solid" x="109" y="325" width="12" height="12" rx="1.5"/>
        <circle cx="115" cy="331" r="3.6"/>
        <rect className="solid" x="134" y="325" width="12" height="12" rx="1.5"/>
        <circle cx="140" cy="331" r="3.6"/>
        <rect className="solid" x="252" y="325" width="12" height="12" rx="1.5"/>
        <circle cx="258" cy="331" r="3.6"/>
        <rect className="solid" x="279" y="325" width="12" height="12" rx="1.5"/>
        <circle cx="285" cy="331" r="3.6"/>
        <rect className="solid" x="307" y="34" width="12" height="12" rx="1.5"/>
        <circle cx="313" cy="40" r="3.6"/>
        <rect className="solid" x="307" y="122" width="12" height="12" rx="1.5"/>
        <circle cx="313" cy="128" r="3.6"/>
        <rect className="solid" x="307" y="149" width="12" height="12" rx="1.5"/>
        <circle cx="313" cy="155" r="3.6"/>
        <rect className="solid" x="307" y="189" width="12" height="12" rx="1.5"/>
        <circle cx="313" cy="195" r="3.6"/>
        <rect className="solid" x="307" y="221" width="12" height="12" rx="1.5"/>
        <circle cx="313" cy="227" r="3.6"/>
        <rect className="solid" x="307" y="287" width="12" height="12" rx="1.5"/>
        <circle cx="313" cy="293" r="3.6"/>
      </g>
    </svg>
  );
}

export function ConstitutionDrawing({ className = '' }: DrawingProps) {
  return (
    <svg viewBox="0 0 400 320" aria-hidden="true" className={`line-art ${className}`}>
      <g className="ink">
        <rect className="solid" x="110" y="48" width="180" height="228"/>
        <text x="200" y="98" textAnchor="middle" fontFamily="'EB Garamond', Georgia, serif" fontStyle="italic" fontSize="31" fill="currentColor" stroke="none">We the People</text>
        <g className="faint">
          <path d="M128 116H268 M128 126H272 M128 136H266 M128 146H272 M128 156H220"/>
          <path d="M176 174H224" strokeWidth="2.2"/>
          <path d="M128 190H272 M128 200H268 M128 210H272 M128 220H264 M128 230H272 M128 240H250 M128 250H200"/>
        </g>
        <rect className="solid" x="96" y="34" width="208" height="20" rx="10"/>
        <ellipse cx="106" cy="44" rx="4" ry="9"/>
        <ellipse cx="294" cy="44" rx="4" ry="9"/>
        <rect className="solid" x="96" y="270" width="208" height="20" rx="10"/>
        <ellipse cx="106" cy="280" rx="4" ry="9"/>
        <ellipse cx="294" cy="280" rx="4" ry="9"/>
        <rect className="solid" x="320" y="266" width="38" height="26" rx="5"/>
        <rect className="solid" x="330" y="257" width="18" height="10" rx="2"/>
        <path className="solid" d="M300 206 Q348 180 366 112 Q320 138 300 206 Z"/>
        <path d="M264 254 L366 112"/>
        <path className="faint" d="M318 181 L334 178 M332 160 L348 156 M346 141 L357 135"/>
        <path className="solid" d="M264 254 L268 242 L275 247 Z"/>
      </g>
    </svg>
  );
}

export function ResearcherDrawing({ className = '' }: DrawingProps) {
  return (
    <svg viewBox="0 0 400 320" aria-hidden="true" className={`line-art ${className}`}>
      <g className="ink">
        <path className="faint" d="M70 300 H392"/>
        <path d="M246 230 V300 M372 230 V300"/>
        <rect className="solid" x="232" y="222" width="160" height="8" rx="2"/>
        <path d="M149 258 V300 M134 286 H164"/>
        <rect className="solid" x="112" y="250" width="74" height="8" rx="4"/>
        <path className="solid" d="M148 230 L224 233 Q236 236 234 248 L232 256 L148 256 Z"/>
        <path className="solid" d="M212 250 L234 250 L236 290 L214 290 Z"/>
        <path className="solid" d="M208 290 L246 290 Q253 295 249 300 L208 300 Z"/>
        <path d="M178 124 V142 M190 122 V140"/>
        <path className="solid" d="M162 140 C150 165 142 205 144 264 L168 266 L198 238 C204 208 206 175 198 146 Q188 137 176 140 Z"/>
        <path d="M188 142 L192 178 L198 186"/>
        <path d="M182 160 H196 M188 160 V150"/>
        <rect x="172" y="212" width="16" height="10" rx="2"/>
        <path className="solid" d="M324 216 L340 150 L346 151 L330 216 Z"/>
        <rect className="solid" x="252" y="215" width="78" height="7" rx="2"/>
        <path className="solid" d="M176 150 Q178 196 202 210 L256 222 L258 210 L210 196 Q194 182 194 150 Z"/>
        <ellipse className="solid" cx="264" cy="214" rx="9" ry="5"/>
        <circle className="solid" cx="188" cy="104" r="22"/>
        <path d="M168 100 Q168 80 190 80 Q208 80 210 94 Q198 88 186 92 Q174 95 171 108"/>
        <path d="M180 100 Q174 106 180 112"/>
        <rect x="198" y="99" width="10" height="8" rx="2"/>
        <path d="M186 101 H198"/>
        <path className="solid" d="M360 184 V198 L349 219 Q348 222 352 222 L386 222 Q390 222 389 219 L378 198 V184"/>
        <path d="M356 184 H382"/>
        <path className="faint" d="M354 210 H384"/>
        <circle cx="364" cy="204" r="2"/>
        <circle cx="371" cy="196" r="1.6"/>
      </g>
    </svg>
  );
}
