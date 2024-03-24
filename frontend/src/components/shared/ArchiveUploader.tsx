import React, { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

type ArchiveUploaderProps = {
  fieldChange: (files: File[]) => void;
  photos?:
    | {
        url: string;
        filename: string;
      }[]
    | {
        url: string;
        filename: string;
      };
};

const ArchiveUploader = ({ fieldChange, photos }: ArchiveUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>();

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

  const { getRootProps, acceptedFiles, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
      "video/mp4": [],
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
      className="flex flex-center flex-col bg-light-1 rounded-xl cursor-pointer overflow-auto w-full"
    >
      <input {...getInputProps()} className="cursor-pointer" ref={inputRef} />
      {/* <a href={url} target="_blank" rel="noopener noreferrer">
                  {acceptedFiles.map((file) => (
                    <li key={file.name}>
                      {file.name} - {file.size} bytes
                    </li>
                  ))}
                </a> */}
      {fileUrls.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 max-h-[400px] justify-center overflow-y-auto gap-4 p-5 lg:p-10 w-full">
            {fileUrls.map((url, index) => (
              <div key={index} className="relative">
                {acceptedFiles[index].name.endsWith(".pdf") ? (
                  <div
                    className="p-1 border-2 active:border-white active:bg-blue-300 hover:border-blue-300 rounded-lg w-full hover:underline hover:text-blue-500 cursor-pointer"
                    onClick={() => window.open(url, "_blank")}
                  >
                    {acceptedFiles[index].name}
                  </div>
                ) : acceptedFiles[index].name.endsWith(".mp4") ? (
                  <video controls width="100%" height="auto">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={url}
                    alt={`file-${index}`}
                    className="file_uploader-img aspect-square"
                  />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <Button onClick={removeAllFiles} className="mt-4 bg-red-500">
            Remove All Files
          </Button>
        </>
      ) : (
        <div className="flex-center flex-col p-7 h-80 lg:h-[550px]">
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

export default ArchiveUploader;
