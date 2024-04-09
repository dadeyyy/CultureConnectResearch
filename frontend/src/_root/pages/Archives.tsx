import { provincesWithImage } from "@/lib/provinces";
import ProvinceCard from "@/components/shared/ProvinceCard";

const Explore = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="p-5">
        <h2 className="font-bold lg:text-2xl xs:text-xl">Provinces of the Philippines Archives</h2>
      </div>
      {/* <div className="p-5 overflow-y-scroll flex flex-wrap justify-start gap-5"> */}
      <div className="archive-container overflow-auto ">
        {provincesWithImage.map((province, index) => (
          <ProvinceCard key={index} province={province} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
