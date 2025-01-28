import React from 'react';
import './SuccessModal.scss';

interface SuccessModalProps {
  customerName: string;
  onClose: () => void;
  isOpen: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ customerName, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={e => e.stopPropagation()}>
        <div className="success-modal__content">
          <h2 className="success-modal__title">Спасибо, {customerName}!</h2>
          <p className="success-modal__message">Ваш заказ успешно оформлен</p>
          <button className="success-modal__button" onClick={onClose}>
            Отлично
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 