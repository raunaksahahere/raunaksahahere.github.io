/** Four-point hand-drawn sparkle. */
export function Sparkle({ className, fill = "#c8f03c" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1.5c.6 4.6 2.3 7.6 7.9 9.4.5.2.5.9 0 1.1-5.6 1.8-7.3 4.8-7.9 9.5-.1.6-.9.6-1 0-.6-4.7-2.3-7.7-7.9-9.5-.5-.2-.5-.9 0-1.1 5.6-1.8 7.3-4.8 7.9-9.4.1-.6.9-.6 1 0Z"
        fill={fill}
        stroke="#15130f"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
