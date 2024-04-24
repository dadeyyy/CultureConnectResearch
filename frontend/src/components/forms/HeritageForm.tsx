import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { municipalities } from "@/lib/provinces";
import { useState } from "react";
import { Input } from "../ui/input";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import toast from "react-hot-toast";
import { Label } from "../ui/label";

const formSchema = z.object({
  name: z.string().min(0, {
    message: "Add name",
  }),
  description: z.string({
    required_error: "Please add a description.",
  }),
  municipality: z.string({
    required_error: "Please select a municipal.",
  }),
  heritage: z.custom<File[]>(),
});

interface HeritageProps {
  provinceData: string | undefined;
  action: "Create" | "Update";
}

const HeritageForm = ({ provinceData, action }: HeritageProps) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [province, setProvince] = useState(provinceData);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | undefined
  >();
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      municipality: "",
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    console.log(values);
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (provinceData !== undefined) {
      formData.append("province", provinceData);
    }
    formData.append("municipality", values.municipality);

    if (values.heritage) {
      console.log(values.heritage);
      values.heritage.forEach((file) => {
        formData.append(`heritage`, file);
      });
    }

    try {
      const response = await fetch(
        `http://localhost:8000/heritage/${provinceData}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Creation Failed");
        return;
      }
      const data = await response.json();
      toast.success("Creation successful!", data);
      navigate(0);
    } catch (error) {
      console.error("Error during POST request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesRemoved = (removedFileNames: string[]) => {
    // Update the state of deletedFiles
    setDeletedFiles((prevDeletedFiles) => [
      ...prevDeletedFiles,
      ...removedFileNames,
    ]);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 w-full max-w-5xl h-full"
        encType="multipart/form-data"
      >
        <div className="flex xs:flex-col w-full gap-2">
          <div className="w-full flex flex-col gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      placeholder="Enter your caption here."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add description here"
                      type="text"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl">
              {provinceData && (
                <div className="flex flex-col gap-4">
                  <Label className="shad-form_label">Province</Label>
                  <Input
                    className="capitalize"
                    type="text"
                    defaultValue={provinceData}
                    readOnly
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Municipality"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="heritage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Photos</FormLabel>
                  <FormControl>
                    <FileUploader
                      fieldChange={field.onChange}
                      action={action}
                      onFilesRemoved={handleFilesRemoved}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </div>
        </div>
        {isLoading && (
          <div className="w-full ">
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </div>
        )}
        <div className="flex gap-4 items-center justify-end pb-7">
          <Button
            type="button"
            className="shad-button_dark-4"
            onClick={() => navigate(0)}
          >
            Cancel
          </Button>
          <Button
            className="shad-button_primary whitespace-nowrap"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HeritageForm;
