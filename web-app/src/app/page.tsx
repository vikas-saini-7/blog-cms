import Hero from "@/components/landing/Hero";
import FeaturedBlogsSesion from "@/components/landing/FeaturedBlogsSesion";
import PopularSection from "@/components/landing/PopularSection";
// import TrendingByTags from "@/components/landing/TrendingByTags";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedBlogsSesion />
      <PopularSection />
      {/* <TrendingByTags /> */}
      <CTASection />
    </>
  );
}
