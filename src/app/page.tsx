import { Suspense } from "react";
import { SiteHero } from "@/components/home/hero-slider";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { FeaturedStudiosSkeleton } from "@/components/home/featured-studios-skeleton";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/host-guarantee";
import AboutSection from "@/components/home/about-us";
import Footer from "@/components/layout/fotter";

export default function Home() {
  return (
    <>
      <SiteHero />
  
      <Suspense fallback={<FeaturedStudiosSkeleton />}>
        <FeaturedStudios />
      </Suspense>
      <CategoryCards />
      <HowItWorks />
      <HostGuarantee />
      <AboutSection />
      <Footer />
    </>
  );
}
