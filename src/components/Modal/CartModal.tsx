import React, { useState } from 'react';
import './CartModal.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity, addToCart } from '../../store/slices/cartSlice';
import CheckoutModal from './CheckoutModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleSizeChange = (productId: number, currentSize: number | undefined, newSize: number) => {
    const currentItem = cartItems.find(item => 
      item.product.id === productId && item.selectedSize === currentSize
    );
    
    if (currentItem) {
      // Добавляем новый товар с выбранным размером
      dispatch(addToCart({ 
        product: currentItem.product, 
        selectedSize: newSize,
        quantity: 1
      }));
    }
  };

  const handleQuantityChange = (productId: number, selectedSize: number | undefined, newQuantity: number) => {
    dispatch(updateQuantity({ productId, selectedSize, quantity: newQuantity }));
  };

  const handleRemove = (productId: number, selectedSize: number | undefined) => {
    dispatch(removeFromCart({ productId, selectedSize }));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.type === 'coffee' && item.selectedSize
        ? item.product.volumes?.find(v => v.size === item.selectedSize)?.price || 0
        : item.product.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getItemPrice = (item: typeof cartItems[0]) => {
    if (item.product.type === 'coffee' && item.selectedSize) {
      return item.product.volumes?.find(v => v.size === item.selectedSize)?.price || 0;
    }
    return item.product.price || 0;
  };

  const getSizeIcon = (size: number) => {
    if (size <= 250) {
      return "/images/icons/smallcup.svg";
    } else if (size <= 500) {
      return "/images/icons/mediumcup.svg";
    } else {
      return "/images/icons/largecup.svg";
    }
  };

  const getItemSizeInfo = (item: typeof cartItems[0]) => {
    if (item.product.type === 'coffee' && item.selectedSize) {
      return `${item.selectedSize} мл`;
    }
    return '';
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={e => e.stopPropagation()}>
          <button className="cart-modal__close" onClick={onClose}>×</button>
          
          <div className="cart-modal__header">
            <h2>Корзина <span className="cart-modal__count">({cartItems.length})</span></h2>
          </div>

          {cartItems.length === 0 ? (
            <p className="cart-modal__empty">Ваша корзина пуста</p>
          ) : (
            <>
              <div className="cart-modal__items">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="cart-item">
                    <img 
                      src={`/images/${item.product.type}/${item.product.imageurl}`}
                      alt={item.product.name}
                      className="cart-item__image"
                    />
                    <div className="cart-item__info">
                      <h3>{item.product.name}</h3>
                      {item.product.type === 'coffee' && item.product.volumes && (
                        <div className="cart-item__sizes">
                          {item.product.volumes.map((option) => (
                            <button
                              key={option.size}
                              className={`size-button ${item.selectedSize === option.size ? 'active' : ''}`}
                              onClick={() => handleSizeChange(item.product.id, item.selectedSize, option.size)}
                            >
                              <div className="img-container">
                                <img 
                                  src={getSizeIcon(option.size)} 
                                  alt={`${option.size} мл`} 
                                  className="size-icon"
                                />
                              </div>
                              <span className="size-text">{option.size + ' мл'}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="cart-item__price-info">
                        <span className="cart-item__size-info">{getItemSizeInfo(item)}</span>
                        <span className="cart-item__price">{getItemPrice(item)}₽</span>
                      </div>
                    </div>
                    <div className="cart-item__quantity">
                      <button 
                        onClick={() => handleQuantityChange(
                          item.product.id, 
                          item.selectedSize, 
                          item.quantity - 1
                        )}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(
                          item.product.id, 
                          item.selectedSize, 
                          item.quantity + 1
                        )}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-modal__footer">
                <div className="cart-modal__total">
                  <span>Итого:</span>
                  <span className="cart-modal__total-price">{getTotalPrice()}₽</span>
                </div>
                <button 
                  className="cart-modal__checkout"
                  onClick={() => setShowCheckout(true)}
                >
                  Перейти к оформлению
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        totalAmount={getTotalPrice()}
      />
    </>
  );
};

export default CartModal; 