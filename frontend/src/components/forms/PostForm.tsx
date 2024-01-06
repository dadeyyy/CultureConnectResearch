import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { blacklist, municipals, provinces } from "./PostInfo";

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
});

type PostFormProps = {
  post?: {
    id: number;
    caption: string;
    createdAt: string;
    municipality: string;
    photos: {
      id: number;
      url?: string;
      filename: string;
      postId: number;
    }[];
    province: string;
    updatedAt: string;
    user: {
      avatarUrl: string | null;
      bio: string | null;
      createdAt: string;
      email: string;
      firstName: string;
      id: number;
      lastName: string;
      password: string;
      role: string;
      updatedAt: string;
      username: string;
    };
  };
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

  console.log(action);
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const caption = values.caption;

    if (blacklist.includes(caption)) {
      form.setError("caption", { type: "custom", message: `${caption} is not a valid caption` });
      return;
    }

    const formData = new FormData();

    formData.append("caption", values.caption);
    formData.append("province", values.province);
    formData.append("municipality", values.municipality);
    values.image.forEach((file) => {
      formData.append(`image`, file);
    });

    console.log(formData);

    // ACTION = UPDATE
    if (action === "Update") {
      try {
        const response = await fetch("http://localhost:8000/update-post", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Update successful!");
          console.log(data);
          navigate("/home");
        } else {
          console.error("Update failed");
          console.log(data);
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
      return navigate(`/home`);
    }

    // ACTION = CREATE
    else if (action === "Create") {
      console.log("CREATEEE ");
      try {
        const response = await fetch("http://localhost:8000/post", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Posting successful!");
          console.log(response);
          console.log(data);
          navigate("/home");
        } else {
          console.error("Posting failed");
          console.log("Response", response);
          console.log("Data", data);
        }
      } catch (error) {
        console.error("Error posting:", error);
      }
      return navigate(`/home`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 w-full max-w-5xl"
        encType="multipart/form-data"
      >
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
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.photos?.[0]?.url ?? ""}
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
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? provinces.find((province) => province.value === field.value)?.label
                          : "Select Province"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search province..." />
                      <CommandEmpty>No province found.</CommandEmpty>
                      <CommandGroup>
                        {provinces.map((province) => (
                          <CommandItem
                            value={province.label}
                            key={province.value}
                            onSelect={() => {
                              form.setValue("province", province.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                province.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
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
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? municipals.find((municipal) => municipal.value === field.value)?.label
                          : "Select Municipal"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search municipal..." />
                      <CommandEmpty>No municipal found.</CommandEmpty>
                      <CommandGroup>
                        {municipals.map((municipal) => (
                          <CommandItem
                            value={municipal.label}
                            key={municipal.value}
                            onSelect={() => {
                              form.setValue("municipality", municipal.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                municipal.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
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
