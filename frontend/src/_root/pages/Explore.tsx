import { provinces } from "@/dummy/dummy";
import Province from "@/components/shared/Province";

const Explore = () => {
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <div className="sticky top-0"></div>
        <div className="flex flex-col gap-1">
          <h2>All Provinces:</h2>
          <ul className="flex flex-col flex-1 gap-2 w-full">
            {provinces.map((province, index) => (
              <li key={index} className="flex justify-center w-full">
                <Province province={province} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Explore;
