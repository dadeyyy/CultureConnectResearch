
import React, { useState } from 'react';
import { provincesTest, municipalities } from "@/lib/provinces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import FileUploader from '@/components/shared/FileUploader';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
  const dummyArchives = [
    {
      title: "Archive 1",
      description: "Description for Archive 1",
      province: "Province 1",
      municipality: "Municipality 1",
      image: "https://static.vecteezy.com/system/resources/thumbnails/025/181/412/small/picture-a-captivating-scene-of-a-tranquil-lake-at-sunset-ai-generative-photo.jpg",
    },
    {
      title: "Archive 2",
      description: "Description for Archive 2",
      province: "Province 2",
      municipality: "Municipality 2",
      image: "https://images.unsplash.com/photo-1603984973710-e915353b35fa?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1hemluZyUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    }
    // Add more dummy archives as needed
  ];
  const [archives, setArchives] = useState<ExploreProps | null>(dummyArchives[0]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title:  "",
      description:  "",
      province:  "",
      municipality:  "",
    },
  });


  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  }

  const handleProvinceChange = (provinceValue: string) => {
    setSelectedProvince(provinceValue);
  };


  return (
    <div className="p-5 overflow-y-scroll w-full">
      <div className='flex flex-col'><h1 className='font-bold mb-5'>Provinces: </h1> <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className='mb-5 mx-96 bg-blue-300'>Add data</Button>
      </DialogTrigger>
      <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 w-full max-w-5xl"
        encType="multipart/form-data"
      >
      <DialogContent className="sm:max-w-[800px] bg-white overflow-y-scroll max-h-[650px]">
        <DialogHeader>
          <DialogTitle>Add data</DialogTitle>
          <DialogDescription>
            Add data in archive based on municipality selected.
          </DialogDescription>
        </DialogHeader>
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email here"
                    className="border-r-2"
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your password here"
                    className="border-r-2 "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          
            <div className='grid grid-cols-2 gap-3'>
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
                          ? provincesTest.find((province) => province.value === field.value)?.label
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
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                        disabled={!selectedProvince || !municipalities[selectedProvince]?.length}
                      >
                        {selectedProvince !== null
                          ? (municipalities[selectedProvince] || []).find(
                              (municipal) => municipal.value === field.value
                            )?.label
                          : "Select Municipality"}

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command className="bg-white">
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" className='bg-blue-300'>Add</Button>
        </DialogFooter>
      </DialogContent>
      </form>
    </Form>
    </Dialog></div>      
      <Accordion type="single" collapsible className="w-full bg-blue-200 p-2 border border-rounded">
        {provincesTest.map((province) => (
          <AccordionItem key={province.value} value={province.value}>
            <AccordionTrigger onClick={() => handleProvinceChange(province.value)}>
              {province.label}
            </AccordionTrigger>
            <AccordionContent>
              {selectedProvince === province.value && (
                <Accordion type="single" collapsible className="w-full bg-blue-50 p-2 ">
                  {municipalities[province.value].map((municipality) => (
                    <AccordionItem key={municipality.value} value={municipality.value}>
                      <AccordionTrigger>{municipality.label}</AccordionTrigger>
                      <AccordionContent className=' w-full justify-items-center '> 
                      {/* <div>
                      <Carousel className="w-full max-w-xs mx-auto bg-white">
                      <CarouselContent style={{width: '100%'}}>
                      {dummyArchives.map((archive, index) => (
      <CarouselItem key={index}>
        <div className="p-1">
          <Card className='w-full'>
            <CardContent className="w-full flex aspect-square items-center justify-center p-10">
              <img src={archive.image}/>
            </CardContent>
          </Card>
        </div>

        <div className='border-4 p-2 '>
          <h1>Title:</h1>
          <span>{archive.title}</span>
          <h2>Description:</h2>
          <span>{archive.description}</span>
        </div>
                        </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                      </div> */}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Explore;
