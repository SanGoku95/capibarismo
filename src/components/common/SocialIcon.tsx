import { FaTiktok, FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaRegWindowRestore } from 'react-icons/fa';
import { SOCIAL_PLATFORM_TYPES, type SocialPlatformType } from '@/lib/constants';

const socialIconMap: Record<SocialPlatformType, React.ComponentType> = {
  [SOCIAL_PLATFORM_TYPES.TIKTOK]: FaTiktok,
  [SOCIAL_PLATFORM_TYPES.YOUTUBE]: FaYoutube,
  [SOCIAL_PLATFORM_TYPES.INSTAGRAM]: FaInstagram,
  [SOCIAL_PLATFORM_TYPES.FACEBOOK]: FaFacebook,
  [SOCIAL_PLATFORM_TYPES.TWITTER]: FaTwitter,
  [SOCIAL_PLATFORM_TYPES.WEB]: FaRegWindowRestore,
};

interface SocialIconProps {
  platform: SocialPlatformType;
  className?: string;
  size?: number;
}

export function SocialIcon({ platform, className = "", size = 16 }: SocialIconProps) {
  const IconComponent = socialIconMap[platform];
  
  if (!IconComponent) {
    console.warn(`Unknown social platform: ${platform}`);
    return <FaRegWindowRestore className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}