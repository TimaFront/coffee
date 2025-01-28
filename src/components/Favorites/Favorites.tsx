import React, { useState } from 'react';
import './Favorites.scss';
import { ParsedProduct } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import Notification from '../Notification/Notification';
import OrderModal from '../Modal/OrderModal';

const Favorites: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const cartItems = useAppSelector(state => state.cart.items);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: number }>({});
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const [selectedProduct, setSelectedProduct] = useState<ParsedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSizeSelect = (productId: number, size: number) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = (product: ParsedProduct) => {
    const selectedSize = product.type === 'coffee' 
      ? (selectedSizes[product.id] || product.volumes?.[0]?.size)
      : undefined;

    const isInCart = cartItems.some(
      item => item.product.id === product.id && item.selectedSize === selectedSize
    );

    if (isInCart) {
      setNotification({ message: 'Товар уже в корзине', isVisible: true });
    } else {
      dispatch(addToCart({ product, selectedSize }));
      setNotification({ message: 'Товар добавлен в корзину', isVisible: true });
    }

    setTimeout(() => {
      setNotification({ message: '', isVisible: false });
    }, 2000);
  };

  const handleQuickOrder = (product: ParsedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleRemoveFromFavorites = (product: ParsedProduct) => {
    dispatch(toggleFavorite(product));
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

  if (favorites.length === 0) {
    return (
      <div className="favorites">
        <h2 className="favorites__title">Избранное</h2>
        <p className="favorites__empty">У вас пока нет избранных товаров</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2 className="favorites__title">Избранное</h2>
      <div className="favorites__grid">
        {favorites.map(item => (
          <div key={item.id} className="favorites__item">
            <button
              className="favorites__item-remove"
              onClick={() => handleRemoveFromFavorites(item)}
            >
              <img src="/images/icons/redheart.svg" alt="Удалить из избранного" />
            </button>
            <img 
              src={`/images/${item.type}/${item.imageurl}`} 
              alt={item.name} 
              className="favorites__item-image"
            />
            <div className="favorites__item-content">
              <h3 className="favorites__item-title">{item.name}</h3>
              <p className="favorites__item-description">
                {item.description}
              </p>
              {item.type === 'coffee' && item.volumes && (
                <div className="favorites__item-sizes">
                  {item.volumes.map((option) => (
                    <button
                      key={option.size}
                      className={`size-button ${selectedSizes[item.id] === option.size ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(item.id, option.size)}
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
              <div className="favorites__item-price">
                {item.price ? `${item.price}₽` : 'От ' + item.volumes?.[0]?.price + '₽'}
              </div>
              <div className="favorites__item-buttons">
                <button 
                  className="favorites__item-button"
                  onClick={() => handleQuickOrder(item)}
                >
                  Купить в один клик
                </button>
                <button 
                  className="favorites__item-cart"
                  onClick={() => handleAddToCart(item)}
                >
                  <img src="/images/icons/cart.svg" alt="В корзину" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          selectedSize={selectedProduct.type === 'coffee' 
            ? (selectedSizes[selectedProduct.id] || selectedProduct.volumes?.[0]?.size)
            : undefined}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
      <Notification 
        message={notification.message}
        isVisible={notification.isVisible}
      />
    </div>
  );
};

export default Favorites; 