import Typed from "react-typed";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="text-black">
      <div className="max-w-[800px] mt-[-96px] w-screen h-screen mx-auto text-center flex flex-col items-center justify-center">
        <p className="text-gray font-bold p-2">Connecting different cultures in the Philippines</p>
        <img src="/assets/images/logo-2.svg" alt="logo" width={400} height={325} />
        <div className="flex justify-center items-center">
          <p className="md:text-4xl sm:text-4xl text-xl font-bold py-4">Empowering cultures of</p>
          <Typed
            className="md:text-4xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
            strings={[
              "Abra",
              "Agusan del Norte",
              "Agusan del Sur",
              "Aklan",
              "Albay",
              "Antique",
              "Apayao",
              "Aurora",
              "Basilan",
              "Bataan",
              "Batanes",
              "Batangas",
              "Benguet",
              "Biliran",
              "Bohol",
              "Bukidnon",
              "Bulacan",
              "Cagayan",
              "Camarines Norte",
              "Camarines Sur",
              "Camiguin",
              "Capiz",
              "Catanduanes",
              "Cavite",
              "Cebu",
              "Compostela Valley",
              "Cotabato",
              "Davao de Oro",
              "Davao del Norte",
              "Davao del Sur",
              "Davao Occidental",
              "Davao Oriental",
              "Dinagat Islands",
              "Eastern Samar",
              "Guimaras",
              "Ifugao",
              "Ilocos Norte",
              "Ilocos Sur",
              "Iloilo",
              "Isabela",
              "Kalinga",
              "La Union",
              "Laguna",
              "Lanao del Norte",
              "Lanao del Sur",
              "Leyte",
              "Maguindanao",
              "Marinduque",
              "Masbate",
              "Misamis Occidental",
              "Misamis Oriental",
              "Mountain Province",
              "Negros Occidental",
              "Negros Oriental",
              "Northern Samar",
              "Nueva Ecija",
              "Nueva Vizcaya",
              "Occidental Mindoro",
              "Oriental Mindoro",
              "Palawan",
              "Pampanga",
              "Pangasinan",
              "Quezon",
              "Quirino",
              "Rizal",
              "Romblon",
              "Samar",
              "Sarangani",
              "Siquijor",
              "Sorsogon",
              "South Cotabato",
              "Southern Leyte",
              "Sultan Kudarat",
              "Sulu",
              "Surigao del Norte",
              "Surigao del Sur",
              "Tarlac",
              "Tawi-Tawi",
              "Zambales",
              "Zamboanga del Norte",
              "Zamboanga del Sur",
              "Zamboanga Sibugay",
            ]}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className="md:text-2xl text-xl font-bold text-gray-500">
          A Social Media Platform Connecting Different Cultures in the Philippines Utilizing
          Content-Based Filtering Algorithms
        </p>
        <Link
          to="/signup"
          className="leftsidebar-create w-[200px] rounded-md font-medium my-6 mx-auto py-3"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Hero;
