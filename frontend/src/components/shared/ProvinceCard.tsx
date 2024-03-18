// ProvinceCard.tsx
import React from "react";

interface Props {
  province: { value: string; label: string; image: string };
}

const ProvinceCard: React.FC<Props> = ({ province }) => {
  return (
    <div className="w-full h-full border rounded-lg opacity-50 relative hover:opacity-100 hover:scale-110 transition delay-150 duration-300 ease-in-out">
      <img
        src={province.image}
        alt="edit"
        className="object-cover rounded-lg h-full w-full aspect-square"
        height={200}
        width={200}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center font-bold text-xl">{province.label}</div>
      </div>
    </div>
  );
};

export default ProvinceCard;
