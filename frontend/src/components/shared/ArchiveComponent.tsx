import { multiFormatDateString } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ArchiveProps {
  category: string;
  id: number;
  municipality: string;
  title: string;
  province: string | undefined;
  createdAt: string;
}

const ArchiveComponent: React.FC<ArchiveProps> = ({
  createdAt,
  category,
  id,
  municipality,
  title,
  province,
}) => {
  return (
    <Link to={`/archives/${province}/${category}/${id}`}>
      <div className="px-5 py-2 border-2 hover:rounded-md w-full lg:w-[720px] xs:w-[350px] max-w-screen-lg border-transparent border-b-black  hover:border-black ease-in-out duration-300">
        <h2 className="text-md font-bold">{title}</h2>
        <p className="text-sm">Date Created: {multiFormatDateString(createdAt)}</p>
        <p className="text-sm capitalize">Municipality: {municipality}</p>
      </div>
    </Link>
  );
};

export default ArchiveComponent;
