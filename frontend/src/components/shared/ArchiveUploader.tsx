import React, { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

type ArchiveUploaderProps = {
  fieldChange: (files: File[]) => void;
  action: "Create" | "Update";
  photos?:
    | {
        url: string;
        filename: string;
      }[]
    | {
        url: string;
        filename: string;
      };
  onFilesRemoved: (removedFileNames: string[]) => void;
};

const ArchiveUploader = ({ fieldChange, action, photos, onFilesRemoved }: ArchiveUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [removedFileNames, setRemovedFileNames] = useState<string[]>([]);

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

      const newFileUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      const updatedFileUrls = [...fileUrls, ...newFileUrls];
      setFileUrls(updatedFileUrls);
    },
    [files, fieldChange, fileUrls]
  );

  const removeAllFiles = () => {
    setFiles([]);
    setFileUrls([]);
    fieldChange([]);

    if (photos) {
      const removedFileNames = Array.isArray(photos)
        ? photos.map((photo) => photo.filename)
        : [photos.filename];
      setRemovedFileNames(removedFileNames);
      onFilesRemoved(removedFileNames);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    const removedFile = updatedFiles.splice(index, 1)[0]; // Remove the file from the array and get the removed file
    const updatedFileUrls = [...fileUrls];
    updatedFileUrls.splice(index, 1); // Remove the corresponding URL

    setFiles(updatedFiles);
    setFileUrls(updatedFileUrls);
    fieldChange(updatedFiles);

    const removedFileName = getRemovedFileNames(index);

    if (removedFileName) {
      setRemovedFileNames((prevRemovedFileNames) => [...prevRemovedFileNames, removedFileName]);
      onFilesRemoved([removedFileName]);
    }
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

  const getRemovedFileNames = (index: number) => {
    if (Array.isArray(photos) && photos.length > index) {
      const removedFileName = photos[index]?.filename;
      return removedFileName;
    }
    return null;
  };

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-light-1 rounded-xl cursor-pointer overflow-auto w-full"
    >
      <input {...getInputProps()} className="cursor-pointer" ref={inputRef} />

      {fileUrls.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 max-h-[400px] justify-center overflow-y-auto gap-4 p-5 lg:p-10 w-full">
            {fileUrls.map((url, index) => (
              <div key={index} className="relative">
                {action === "Create" ? (
                  <>
                    {index < acceptedFiles.length && acceptedFiles[index].name.endsWith(".pdf") ? (
                      <div
                        className="p-1 border-2 active:border-white active:bg-blue-300 hover:border-blue-300 rounded-lg w-full hover:underline hover:text-blue-500 cursor-pointer"
                        onClick={() => window.open(url, "_blank")}
                      >
                        {url}
                      </div>
                    ) : index < acceptedFiles.length &&
                      acceptedFiles[index].name.endsWith(".mp4") ? (
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
                  </>
                ) : (
                  <>
                    {url.endsWith(".pdf") ? (
                      <div
                        className="p-1 border-2 active:border-white active:bg-blue-300 hover:border-blue-300 rounded-lg w-full hover:underline hover:text-blue-500 cursor-pointer"
                        onClick={() => window.open(url, "_blank")}
                      >
                        <img
                          src="/public/assets/images/pdf-image.svg"
                          alt="PDF Icon"
                          height={100}
                          width={100}
                        />
                        {Array.isArray(photos) && photos.length > 0 ? photos[0].filename : ""}
                      </div>
                    ) : url.endsWith(".mp4") ? (
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
                      onClick={() => {
                        removeFile(index);
                        // setRemovedFileNames([...removedFileNames, getFilenameFromUrl(url, photos)]);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          <Button type="button" className="shad-button_primary" onClick={openFile}>
            Click here to add more
          </Button>
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
