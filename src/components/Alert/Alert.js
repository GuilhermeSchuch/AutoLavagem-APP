// Hooks
import { useEffect } from "react";

// Notifications
import { Store } from 'react-notifications-component';

const Alert = ({ title = '', message = '', type = 'success' }) => {
  return useEffect(() => {
    Store?.addNotification({
      title,
      message,
      type,
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  }, []);
}

export default Alert