import React from "react";
import { SoXmarkCircle } from "solom-icon";
import Modal from "../elements/Modal";
import Button from "../elements/Button";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      <div className="relative">
        <div className="absolute top-[-10px] right-0 px-5">
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={onClose}
            />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-black text-center pt-8 mb-8">
          هل انت متأكد من تسجيل خروجك ؟
        </h2>
        <div className="w-full flex justify-center gap-4">
          <Button
            fullWidth
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            نعم
          </Button>
          <Button
            fullWidth
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-gray-800 rounded-md hover:bg-gray-500 transition"
          >
            لا
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmLogoutModal;
