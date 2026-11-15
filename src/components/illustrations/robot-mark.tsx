/** Bit, the tiny robot mascot, as a compact mark. */
export function RobotMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <line x1="16" y1="4" x2="16" y2="9" stroke="#15130f" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="4" r="2.4" fill="#ff6b2c" stroke="#15130f" strokeWidth="1.6" />
      <rect x="6" y="9" width="20" height="16" rx="5" fill="#fbf8f2" stroke="#15130f" strokeWidth="2" />
      <rect x="9.5" y="13" width="13" height="7" rx="3" fill="#15130f" />
      <circle cx="13" cy="16.5" r="1.4" fill="#c8f03c" />
      <circle cx="19" cy="16.5" r="1.4" fill="#c8f03c" />
      <path d="M4 15v4M28 15v4" stroke="#15130f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
