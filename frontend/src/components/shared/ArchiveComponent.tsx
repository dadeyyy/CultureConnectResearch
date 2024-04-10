import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ArchiveProps {
  category: string;
  id: number;
  municipality: string;
  title: string;
  province: string | undefined;
}

const ArchiveComponent: React.FC<ArchiveProps> = ({
  category,
  id,
  municipality,
  title,
  province,
}) => {
  return (
    <Link to={`/archives/${province}/${category}/${id}`}>
      <div className="p-5 border-2 rounded-md w-[325px] border-b-black hover:border-black ease-in-out duration-300">
        <h2 className="text-md font-bold">{title}</h2>
        <p className="text-regular">Municipality: {municipality}</p>
      </div>
    </Link>
  );
};

export default ArchiveComponent;
