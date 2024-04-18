import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { provincesTest, municipalities } from "@/lib/provinces";
import { blacklist } from "./PostInfo";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const formSchema = z.object({
  caption: z.string().min(0, {
    message: "You cannot create a post without a caption.",
  }),
  province: z.string({
    required_error: "Please select a province.",
  }),
  municipality: z.string({
    required_error: "Please select a municipal.",
  }),
  image: z.custom<File[]>(),
  tags: z.string(),
});

type PostFormProps = {
  action: "Create" | "Update";
};

type PostProps = {
  caption: string;
  createdAt: string;
  id: number;
  municipality: string;
  photos: {
    id: number;
    url: string;
    filename: string;
    postId: number;
  }[];
  province: string;
  updatedAt: string;
  userId: number;
  tags: string[];
};

const PostForm = ({ action }: PostFormProps) => {
  const { id } = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipal, setSelectedMunicipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Check Action
        if (action !== "Create") {
          const response = await fetch(`http://localhost:8000/post/${id}`);
          const data = await response.json();
          if (response.ok) {
            setPost(data);
            console.log(data);
          } else {
            console.error("Error fetching post:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id, action]);

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      municipality: post ? post?.municipality : "",
      province: post ? post?.province : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const caption = values.caption;
    console.log(values);
    setIsLoading(true);
    if (blacklist.includes(caption)) {
      form.setError("caption", {
        type: "custom",
        message: `${caption} is not a valid caption`,
      });
      return;
    }

    // ACTION = UPDATE
    if (action === "Update") {
      try {
        const formData = new FormData();

        formData.append("caption", values.caption);
        formData.append("province", values.province);
        formData.append("municipality", values.municipality);

        post?.photos.forEach((file) => {
          formData.append("existingImages", file.url);
        });

        if (values.image) {
          values.image.forEach((file) => {
            formData.append("newImages", file);
          });
        }

        const response = await fetch(`http://localhost:8000/post/${post?.id}`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Update successful!");
          setIsLoading(false);
          console.log(data);
          navigate("/home");
        } else {
          console.error("Update failed");
          setIsLoading(false);
          console.log(data);
        }
      } catch (error) {
        console.error("Error updating post:", error);
      } finally {
        setIsLoading(false);
      }
      return navigate(`/home`);
    }

    // ACTION = CREATE
    else if (action === "Create") {
      const formData = new FormData();

      formData.append("caption", values.caption);
      formData.append("province", values.province);
      formData.append("municipality", values.municipality);
      formData.append("tags", values.tags);
      // formData.append("image", values.image )
      if (values.image) {
        values.image.forEach((file) => {
          formData.append(`image`, file);
        });
      }
      console.log("CREATEEE ");
      try {
        const response = await fetch("http://localhost:8000/post", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!response.ok) {
          console.error("Error during POST request:", response);
          return;
        }
        const data = await response.json();
        console.log("Posting successful!", data);
        setIsLoading(false);
        navigate("/home");
      } catch (error) {
        console.error("Error during POST request:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  console.log(selectedMunicipal);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 w-full max-w-5xl"
        encType="multipart/form-data"
      >
        <div className="flex lg:flex-row xs:flex-col w-full gap-2">
          <div className="w-full flex flex-col gap-3">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      placeholder="Caption here"
                      {...field}
                      defaultValue={post?.caption}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Province</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? provincesTest.find((province) => province.value === field.value)
                                  ?.label
                              : post?.province
                              ? provincesTest.find((province) => province.value === post.province)
                                  ?.label
                              : "Select Province"}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command className="bg-white">
                          <CommandInput placeholder="Search province..." />
                          <CommandEmpty>No province found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {provincesTest.map((province) => (
                              <CommandItem
                                value={province.label}
                                key={province.value}
                                onSelect={() => {
                                  form.setValue("province", province.value);
                                  setSelectedProvince(province.value);
                                }}
                              >
                                {province.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Municipal</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={
                              !selectedProvince || !municipalities[selectedProvince]?.length
                            }
                          >
                            {selectedProvince !== null
                              ? (municipalities[selectedProvince] || []).find(
                                  (municipal) => municipal.value === field.value
                                )?.label
                              : post?.province
                              ? (municipalities[post.province] || []).find(
                                  (municipal) => municipal.value === post.municipality
                                )?.label
                              : "Select Municipality"}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command className="bg-white w-screen">
                          <CommandInput placeholder="Search municipal..." />
                          <CommandEmpty>No municipal found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {selectedProvince &&
                              municipalities[selectedProvince]?.map((municipal) => (
                                <CommandItem
                                  value={municipal.label}
                                  key={municipal.value}
                                  onSelect={() => {
                                    form.setValue("municipality", municipal.value);
                                    field.onChange(municipal.value); // Update the field.value
                                    console.log("Selected Municipality:", municipal.label);
                                  }}
                                >
                                  {municipal.label}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Add Tags (separated by comma " , ")
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Art, Expression, Learn"
                      type="text"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </div>
          <div className=" w-full">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Photos</FormLabel>
                  <FormControl>
                    <FileUploader fieldChange={field.onChange} photos={post?.photos} />
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
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark-4" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
