// Province.tsx
import React from "react";

type ProvinceProps = {
  province: string;
};

const Province: React.FC<ProvinceProps> = ({ province }) => {
  return <div className="explore-card">{province}</div>;
};

export default Province;
