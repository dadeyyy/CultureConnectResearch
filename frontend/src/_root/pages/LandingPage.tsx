import Analytics from "@/components/shared/Analytics";
import Cards from "@/components/shared/Cards";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Navbar from "@/components/shared/Navbar";
import Newsletter from "@/components/shared/Newsletter";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Analytics />
      <Newsletter />
      <Cards />
      <Footer />
    </div>
  );
};

export default LandingPage;
