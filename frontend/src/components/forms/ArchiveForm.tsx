import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { provincesTest, municipalities } from '@/lib/provinces';
import { FileWithPath, useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ArchiveUploader from '../shared/ArchiveUploader';
import { useNavigate } from 'react-router-dom';

interface ArchiveFormProps {
  closeDrawer: () => void;
  provinceData: string | undefined;
  action: 'Create' | 'Update';
  photos?:
    | {
        id: number;
        url: string;
        filename: string;
        postId: number;
      }[]
    | {
        id: number;
        url: string;
        filename: string;
        postId: number;
      };
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'You cannot create an archive without a title.',
  }),
  description: z.string({
    required_error: 'Add a description.',
  }),
  municipality: z.string({
    required_error: 'Please select a municipal.',
  }),
  archive: z.custom<File[]>(),
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
  province: string;
  updatedAt: string;
};

const ArchiveForm: React.FC<ArchiveFormProps> = ({
  closeDrawer,
  provinceData,
  action,
  photos,
}) => {
  const [province, setProvince] = useState(provinceData);
  const [archive, setArchive] = useState<Archive | null>(null);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | undefined
  >();
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  //FORM
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: archive ? archive?.title : '',
      municipality: archive ? archive?.municipality : '',
    },
  });

  useEffect(() => {
    const label = provincesTest.find((item) => item.value === province)?.label;
    setProvinceLabel(label);
  }, [province]);

  //SUBMIT
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    // ACTION = UPDATE
    if (action === 'Update') {
    }

    // ACTION = CREATE
    else if (action === 'Create') {
      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('description', values.description);
      if (provinceData !== undefined) {
        formData.append('province', provinceData);
      }
      formData.append('municipality', values.municipality);
      // formData.append("files", values.archive);
      if (values.archive) {
        console.log(values.archive);
        values.archive.forEach((file) => {
          formData.append(`archive`, file);
        });
      }
      console.log('CREATEEE ');
      try {
        const response = await fetch(
          `http://localhost:8000/archive/${provinceData}`,
          {
            method: 'POST',
            body: formData,
            credentials: 'include',
          }
        );
        if (!response.ok) {
          console.error('Error during POST request:', response);
          return;
        }
        const data = await response.json();
        console.log('Creation successful!', data);
        navigate('/explore/${province}');
      } catch (error) {
        console.error('Error during POST request:', error);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        encType="multipart/form-data"
      >
        <div className="p-2">
          <div className="grid grid-cols-2 w-full h-full">
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
                                defaultValue={archive?.title}
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
                                defaultValue={archive?.description}
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
                                    defaultValue={field.value}
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
                            photos={archive?.files}
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
            <Button className="w-1/6 add-archive-cancel" onClick={closeDrawer}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ArchiveForm;
