import React, { useEffect, useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import styles from "./ImageUploader.module.scss";
import { Input } from "@/components/ui/input";

export default function ImageUploader({
  image,
  setImage,
  isUploaded,
  setIsUploaded,
  setFilename,
  filename,
  field,
}) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);

  useEffect(() => {
    const handleDocumentDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDocumentDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Adding event listeners to the document
    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("drop", handleDocumentDrop);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
      base64Img(e.dataTransfer);
    }
  };

  // triggers when file is selected with click
  const handleImageChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      base64Img(e.target);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  // To convert img into base64 string
  const base64Img = (e) => {
    let reader = new FileReader();

    reader.onload = function (e) {
      setImage(e.target.result);
      field.onChange(e.target.result);
      setIsUploaded(true);
    };

    reader.readAsDataURL(e.files[0]);
  };

  const handleFile = (files) => {
    setFilename(files.name);
  };

  return (
    <>
      <div className={styles["file__uploder"]} onDragEnter={handleDrag}>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          id="input-file-upload"
          onChange={handleImageChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? styles["drag-active"] : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <span className={styles["upload-button"]} onClick={onButtonClick}>
              Upload a file
            </span>
          </div>
        </label>
        {dragActive && (
          <div
            id={styles["drag-file-element"]}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </div>

      {isUploaded && (
        <div className={styles["file__preview"]}>
          <img
            id={styles["uploaded-image"]}
            src={image}
            draggable={false}
            alt={filename}
          />

          <span className={styles["file__name"]}>{filename}</span>

          <MdClose
            className={styles["close-icon"]}
            onClick={() => {
              setIsUploaded(false);
              setImage(null);
            }}
          />
        </div>
      )}
    </>
  );
}
