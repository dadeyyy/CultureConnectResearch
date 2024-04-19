import React, { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  photos?:
    | {
        id?: number;
        url: string;
        filename: string;
        postId?: number;
      }[]
    | {
        id?: number;
        url: string;
        filename: string;
        postId?: number;
      };
};

const FileUploader = ({ fieldChange, photos }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    if (photos) {
      if (Array.isArray(photos) && photos.length > 0) {
        setFileUrls(photos.map((photo) => photo.url));
      } else if (!Array.isArray(photos)) {
        setFileUrls([photos.url]);
      }
    }
  }, [photos]);

  const [fileUrls, setFileUrls] = useState<string[]>(() => {
    if (photos) {
      if (Array.isArray(photos) && photos.length > 0) {
        return photos.map((photo) => photo.url);
      } else if (!Array.isArray(photos)) {
        return [photos.url];
      }
    }
    return [];
  });

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const updatedFiles = [...files, ...acceptedFiles];
      setFiles(updatedFiles);
      fieldChange(updatedFiles);

      const updatedFileUrls = updatedFiles.map((file) => URL.createObjectURL(file));
      setFileUrls(updatedFileUrls);
    },
    [files]
  );

  const removeAllFiles = () => {
    setFiles([]);
    setFileUrls([]);
    fieldChange([]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);

    const updatedFileUrls = fileUrls.filter((url, i) => i !== index);

    setFiles(updatedFiles);
    setFileUrls(updatedFileUrls);
    fieldChange(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    noClick: true,
  });

  const openFile = () => {
    inputRef.current?.click();
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col rounded-xl cursor-pointer bg-red-200 h-[500px]"
    >
      <input {...getInputProps()} className="cursor-pointer" ref={inputRef} />

      {fileUrls.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 max-h-screen justify-center overflow-y-auto gap-4 p-5 lg:p-10">
            {fileUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`image-${index}`} className="file_uploader-img" />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <p className="file_uploader-label">Drag photos to replace</p>
          <Button onClick={removeAllFiles} className="mt-4 bg-red-500">
            Remove All Pictures
          </Button>
        </>
      ) : (
        <div className="file_uploader-box">
          <img src="/assets/icons/file-upload.svg" width={96} height={77} alt="file upload" />
          <h3 className="base-medium text-dark-2 mb-2 mt-6">Drag photos here</h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
          <Button type="button" className="shad-button_primary" onClick={openFile}>
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
