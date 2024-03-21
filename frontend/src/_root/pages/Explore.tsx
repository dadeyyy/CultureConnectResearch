import React, { useState } from "react";
import { provincesWithImage } from "@/lib/provinces";
import ProvinceCard from "@/components/shared/ProvinceCard";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(0, {
    message: "You cannot create a post without a caption.",
  }),
  description: z.string({
    required_error: "Please select a province.",
  }),
  province: z.string({
    required_error: "Please select a province.",
  }),
  municipality: z.string({
    required_error: "Please select a municipal.",
  }),
  image: z.custom<File[]>(),
});

interface ExploreProps {
  title: string;
  description: string;
  province: string;
  municipality: string;
  photos?: string;
}

const Explore = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      province: "",
      municipality: "",
    },
  });

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Your form submission logic here
  };

  const handleProvinceChange = (provinceValue: string) => {
    setSelectedProvince(provinceValue);
  };

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
