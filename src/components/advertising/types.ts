// Advertising banner types and interfaces

export type BannerType = 'hero' | 'promotional' | 'brand' | 'seasonal';
export type BannerPriority = 'high' | 'medium' | 'low';
export type BannerPlacement = 'top' | 'middle' | 'bottom';
export type BannerLayout = 'horizontal' | 'vertical' | 'card' | 'minimal';
export type BannerSize = 'small' | 'medium' | 'large' | 'full';

// Legacy campaign interface (for existing AdBanner)
export interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor?: string;
  textColor?: string;
  startDate: Date;
  endDate: Date;
  targetAudience?: string[];
  isActive: boolean;
}

// Carousel campaign with flexible content (all optional except id and meta)
export interface CarouselCampaign {
  id: string;
  
  // Image content (optional)
  imageUrl?: string;
  mobileImageUrl?: string;
  
  // Text content (all optional)
  title?: string;
  subtitle?: string; 
  description?: string;
  
  // CTA (optional)
  ctaText?: string;
  ctaUrl?: string;
  
  // Styling (important when no image)
  backgroundColor?: string;
  textColor?: string;
  gradientBackground?: string;
  
  // Meta information
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority?: BannerPriority;
}

// Carousel banner props
export interface CarouselAdBannerProps {
  campaigns: CarouselCampaign[];
  height?: number; // default 300px
  autoPlay?: boolean; // default true
  interval?: number; // default 5000ms
  showNavigation?: boolean; // default true (on hover)
  showIndicators?: boolean; // default true
  className?: string;
  onSlideChange?: (index: number, campaign: CarouselCampaign) => void;
  onCampaignClick?: (campaign: CarouselCampaign) => void;
}

// Carousel banner content types
export type BannerContentType = 
  | 'image-only'
  | 'text-only' 
  | 'cta-only'
  | 'image-with-text'
  | 'image-with-cta'
  | 'text-with-cta'
  | 'full-content'
  | 'minimal';

// Helper functions for campaign content detection
export const hasImage = (campaign: CarouselCampaign): boolean => {
  return !!campaign.imageUrl;
};

export const hasText = (campaign: CarouselCampaign): boolean => {
  return !!(campaign.title || campaign.subtitle || campaign.description);
};

export const hasCTA = (campaign: CarouselCampaign): boolean => {
  return !!(campaign.ctaText && campaign.ctaUrl);
};

export const hasAnyContent = (campaign: CarouselCampaign): boolean => {
  return hasImage(campaign) || hasText(campaign) || hasCTA(campaign);
};

export const getBannerContentType = (campaign: CarouselCampaign): BannerContentType => {
  const hasImageContent = hasImage(campaign);
  const hasTextContent = hasText(campaign);
  const hasCTAContent = hasCTA(campaign);
  
  // No content at all
  if (!hasImageContent && !hasTextContent && !hasCTAContent) return 'minimal';
  
  // Single content types
  if (hasImageContent && !hasTextContent && !hasCTAContent) return 'image-only';
  if (!hasImageContent && hasTextContent && !hasCTAContent) return 'text-only';
  if (!hasImageContent && !hasTextContent && hasCTAContent) return 'cta-only';
  
  // Combined content types
  if (hasImageContent && hasTextContent && !hasCTAContent) return 'image-with-text';
  if (hasImageContent && !hasTextContent && hasCTAContent) return 'image-with-cta';
  if (!hasImageContent && hasTextContent && hasCTAContent) return 'text-with-cta';
  
  // All content present
  return 'full-content';
};

export const getBackgroundStyle = (campaign: CarouselCampaign) => {
  if (campaign.gradientBackground) {
    return { background: campaign.gradientBackground };
  }
  if (campaign.backgroundColor) {
    return { backgroundColor: campaign.backgroundColor };
  }
  return { backgroundColor: '#F3F4F6' }; // Default background
};

// Campaign validation
export const isValidCampaign = (campaign: CarouselCampaign): boolean => {
  // Minimum required fields
  if (!campaign.id || !campaign.startDate || !campaign.endDate) {
    return false;
  }
  
  // If CTA text exists, URL must also exist
  if (campaign.ctaText && !campaign.ctaUrl) {
    return false;
  }
  
  return true;
};