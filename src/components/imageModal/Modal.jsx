import React from "react";
import CloseIcon from "./CloseIcon";
import ImageCropper from "./ImageCropper";

const Modal = ({ closeModal, updateAvatar, onFileChange }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-100 bg-opacity-10 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="relative w-full max-w-lg min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
          <div className="px-5 py-4">
            <button
              type="button"
              className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
              onClick={closeModal}
            >
              <span className="sr-only">Close menu</span>
              <CloseIcon />
            </button>
            <ImageCropper
              onFileChange={onFileChange}
              updateAvatar={updateAvatar}
              closeModal={closeModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
