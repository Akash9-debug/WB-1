import { toast } from 'react-toastify';

export const showPaymentNotification = (type, message) => {
    switch (type) {
        case 'success':
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            break;
        case 'error':
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            break;
        default:
            toast.info(message);
    }
}; 