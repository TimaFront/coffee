import React, { useState } from 'react';
import './CheckoutModal.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearCart } from '../../store/slices/cartSlice';
import SuccessModal from './SuccessModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  entrance?: string;
  apartment?: string;
  isPrivateHouse: boolean;
  paymentMethod: 'card' | 'cash';
  comment: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    entrance: '',
    apartment: '',
    isPrivateHouse: false,
    paymentMethod: 'card',
    comment: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checkout data:', formData);
    dispatch(clearCart());
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const getItemSizeInfo = (item: typeof cartItems[0]) => {
    if (item.product.type === 'coffee' && item.selectedSize) {
      return `${item.selectedSize} мл`;
    }
    return '';
  };

  const getItemPrice = (item: typeof cartItems[0]) => {
    if (item.product.type === 'coffee' && item.selectedSize) {
      return item.product.volumes?.find(v => v.size === item.selectedSize)?.price || 0;
    }
    return item.product.price || 0;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="checkout-modal" onClick={e => e.stopPropagation()}>
          <button className="checkout-modal__close" onClick={onClose}>×</button>
          
          <div className="checkout-modal__header">
            <h2>Оформление заказа</h2>
          </div>

          <div className="checkout-modal__order-summary">
            <h3>Ваш заказ:</h3>
            <div className="checkout-modal__items">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="checkout-modal__item">
                  <div className="checkout-modal__item-info">
                    <span className="checkout-modal__item-name">{item.product.name}</span>
                    {item.product.type === 'coffee' && item.selectedSize && (
                      <span className="checkout-modal__item-size">{getItemSizeInfo(item)}</span>
                    )}
                  </div>
                  <div className="checkout-modal__item-details">
                    <span className="checkout-modal__item-quantity">×{item.quantity}</span>
                    <span className="checkout-modal__item-price">{getItemPrice(item)}₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-modal__form">
            <div className="checkout-modal__section">
              <h3>Адрес доставки</h3>
              <div className="checkout-modal__address-type">
                <label className="switch">
                  <input
                    type="checkbox"
                    name="isPrivateHouse"
                    checked={formData.isPrivateHouse}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                  <span className="label">Частный дом</span>
                </label>
              </div>
              <input
                type="text"
                name="address"
                placeholder="Улица, дом"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              {!formData.isPrivateHouse && (
                <>
                  <input
                    type="text"
                    name="entrance"
                    placeholder="Подъезд"
                    value={formData.entrance}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Квартира"
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </div>

            <div className="checkout-modal__section">
              <h3>Способ оплаты</h3>
              <div className="checkout-modal__payment">
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

            <div className="checkout-modal__section">
              <h3>Ваши данные</h3>
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
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="checkout-modal__section">
              <h3>Комментарий к заказу</h3>
              <textarea
                name="comment"
                placeholder="Комментарий"
                value={formData.comment}
                onChange={handleInputChange}
              />
            </div>

            <div className="checkout-modal__footer">
              <div className="checkout-modal__total">
                <span>Итого к оплате:</span>
                <span className="checkout-modal__total-price">{totalAmount}₽</span>
              </div>
              <button type="submit" className="checkout-modal__submit">
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

export default CheckoutModal; 