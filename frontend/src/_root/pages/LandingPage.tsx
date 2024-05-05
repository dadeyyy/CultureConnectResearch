import Features from "@/components/shared/Features";
import Cards from "@/components/shared/Cards";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Navbar from "@/components/shared/Navbar";
import About from "@/components/shared/About";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckResult } from "@/lib/utils";
import toast from "react-hot-toast";

const LandingPage = () => {
  // const [result, setResult] = useState<CheckResult>();
  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/testnudes`, {
  //       credentials: "include",
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setResult(data);

  //       if (!result) {
  //         return;
  //       }
  //       if (
  //         result.gore.prob >= 0.8 ||
  //         result.nudity.erotica >= 0.8 ||
  //         result.nudity.sextoy >= 0.8 ||
  //         result.nudity.sexual_activity >= 0.8 ||
  //         result.nudity.sexual_display >= 0.8 ||
  //         result.offensive.prob >= 0.8
  //       ) {
  //         toast.error(
  //           "Your post has been removed because it violates our terms and agreements."
  //         );
  //       }
  //     } else {
  //       console.error("Error:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // console.log(result);

  return (
    <div>
      {/* <Button onClick={handleSubmit}>test</Button> */}
      <Navbar />
      <Hero />
      <Features />
      <Cards />
      {/* <About /> */}
      <Footer />
    </div>
  );
};

export default LandingPage;
