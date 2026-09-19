const domains = [
  { code: "HU", title: "Hunger & Appetite", detail: ["Signals · Reward ·", "Eating behaviour"], x: 26, y: 38, color: "#d49a26", side: "left" },
  { code: "SL", title: "Sleep & Recovery", detail: ["Rhythms · Hormones ·", "Restoration"], x: 634, y: 38, color: "#2867bb", side: "right" },
  { code: "ME", title: "Metabolism", detail: ["Energy · Insulin ·", "Storage"], x: 12, y: 194, color: "#2cb3b1", side: "left" },
  { code: "CI", title: "Circadian Timing", detail: ["Biological Clock ·", "Hormonal Rhythm"], x: 648, y: 196, color: "#ef5c61", side: "right" },
  { code: "SA", title: "Safety & Immunity", detail: ["Inflammation · Defense ·", "Repair"], x: 28, y: 354, color: "#43b477", side: "left" },
  { code: "ST", title: "Stress Response", detail: ["HPA Axis · Resilience ·", "Adaptation"], x: 634, y: 360, color: "#f47739", side: "right" },
  { code: "IN", title: "Inflammation", detail: ["Microbiome · Gut Barrier ·", "Systemic Signals"], x: 54, y: 514, color: "#815bd6", side: "left" },
];

function DomainCard({ domain }: { domain: (typeof domains)[number] }) {
  const icon = domain.code === "SL" ? "☾" : domain.code === "CI" ? "◷" : domain.code === "ST" ? "ϟ" : domain.code === "IN" ? "≋" : domain.code === "SA" ? "◈" : domain.code === "ME" ? "⚙" : "♧";
  return (
    <g transform={`translate(${domain.x} ${domain.y})`}>
      <rect width="240" height="112" rx="14" fill="#ffffff" fillOpacity=".94" stroke={domain.color} strokeOpacity=".25" />
      <circle cx="39" cy="56" r="27" fill={domain.color} />
      <text x="39" y="65" textAnchor="middle" fill="#fff" fontSize="27" fontFamily="Georgia, serif">{icon}</text>
      <text x="82" y="29" fill="#17365d" fontSize="12" fontWeight="800" fontFamily="Arial, sans-serif">{domain.code}</text>
      <text x="82" y="52" fill="#17365d" fontSize="15" fontWeight="800" fontFamily="Arial, sans-serif">{domain.title}</text>
      <text x="82" y="76" fill="#58708d" fontSize="12" fontFamily="Arial, sans-serif">{domain.detail[0]}</text>
      <text x="82" y="94" fill="#58708d" fontSize="12" fontFamily="Arial, sans-serif">{domain.detail[1]}</text>
    </g>
  );
}

export default function ReferenceHeroSvg() {
  return (
    <svg className="reference-hero-svg" viewBox="0 0 900 660" role="img" aria-labelledby="reference-svg-title reference-svg-desc" preserveAspectRatio="xMidYMid meet">
      <title id="reference-svg-title">Seven connected biological domains</title>
      <desc id="reference-svg-desc">A central human biological system connected to hunger, sleep, metabolism, circadian timing, safety, stress and inflammation.</desc>
      <defs>
        <radialGradient id="reference-body" cx="50%" cy="34%" r="66%">
          <stop offset="0" stopColor="#d8efff" />
          <stop offset=".35" stopColor="#5bafe0" />
          <stop offset=".72" stopColor="#1b5a98" />
          <stop offset="1" stopColor="#0e315f" stopOpacity=".2" />
        </radialGradient>
        <linearGradient id="reference-limb" x1="0" x2="1">
          <stop offset="0" stopColor="#123e77" />
          <stop offset=".5" stopColor="#a8dbf3" />
          <stop offset="1" stopColor="#123e77" />
        </linearGradient>
        <radialGradient id="reference-head" cx="45%" cy="30%">
          <stop offset="0" stopColor="#fff1d7" />
          <stop offset=".32" stopColor="#8dc9eb" />
          <stop offset="1" stopColor="#164c8b" />
        </radialGradient>
        <filter id="reference-blur"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="reference-shadow"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2867bb" floodOpacity=".22" /></filter>
      </defs>
      <rect width="900" height="660" fill="#fff" />
      <g className="reference-orbits" fill="none" stroke="#dbe7f5">
        <ellipse cx="450" cy="320" rx="314" ry="284" transform="rotate(-16 450 320)" />
        <ellipse cx="450" cy="320" rx="260" ry="220" transform="rotate(18 450 320)" strokeDasharray="3 8" />
      </g>
      <g className="reference-connections" fill="none" strokeWidth="2" opacity=".84">
        <path d="M266 94 H368" stroke="#d49a26" /><path d="M634 94 H532" stroke="#2867bb" />
        <path d="M252 250 H351" stroke="#2cb3b1" /><path d="M648 252 H549" stroke="#ef5c61" />
        <path d="M268 410 H365" stroke="#43b477" /><path d="M634 416 H535" stroke="#f47739" />
        <path d="M294 570 H397" stroke="#815bd6" />
      </g>
      <g className="reference-nodes" fill="#fff" strokeWidth="3">
        <circle cx="368" cy="94" r="7" stroke="#d49a26" fill="#d49a26" /><circle cx="532" cy="94" r="7" stroke="#2867bb" fill="#2867bb" />
        <circle cx="351" cy="250" r="7" stroke="#2cb3b1" fill="#2cb3b1" /><circle cx="549" cy="252" r="7" stroke="#ef5c61" fill="#ef5c61" />
        <circle cx="365" cy="410" r="7" stroke="#43b477" fill="#43b477" /><circle cx="535" cy="416" r="7" stroke="#f47739" fill="#f47739" />
        <circle cx="397" cy="570" r="7" stroke="#815bd6" fill="#815bd6" />
      </g>
      <g className="reference-body" filter="url(#reference-shadow)">
        <path d="M450 95c-42 0-65 34-65 79 0 47 28 82 65 82s65-35 65-82c0-45-23-79-65-79Z" fill="url(#reference-head)" />
        <path d="M420 152c14-23 46-31 63-10 12 15 8 49-10 64-19 16-47 9-57-14-6-14-5-28 4-40Z" fill="none" stroke="#e9f6ff" strokeWidth="3" opacity=".78" />
        <path d="M426 147c14 9 25 7 35-4m-29 22c12 9 27 9 40 0m-44 20c13 8 27 8 39 0" fill="none" stroke="#ffe19b" strokeWidth="3" strokeLinecap="round" opacity=".78" />
        <path d="M423 239h54v64h-54z" fill="#286ca8" />
        <path d="M373 286 Q450 252 527 286 L548 472 Q526 532 450 548 Q374 532 352 472Z" fill="url(#reference-body)" />
        <path d="M370 300 C337 350 316 453 332 510" fill="none" stroke="url(#reference-limb)" strokeWidth="29" strokeLinecap="round" />
        <path d="M530 300 C563 350 584 453 568 510" fill="none" stroke="url(#reference-limb)" strokeWidth="29" strokeLinecap="round" />
        <path d="M416 510 C406 560 401 614 402 653" fill="none" stroke="url(#reference-limb)" strokeWidth="38" strokeLinecap="round" />
        <path d="M484 510 C494 560 499 614 498 653" fill="none" stroke="url(#reference-limb)" strokeWidth="38" strokeLinecap="round" />
        <path d="M397 648h16M487 648h16" stroke="#164b86" strokeWidth="11" strokeLinecap="round" />
        <path d="M411 296c19 24 26 59 23 91m55-91c-19 24-26 59-23 91" fill="none" stroke="#c9edff" strokeWidth="4" opacity=".65" />
      </g>
      <g className="reference-hotspots" filter="url(#reference-blur)" opacity=".9">
        <ellipse cx="450" cy="205" rx="31" ry="37" fill="#ffd887" />
        <ellipse cx="420" cy="322" rx="28" ry="42" fill="#f19ab3" />
        <ellipse cx="480" cy="355" rx="36" ry="37" fill="#ffc66f" />
        <ellipse cx="450" cy="405" rx="38" ry="36" fill="#ffb06e" />
      </g>
      <g className="reference-organs" stroke="#eaf5ff" strokeWidth="3" fill="none" opacity=".7">
        <path d="M450 270v230" /><path d="M397 330 Q450 350 503 330" /><path d="M395 396 Q450 420 505 396" /><path d="M405 454 Q450 476 495 454" />
        <ellipse cx="422" cy="326" rx="19" ry="30" stroke="#ffb4c3" /><ellipse cx="478" cy="326" rx="19" ry="30" stroke="#ffb4c3" />
        <path d="M433 364c10 12 24 12 34 0m-34 27c10 12 24 12 34 0" stroke="#ffd58c" />
        <path d="M415 424c18 10 52 10 70 0m-62 14c15 8 39 8 54 0" stroke="#ffcb86" />
      </g>
      {domains.map((domain) => <DomainCard domain={domain} key={domain.code} />)}
      <g transform="translate(652 566)">
        <path d="M0 0v56" stroke="#d6a126" strokeWidth="2" />
        <text x="20" y="18" fill="#2860a8" fontSize="15" fontStyle="italic" fontFamily="Georgia, serif">The body is not a collection of parts,</text>
        <text x="20" y="40" fill="#2860a8" fontSize="15" fontStyle="italic" fontFamily="Georgia, serif">but a network of conversations.</text>
      </g>
    </svg>
  );
}
