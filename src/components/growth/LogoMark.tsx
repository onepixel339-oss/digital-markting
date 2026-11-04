// شعار مسار / 42 — شرائط ورقية مائلة
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="#17212d" />
      <path d="M9 36 36 9" stroke="#f3d0bd" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M13 41 40 14" stroke="#5c7245" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M5 30 32 3" stroke="#ee5b2e" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M20 45 45 20" stroke="#d2492a" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}
