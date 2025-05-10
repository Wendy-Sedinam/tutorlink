import Link from 'next/link';

const LogoSVG = ({ className }: { className?: string }) => (
  <svg 
    width="1em" 
    height="1em" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-hidden="true"
  >
    {/* Star */}
    <path d="M50 12L54.7025 22.2975L65.6039 23.9319L57.6507 31.4681L59.4051 42.3681L50 37L40.5949 42.3681L42.3493 31.4681L34.3961 23.9319L45.2975 22.2975L50 12Z" fill="currentColor"/>
    {/* Figure - simplified */}
    <path d="M50 30C45 30 42 38 42 45C42 52 45 60 45 60H55C55 60 58 52 58 45C58 38 55 30 50 30Z" fill="currentColor"/>
    <path d="M35 42C32.2386 42 30 44.2386 30 47C30 49.7614 32.2386 52 35 52C37.7614 52 40 49.7614 40 47L42 45C40.3732 43.0325 37.8396 42 35 42Z" fill="currentColor"/>
    <path d="M65 42C67.7614 42 70 44.2386 70 47C70 49.7614 67.7614 52 65 52C62.2386 52 60 49.7614 58 47L60 45C60.3732 43.0325 62.8396 42 65 42Z" fill="currentColor"/>
    {/* Book */}
    <path d="M15 88C15 78.0589 26.1929 70 40 70H60C73.8071 70 85 78.0589 85 88V90H15V88Z" fill="currentColor"/>
    <path d="M15 70C15 65 25 62 40 62H60C75 62 85 65 85 70L84.6012 71.595C74.4037 66.3313 62.6138 64 50 64C37.3862 64 25.5963 66.3313 15.3988 71.595L15 70Z" fill="currentColor" opacity="0.7"/>
     <line x1="50" y1="64" x2="50" y2="90" stroke="hsl(var(--card))" strokeWidth="3"/>
  </svg>
);


const Logo = ({ size = 'default' }: { size?: 'default' | 'large' }) => {
  const iconSizeClass = size === 'large' ? 'h-9 w-9' : 'h-7 w-7';
  const textSize = size === 'large' ? 'text-3xl' : 'text-2xl';

  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="TutorLink Home">
      <LogoSVG className={`${iconSizeClass} text-primary group-hover:text-accent transition-colors duration-300`} />
      <span className={`${textSize} font-bold text-foreground group-hover:text-primary transition-colors duration-300`}>
        TutorLink
      </span>
    </Link>
  );
};

export default Logo;