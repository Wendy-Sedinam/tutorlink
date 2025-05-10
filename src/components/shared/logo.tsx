import Link from 'next/link';
import { GraduationCap } from 'lucide-react'; // Or any other suitable icon

const Logo = ({ size = 'default' }: { size?: 'default' | 'large' }) => {
  const iconSize = size === 'large' ? 36 : 28;
  const textSize = size === 'large' ? 'text-3xl' : 'text-2xl';

  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="MentorLink Home">
      <GraduationCap className={`text-primary group-hover:text-accent transition-colors duration-300`} size={iconSize} />
      <span className={`${textSize} font-bold text-foreground group-hover:text-primary transition-colors duration-300`}>
        MentorLink
      </span>
    </Link>
  );
};

export default Logo;
