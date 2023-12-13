import Features from "@/components/shared/Features";
import Cards from "@/components/shared/Cards";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Navbar from "@/components/shared/Navbar";
import About from "@/components/shared/About";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      
      <Cards />
      <About />  
      <Footer />
    </div>
  );
};

export default LandingPage;
