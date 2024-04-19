import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { provincesTest, municipalities } from "@/lib/provinces";
import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ArchiveUploader from "../shared/ArchiveUploader";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

interface ArchiveFormProps {
  provinceData: string | undefined;
  action: "Create" | "Update";
  archiveData?: {
    id: number;
    title: string;
    description: string;
    municipality: string;
    dateCreated: string;
    files: {
      url: string;
      filename: string;
    }[];
    category: string;
  };
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "You cannot create an archive without a title.",
  }),
  description: z.string({
    required_error: "Add a description.",
  }),
  municipality: z.string({
    required_error: "Please select a municipal.",
  }),
  category: z.string({ required_error: "category is required" }),
  archive: z.custom<File[]>(),
  deletedFiles: z.array(z.string()).optional(),
});

type Archive = {
  title: string;
  createdAt: string;
  description: string;
  id: number;
  municipality: string;
  files: {
    url: string;
    filename: string;
  }[];
  category: string;
  province: string;
  updatedAt: string;
};

const ArchiveForm: React.FC<ArchiveFormProps> = ({
  provinceData,
  action,
  archiveData,
}) => {
  const [province, setProvince] = useState(provinceData);
  const [archive, setArchive] = useState<Archive | null>(null);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | undefined
  >();
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //FORM
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: archiveData?.title || "", // Provide default value for title
      description: archiveData?.description || "", // Provide default value for description
      municipality: archiveData?.municipality || "", // Provide default value for municipality
      category: archiveData?.category || "",
    },
  });

  useEffect(() => {
    const label = provincesTest.find((item) => item.value === province)?.label;
    setProvinceLabel(label);
  }, [province]);

  //SUBMIT
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // ACTION = UPDATE
    if (action === "Update") {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      if (provinceData !== undefined) {
        formData.append("province", provinceData);
      }
      formData.append("municipality", values.municipality);
      formData.append("category", values.category);

      if (values.archive) {
        values.archive.forEach((file) => {
          formData.append("archive", file);
        });
      }
      if (deletedFiles.length > 0) {
        deletedFiles.forEach((fileName) => {
          formData.append("deletedFiles[]", fileName);
        });
      }

      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      try {
        const response = await fetch(
          `http://localhost:8000/archive/${provinceData}/${archiveData?.id}`,
          {
            method: "PUT",
            body: formData,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response);
        if (!response.ok) {
          console.error("Error during PUT request:", response);
          return;
        }

        const data = await response.json();
        console.log("Update successful!", data);
        navigate(`/explore/${province}/archive/${archiveData?.id}`);
      } catch (error) {
        console.error("Error during POST request:", error);
      } finally {
        setIsLoading(false); // Reset loading state after form submission completes
      }
    }

    // ACTION = CREATE
    else if (action === "Create") {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      if (provinceData !== undefined) {
        formData.append("province", provinceData);
      }
      formData.append("municipality", values.municipality);

      if (values.archive) {
        console.log(values.archive);
        values.archive.forEach((file) => {
          formData.append(`archive`, file);
        });
      }
      try {
        const response = await fetch(
          `http://localhost:8000/archive/${provinceData}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!response.ok) {
          console.error("Error during POST request:", response);
          return;
        }
        const data = await response.json();
        console.log("Creation successful!", data);
        navigate(`/explore/${province}`);
      } catch (error) {
        console.error("Error during POST request:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFilesRemoved = (removedFileNames: string[]) => {
    // Update the state of deletedFiles
    setDeletedFiles((prevDeletedFiles) => [
      ...prevDeletedFiles,
      ...removedFileNames,
    ]);
  };

  console.log(isLoading);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        encType="multipart/form-data"
      >
        <div className="p-2">
          {isLoading && (
            <div className="w-full ">
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            </div>
          )}
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 w-full h-full">
            <div className="lg:min-h-[550px] m-2">
              <Card className="w-full h-full">
                <CardContent>
                  <div className="grid w-full items-center gap-4 pt-5">
                    <div className="flex flex-col space-y-1.5">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="shad-form_label">
                              Title
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="shad-textarea custom-scrollbar"
                                placeholder="Enter the archive title here."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="shad-form_label">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="shad-textarea custom-scrollbar"
                                placeholder="Enter Description here."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      {provinceData && (
                        <div className="flex flex-col space-y-1.5">
                          <FormField
                            control={form.control}
                            name="municipality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="shad-form_label">
                                  Title
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={archiveData?.municipality}
                                  >
                                    <SelectTrigger id="municipality">
                                      <SelectValue
                                        placeholder={`Select municipality from ${provinceLabel}`}
                                      >
                                        {selectedMunicipality}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent
                                      position="popper"
                                      className="bg-white"
                                    >
                                      {municipalities[provinceData].map(
                                        (municipality) => (
                                          <SelectItem
                                            key={municipality.value}
                                            value={municipality.value}
                                            onSelect={() =>
                                              setSelectedMunicipality(
                                                municipality.value
                                              )
                                            }
                                          >
                                            {municipality.label}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Please select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="document">
                                  Historical Document
                                </SelectItem>
                                <SelectItem value="artifacts">
                                  Artifacts
                                </SelectItem>
                                <SelectItem value="monuments">
                                  Monuments and buildings
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:min-h-[450px] lg:max-h-[550px] m-2">
              <Card className="w-full h-full p-5">
                <CardContent>
                  <FormField
                    control={form.control}
                    name="archive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-lg">
                          Add photos, video, or pdf.
                        </FormLabel>
                        <FormControl>
                          <ArchiveUploader
                            fieldChange={field.onChange}
                            photos={archiveData?.files}
                            action={action}
                            onFilesRemoved={handleFilesRemoved} // Add this line
                          />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex-row-reverse flex mt-2">
            <Button className="w-1/6 add-archive-submit ">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ArchiveForm;
