type TargetLogoProps = {
  className?: string;
};

export function TargetLogo({ className }: TargetLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="#CC0000" opacity="0.12" />
      <circle cx="32" cy="32" r="20" fill="#CC0000" />
      <circle cx="32" cy="32" r="10" fill="#FFF7F3" />
      <circle cx="32" cy="32" r="5" fill="#CC0000" />
    </svg>
  );
}
