import HeroSection from "@/components/common/home/HeroSection";
import HowitWorks from "@/components/common/home/HowitWorks";

export default function Home() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <div className="bg-gray-100">
        <HowitWorks />
      </div>
    </div>
  );
}
