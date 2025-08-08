import toast from 'react-hot-toast';

export const showSuccessNotification = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

export const showErrorNotification = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

export const showLoadingNotification = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissNotification = (toastId: string) => {
  toast.dismiss(toastId);
};
