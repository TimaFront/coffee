import React, { useState } from 'react';
import './OrderModal.scss';
import { ParsedProduct } from '../../types';
import SuccessModal from './SuccessModal';

interface OrderModalProps {
  product: ParsedProduct;
  selectedSize?: number;
  onClose: () => void;
  isOpen: boolean;
}

interface OrderForm {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'card' | 'cash';
  comment: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ product, selectedSize, onClose, isOpen }) => {
  const [formData, setFormData] = useState<OrderForm>({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    comment: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки заказа
    console.log('Order data:', { product, ...formData });
    setShowSuccess(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPrice = () => {
    if (product.type === 'coffee' && product.volumes) {
      const size = selectedSize || product.volumes[0].size;
      const volumeOption = product.volumes.find(v => v.size === size);
      return `${volumeOption?.price}₽`;
    }
    return `${product.price}₽`;
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal__close" onClick={onClose}>×</button>
          
          <div className="modal__header">
            <h2>Быстрый заказ</h2>
          </div>

          <div className="modal__product">
            <img 
              src={`/images/${product.type}/${product.imageurl}`} 
              alt={product.name} 
              className="modal__product-image"
            />
            <div className="modal__product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span className="modal__product-price">{getPrice()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="modal__form">
            <div className="modal__form-group">
              <h4>Контактные данные</h4>
              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Номер телефона"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Адрес доставки"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="modal__form-group">
              <h4>Способ оплаты</h4>
              <div className="modal__payment-methods">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  Картой
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                  />
                  Наличными
                </label>
              </div>
            </div>

            <div className="modal__form-group">
              <h4>Дополнительно</h4>
              <textarea
                name="comment"
                placeholder="Комментарий к заказу"
                value={formData.comment}
                onChange={handleInputChange}
              />
            </div>

            <div className="modal__footer">
              <div className="modal__total">
                <span>К оплате:</span>
                <span className="modal__total-price">{getPrice()}</span>
              </div>
              <button type="submit" className="modal__submit">
                Оформить заказ
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal
        customerName={formData.name}
        isOpen={showSuccess}
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default OrderModal; 