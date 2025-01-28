import React from 'react';
import './Notification.scss';

interface NotificationProps {
  message: string;
  isVisible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default Notification; 