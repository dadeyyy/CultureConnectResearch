import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FormSchema = z.object({
  title: z.string({ required_error: "title is required" }),
  details: z.string({ required_error: "details is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
  startDate: z.date({ required_error: "date is required" }),
  provinceId: z.string({ required_error: "provinceId is required" }),
  repeat: z.string({ required_error: "specify repeat" }),
  endDate: z.date().optional(),
});

interface IEvent {
  id: string;
  title: string;
  details: string;
  municipality: string;
  repeat: string;
  rrule: {
    freq: string;
    dtstart: string;
  };
  startDate: string;
  endDate: string;
  provinceId: string;
  location: { type: string; coordinates: [number, number] };
}

interface calendarProps {
  province: string;
  calendarDetails?: IEvent;
  action: "create" | "update";
}

const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const CalendarForm = ({ province, calendarDetails, action }: calendarProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      provinceId: province,
      title: calendarDetails?.title || "",
      details: calendarDetails?.details || "",
      municipality: calendarDetails?.municipality || "",
      repeat: calendarDetails?.repeat || "once",
      startDate: calendarDetails?.startDate ? new Date(calendarDetails.startDate) : new Date(),
      endDate: calendarDetails?.endDate ? new Date(calendarDetails.endDate) : undefined,
    },
  });

  //consts
  const [repeatValue, setRepeatValue] = useState(calendarDetails?.repeat || "once");
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const startDateUtcPlus8 = new Date(data.startDate.getTime() + 480 * 60 * 1000).toISOString();
    const endDateIsoString = data.endDate?.toISOString() ?? new Date().toISOString();
    const endDateUtcPlus8 = new Date(endDateIsoString).getTime() + 8 * 60 * 60 * 1000;
    const endDateUtcPlus8Iso = new Date(endDateUtcPlus8).toISOString();

    console.log(startDateUtcPlus8);
    if (action === "create") {
      const formData = {
        title: data.title,
        details: data.details,
        provinceId: data.provinceId,
        repeat: data.repeat,
        startDate: startDateUtcPlus8,
        endDate: data.endDate ? endDateUtcPlus8Iso : undefined,
        municipality: data.municipality,
      };
      console.log(formData.startDate);
      try {
        const response = await fetch(`${server}/create-calendar`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          toast.success("Event created!");
          window.location.reload();
        } else {
          toast.error("Can't create an event");
        }
      } catch (error) {
        toast.error(`Error creating an event Error message ${error}`);
      } finally {
        setIsLoading(false); // Reset loading state after form submission completes
      }
    } else {
      const formData = {
        title: data.title,
        details: data.details,
        provinceId: data.provinceId,
        repeat: data.repeat,
        startDate: startDateUtcPlus8,
        endDate: data.endDate ? endDateUtcPlus8Iso : undefined,
        municipality: data.municipality,
      };

      try {
        const response = await fetch(
          `${server}/update-calendar/${calendarDetails?.id}`,
          {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          toast.success("Event updated!");
          window.location.reload();
        } else {
          toast.error("Can't update an event");
        }
      } catch (error) {
        toast.error(`Error updating an event Error message ${error}`);
      } finally {
        setIsLoading(false); // Reset loading state after form submission completes
      }
    }
  }

  const isPastDate = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 relative">
        {isLoading && (
          <div className="w-full ">
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </div>
        )}

        <FormField
          control={form.control}
          name="provinceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input {...field} type="text" readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Barangay, Municipality or Municipality Only)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Barangay, Municipality or Municipality only"
                  className="col-span-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter Title" className="col-span-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter Details" className="col-span-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat</FormLabel>
              <Select
                onValueChange={(value) => {
                  setRepeatValue(value);
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select repeat" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="once">No Repeat</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={isPastDate}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {repeatValue !== "once" && (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={isPastDate}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex w-full justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default CalendarForm;
