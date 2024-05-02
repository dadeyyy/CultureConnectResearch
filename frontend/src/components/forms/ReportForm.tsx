import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useState } from "react";

const FormSchema = z.object({
  type: z.enum(["fake-info", "spam", "inappropriate", "hate-speech", "harassment"], {
    required_error: "Select a reason.",
  }),
});
const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const ReportForm = ({
  userId,
  postId,
  postUserId,
}: {
  userId: number;
  postId: number;
  postUserId: number;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [open, setOpen] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openNestedAlertDialog, setOpenNestedAlertDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = (selectedValue: string) => {
    setOpenAlertDialog(true);
  };

  const handleCancel = () => {
    setOpenAlertDialog(false);
  };

  const handleContinue = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${server}/post/${postId}/report`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: data.type }),
      });

      const responseData = await response.json();

      if (responseData.error) {
        toast.error(responseData.error);
        return;
      }

      toast.success(responseData.message);
      setOpenAlertDialog(false);
      setOpenNestedAlertDialog(true);
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error("An error occurred while reporting the post.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNestedContinue = () => {
    setOpenNestedAlertDialog(false);
  };

  const options = [{ label: "Report", value: "report" }];

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <img
            src={"/assets/icons/three-dots.svg"}
            alt="edit"
            width={20}
            height={20}
            className={userId === postUserId ? `hidden` : ""}
          />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] bg-light-2 p-0" side="top" align="end">
          <Command>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleOptionSelect}
                  className={`hover:bg-primary-1 cursor-pointer transition-colors ${
                    userId === postUserId && option.value === "report" ? "hidden" : ""
                  }`}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <AlertDialog open={openAlertDialog}>
              <AlertDialogContent className="bg-light-2 w-full">
                {isLoading && (
                  <div className="w-full">
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress />
                    </Box>
                  </div>
                )}
                <AlertDialogHeader>
                  <AlertDialogTitle className="border-2 border-light-2 border-b-gray-500">
                    Report Post.
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <span>State your reason for reporting this post.</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleContinue)} className="w-full space-y-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="fake-info" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Contains fake news and misinformation.
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="spam" />
                                </FormControl>
                                <FormLabel className="font-normal">It's Spam</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="inappropriate" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Contains Inappropriate Content.
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="hate-speech" />
                                </FormControl>
                                <FormLabel className="font-normal">Hate Speech or Symbol</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="harassment" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Harassment or Bullying
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row justify-end w-full ">
                      <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                      <Button
                        type="submit"
                        onClick={() => {
                          console.log("this button was pressed");
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </AlertDialogContent>

              <AlertDialog open={openNestedAlertDialog}>
                <AlertDialogContent className="bg-light-2">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report Submitted.</AlertDialogTitle>
                    <AlertDialogDescription>
                      Thank you for reporting this post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={handleNestedContinue}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </AlertDialog>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReportForm;
