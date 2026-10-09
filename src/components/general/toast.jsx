
import toast from 'react-hot-toast';
import { IoMdAlert } from 'react-icons/io';

export const showAlreadyReadToast = (message) => {
  toast.success(message, {
    icon: <IoMdAlert size={24} className="text-blue-500" />,
  });
};
