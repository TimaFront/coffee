import React from "react";
import "./Header.scss";
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface HeaderProps {
  onSearch: (term: string) => void;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {
    const cartItems = useAppSelector(state => state.cart.items);
    const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/">
                    <img src="./public/header/logo.png" alt="Logo" />
                </Link>
                <input
                    className="header__input"
                    placeholder="Поиск ..."
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                />
                <div className="header-flex">
                    <Link to="/favorites">
                        <div className="header-flex__btn">
                            <img width={24} height={24} src="./public/header/favorites.svg" alt="Favorites" /> Избранное
                        </div>
                    </Link>
                    <div className="header-flex__btn" onClick={onCartClick}>
                        <img width={24} height={24} src="./public/header/cart.svg" alt="Cart" /> 
                        Корзина | {cartItemsCount}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;