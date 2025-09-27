"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { type UseEmblaCarouselType } from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";
import {
  CarouselAdBannerProps,
  CarouselCampaign,
  getBackgroundStyle,
  getBannerContentType,
  hasCTA,
  hasImage,
  hasText,
} from "./types";

export default function CarouselAdBanner({
  campaigns,
  height = 300,
  autoPlay = true,
  interval = 5000,
  showNavigation = true,
  showIndicators = true,
  className,
  onSlideChange,
  onCampaignClick,
}: CarouselAdBannerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // 반응형 높이 계산
  const getResponsiveHeight = () => {
    if (isMobile) {
      return Math.round(height * 0.6); // 모바일: 60%
    }
    if (isTablet) {
      return Math.round(height * 0.8); // 태블릿: 80%
    }
    return height; // 데스크톱: 100%
  };

  const responsiveHeight = getResponsiveHeight();

  const plugin = useRef(Autoplay({ delay: interval, stopOnInteraction: true }));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null);

  // Filter only active campaigns
  const activeCampaigns = campaigns.filter((campaign) => campaign.isActive);

  // Carousel API 이벤트 리스너 설정
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const selected = carouselApi.selectedScrollSnap();
      setCurrentSlide(selected);
      onSlideChange?.(selected, activeCampaigns[selected]);
    };

    carouselApi.on("select", onSelect);
    onSelect(); // 초기 상태 설정

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, onSlideChange, activeCampaigns]);

  const handleCampaignClick = useCallback(
    (campaign: CarouselCampaign) => {
      onCampaignClick?.(campaign);
      if (hasCTA(campaign)) {
        window.open(campaign.ctaUrl, "_blank");
      }
    },
    [onCampaignClick],
  );

  const renderCampaignContent = (campaign: CarouselCampaign) => {
    const contentType = getBannerContentType(campaign);
    const backgroundStyle = getBackgroundStyle(campaign);
    const textColor = campaign.textColor || "#000000";

    return (
      <div
        className="relative w-full flex items-center justify-center overflow-hidden rounded-lg"
        style={{ height: `${responsiveHeight}px`, ...backgroundStyle }}
      >
        {/* Background image if exists */}
        {hasImage(campaign) && (
          <Image
            src={campaign.imageUrl!}
            alt={campaign.title || ""}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Content overlay */}
        {(hasText(campaign) || hasCTA(campaign)) && (
          <div
            className="relative z-10 text-center px-4 sm:px-8 max-w-4xl"
            style={{ color: textColor }}
          >
            {/* Text content */}
            {campaign.title && (
              <h2 className={cn("font-semibold mb-2", isMobile ? "text-xl" : "text-2xl lg:text-3xl")}>
                {campaign.title}
              </h2>
            )}

            {campaign.subtitle && (
              <h3 className={cn("mb-2", isMobile ? "text-base" : "text-lg lg:text-xl")}>
                {campaign.subtitle}
              </h3>
            )}

            {campaign.description && (
              <p className={cn("mb-4 opacity-90 whitespace-pre-line", isMobile ? "text-sm" : "text-base")}>
                {campaign.description}
              </p>
            )}

            {/* CTA button */}
            {hasCTA(campaign) && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCampaignClick(campaign);
                }}
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "mt-4 font-semibold",
                  hasImage(campaign)
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {campaign.ctaText}
              </Button>
            )}
          </div>
        )}

        {/* Empty content handling */}
        {contentType === "minimal" && <div className="w-full h-full" />}
      </div>
    );
  };

  if (activeCampaigns.length === 0) {
    return null;
  }

  // Single campaign - no carousel needed
  if (activeCampaigns.length === 1) {
    return <div className={className}>{renderCampaignContent(activeCampaigns[0])}</div>;
  }

  return (
    <div className={cn("relative group", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={autoPlay ? [plugin.current] : []}
        className="w-full"
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {activeCampaigns.map((campaign) => (
            <CarouselItem key={campaign.id}>
              <div className="cursor-pointer" onClick={() => handleCampaignClick(campaign)}>
                {renderCampaignContent(campaign)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - show on hover for desktop */}
        {showNavigation && !isMobile && (
          <>
            <CarouselPrevious
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "bg-white/20 backdrop-blur-sm border-white/30",
                "hover:bg-white/30 text-white",
              )}
            />
            <CarouselNext
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "bg-white/20 backdrop-blur-sm border-white/30",
                "hover:bg-white/30 text-white",
              )}
            />
          </>
        )}

        {/* Touch-friendly navigation for mobile */}
        {showNavigation && isMobile && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-none text-white hover:bg-black/70" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-none text-white hover:bg-black/70" />
          </>
        )}
      </Carousel>

      {/* Indicators */}
      {showIndicators && activeCampaigns.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activeCampaigns.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                "hover:bg-white/80",
                currentSlide === index
                  ? "bg-white"
                  : "bg-white/50"
              )}
              onClick={() => {
                carouselApi?.scrollTo(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
