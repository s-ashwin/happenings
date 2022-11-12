import { toast } from "react-toastify";

export const handleError = (error) => {
  if (error) {
    if (
      error.message ===
      'duplicate key value violates unique constraint "user_url_url_key"'
    ) {
      error.message =
        "The URL you have entered is already taken by another user.";
    }
    toast.error(error.message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined
    });
  }
};

export const handleSuccess = (message) => {
  if (message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined
    });
  }
};
