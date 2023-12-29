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

const provinces = [
  { label: "Metro Manila", value: "metro_manila" },
  { label: "Cavite", value: "cavite" },
  { label: "Laguna", value: "laguna" },
  { label: "Batangas", value: "batangas" },
  { label: "Quezon", value: "quezon" },
  { label: "Rizal", value: "rizal" },
  { label: "Bulacan", value: "bulacan" },
  { label: "Pampanga", value: "pampanga" },
  { label: "Nueva Ecija", value: "nueva_ecija" },
] as const;

const municipals = [
  { label: "Makati City", value: "makati" },
  { label: "Tagaytay City", value: "tagaytay" },
  { label: "San Pedro", value: "san_pedro" },
  { label: "Lipa City", value: "lipa" },
  { label: "Lucena City", value: "lucena" },
  { label: "Antipolo City", value: "antipolo" },
  { label: "Malolos City", value: "malolos" },
  { label: "Angeles City", value: "angeles" },
  { label: "Cabanatuan City", value: "cabanatuan" },
] as const;

const formSchema = z.object({
  caption: z.string().min(0, {
    message: "You cannot create a post without a caption.",
  }),
  province: z.string({
    required_error: "Please select a province.",
  }),
  municipal: z.string({
    required_error: "Please select a municipal.",
  }),
  file: z.custom<File[]>(),
});

type PostFormProps = {
  post?: {
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      imageUrl?: string;
    };
    $id: string;
    $createdAt: string;
    province: string;
    municipal: string;
    caption: string;
    imageUrl?: string;
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

  // const { mutateAsync: createPost, isLoading: isLoadingCreate } = useCreatePost();
  // const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  //   const { register, handleSubmit } = useForm();
  //   async function onSubmit(data) {
  //       const formData = new FormData();
  //       formData.append("example", data.example);
  //       for (const image of data.image) {
  //         formData.append("image", image);
  //       }
  //       const result = await fetch("http://localhost:8000/post", {
  //         method: "POST",
  //         body: formData,
  //       });
  //       console.log(result);
  //   }

  //   return (
  //     /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  //     <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
  //       {/* register your input into the hook by invoking the "register" function */}
  //       <input {...register("example")} />

  //       <input type="file" {...register("image")} multiple />

  //       <input type="submit" />
  //     </form>
  //   );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-5xl">
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
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
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
            name="municipal"
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
                              form.setValue("municipal", municipal.value);
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
