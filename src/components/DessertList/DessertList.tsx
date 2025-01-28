import React, { useRef, useState } from 'react';
import './DessertList.scss';
import { ParsedProduct } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import OrderModal from '../Modal/OrderModal';
import { addToCart } from '../../store/slices/cartSlice';
import Notification from '../Notification/Notification';

interface DessertListProps {
  desserts: ParsedProduct[];
}

const DessertList: React.FC<DessertListProps> = ({ desserts }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const [selectedDessert, setSelectedDessert] = useState<ParsedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const cartItems = useAppSelector(state => state.cart.items);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleFavorite = (dessert: ParsedProduct) => {
    dispatch(toggleFavorite(dessert));
  };

  const isFavorite = (id: number, type: string) => {
    return favorites.some(item => item.id === id && item.type === type);
  };

  const handleQuickOrder = (dessert: ParsedProduct) => {
    setSelectedDessert(dessert);
    setIsModalOpen(true);
  };

  const handleAddToCart = (dessert: ParsedProduct) => {
    const isInCart = cartItems.some(item => item.product.id === dessert.id);

    if (isInCart) {
      setNotification({ message: 'Товар уже в корзине', isVisible: true });
      setTimeout(() => {
        setNotification({ message: '', isVisible: false });
      }, 2000);
    } else {
      dispatch(addToCart({ product: dessert }));
      setNotification({ message: 'Товар добавлен в корзину', isVisible: true });
      setTimeout(() => {
        setNotification({ message: '', isVisible: false });
      }, 2000);
    }
  };

  return (
    <div className="dessert-section">
      <div className="dessert-section__header">
        <h2 className="dessert-section__title">Десерты</h2>
        <div className="dessert-section__controls">
          <button 
            className="control-button" 
            onClick={() => scroll('left')}
          >
            <img src="/public/carousel/vector-left.png" alt="Влево" />
          </button>
          <button 
            className="control-button" 
            onClick={() => scroll('right')}
          >
            <img src="/public/carousel/vector-right.png" alt="Вправо" />
          </button>
        </div>
      </div>

      <div className="dessert-list" ref={sliderRef}>
        <div className="dessert-list__container">
          {desserts.map((dessert) => (
            <div key={dessert.id} className="dessert-card">
              <button
                className={`favorite-button ${isFavorite(dessert.id, dessert.type) ? 'active' : ''}`}
                onClick={() => handleToggleFavorite(dessert)}
              >
                <img 
                  src={isFavorite(dessert.id, dessert.type)
                    ? "/images/icons/redheart.svg" 
                    : "/images/icons/heart.svg"
                  } 
                  alt="В избранное" 
                />
              </button>
              <img 
                src={`/images/dessert/${dessert.imageurl}`} 
                alt={dessert.name} 
                className="dessert-card__image"
              />
              <div className="dessert-card__content">
                <h3 className="dessert-card__title">{dessert.name}</h3>
                <p className="dessert-card__description">
                  {dessert.description.split(' ', 5).join(' ').replace(/,$/, '') + '...'}
                </p>
                <div className="dessert-card__price">
                  {dessert.price}₽
                </div>
                <div className="dessert-card__buttons">
                  <button 
                    className="dessert-card__button"
                    onClick={() => handleQuickOrder(dessert)}
                  >
                    Купить в один клик
                  </button>
                  <button 
                    className="dessert-card__cart"
                    onClick={() => handleAddToCart(dessert)}
                  >
                    <img src="/images/icons/cart.svg" alt="Корзина" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedDessert && (
        <OrderModal
          product={selectedDessert}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDessert(null);
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

export default DessertList; 