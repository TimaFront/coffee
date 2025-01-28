import React, { useState } from 'react';
import './ProductList.scss';
import { ParsedProduct } from '../../types';
import useSearch from '../../hooks/useSearch';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import DessertList from '../DessertList/DessertList';
import OrderModal from '../Modal/OrderModal';
import { addToCart } from '../../store/slices/cartSlice';
import Notification from '../Notification/Notification';

interface ProductListProps {
  products: ParsedProduct[]; // Список продуктов
  searchQuery: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, searchQuery }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const desserts = products.filter(product => product.type === 'dessert');
  const coffeeProducts = products.filter(product => product.type === 'coffee');

  console.log('All products:', products);
  console.log('Coffee products:', coffeeProducts);
  console.log('Desserts:', desserts);

  const { searchedData } = useSearch<ParsedProduct>({ 
    data: coffeeProducts, // теперь ищем только среди кофе
    accessorKey: ['name'],
    searchTerm: searchQuery
  });

  console.log('Searched data:', searchedData);

  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: number }>({}); // Состояние для выбранных размеров продуктов

  const [visibleItems, setVisibleItems] = useState(8); // Показывать первые 8 карточек
  const showMoreItems = () => {
    setVisibleItems(prevValue => prevValue + 8); // Показывать дополнительно по 8 карточек
  };
  const visibleProducts = searchedData.slice(0, visibleItems); // Показывать первые 8 карточек
  const hasMoreItems = visibleItems < searchedData.length; // Проверка на наличие большего количества карточек

  const [selectedProduct, setSelectedProduct] = useState<ParsedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const cartItems = useAppSelector(state => state.cart.items);

  const handleToggleFavorite = (product: ParsedProduct) => {
    dispatch(toggleFavorite(product));
  };

  const isFavorite = (id: number, type: string) => {
    return favorites.some(item => item.id === id && item.type === type);
  };

  const handleSizeSelect = (productId: number, size: number) => { // Функция для выбора размера продукта
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const getSelectedPrice = (product: ParsedProduct) => { // Функция для получения цены выбранного размера продукта
    if (!product.volumes || product.volumes.length === 0) { // Если нет доступных размеров, возвращаем 0
      return 0;
    }
    const selectedSize = selectedSizes[product.id] || product.volumes[0].size; // Получение выбранного размера продукта
    return product.volumes.find(option => option.size === selectedSize)?.price || 0; // Возвращение цены выбранного размера или 0, если нет доступных размеров
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

  const handleQuickOrder = (product: ParsedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: ParsedProduct) => {
    const selectedSize = selectedSizes[product.id] || product.volumes?.[0]?.size;
    const isInCart = cartItems.some(
      item => item.product.id === product.id && item.selectedSize === selectedSize
    );

    if (isInCart) {
      setNotification({ message: 'Товар уже в корзине', isVisible: true });
      setTimeout(() => {
        setNotification({ message: '', isVisible: false });
      }, 2000);
    } else {
      dispatch(addToCart({ product, selectedSize }));
      setNotification({ message: 'Товар добавлен в корзину', isVisible: true });
      setTimeout(() => {
        setNotification({ message: '', isVisible: false });
      }, 2000);
    }
  };

  return (
    <>
      <div className="product-list">
        <div className="product-list__grid">
          {visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <button
                className={`favorite-button ${isFavorite(product.id, product.type) ? 'active' : ''}`}
                onClick={() => handleToggleFavorite(product)}
              >
                <img 
                  src={isFavorite(product.id, product.type)
                    ? "/images/icons/redheart.svg" 
                    : "/images/icons/heart.svg"
                  } 
                  alt="В избранное" 
                />
              </button>
              <img 
                src={`/images/coffee/${product.imageurl}`} 
                alt={product.name} 
                className="product-card__image"
              />
              <div className="product-card__content"> 
                <h3 className="product-card__title">{product.name.split(' ', 2).join(' ')}</h3>
                <p className="product-card__description">
                  {product.description.split(' ', 5).join(' ').replace(/,$/, '') + '...'}
                </p>
                <div className="product-card__sizes">
                  {product.volumes && product.volumes.length > 0 ? (
                    product.volumes.map((option) => (
                      <button
                        key={option.size}
                        className={`size-button ${selectedSizes[product.id] === option.size ? 'active' : ''}`}
                        onClick={() => handleSizeSelect(product.id, option.size)}
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
                    ))
                  ) : (
                    <p className="no-sizes-message">Нет доступных размеров</p>
                  )}
                </div>
                <div className="product-card__price">
                  {getSelectedPrice(product)}₽
                </div>
                <div className="product-card__button-container">
                  <button 
                    className="product-card__button"
                    onClick={() => handleQuickOrder(product)}
                  >
                    Купить в один клик
                  </button>
                  <button 
                    className='product-card__cart'
                    onClick={() => handleAddToCart(product)}
                  >
                    <img src="/images/icons/cart.svg" alt="Корзина" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {hasMoreItems && (
          <button 
            className="product-list__show-more" 
            onClick={showMoreItems}
          >
            Показать еще
          </button>
        )}
      </div>
      <DessertList desserts={desserts} />
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          selectedSize={selectedSizes[selectedProduct.id] || selectedProduct.volumes?.[0]?.size}
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
    </>
  );
};

export default ProductList; 