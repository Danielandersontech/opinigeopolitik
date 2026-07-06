// Ikon garis sederhana (inline SVG, currentColor), netral tanpa dependensi.
const PATHS = {
  senyum: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
      <line x1="9" y1="9.5" x2="9" y2="9.6" />
      <line x1="15" y1="9.5" x2="15" y2="9.6" />
    </>
  ),
  kilat: <path d="M13 3 6 13h5l-1 8 7-10h-5l1-8z" />,
  timbangan: (
    <>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="5" y1="7" x2="19" y2="7" />
      <path d="M5 7l-2.4 5a2.6 2.6 0 0 0 4.8 0L5 7z" />
      <path d="M19 7l-2.4 5a2.6 2.6 0 0 0 4.8 0L19 7z" />
      <line x1="9" y1="20" x2="15" y2="20" />
    </>
  ),
  kisi: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  lapis: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  centang: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.6 2.6L16 9.5" />
    </>
  ),
  perisai: <path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" />,
  grafik: (
    <>
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="12" width="3" height="8" rx="1" />
      <rect x="11" y="8" width="3" height="12" rx="1" />
      <rect x="16" y="5" width="3" height="15" rx="1" />
    </>
  ),
};

export default function Icon({ nama, ukuran = 20 }) {
  return (
    <svg
      width={ukuran} height={ukuran} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      {PATHS[nama] || PATHS.lapis}
    </svg>
  );
}
