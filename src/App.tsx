import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./assets/scss/index.scss"
import Header from "./components/Header/Header";
import Carousel from "./components/UIComponents/Carousel/Carousel";
import ProductList from "./components/ProductList/ProductList";
import { ParsedProduct } from './types';
import { getAllProducts } from './utils/supabaseClient';
import Footer from "./components/Footer/Footer";
import Favorites from './components/Favorites/Favorites';
import CartModal from './components/Modal/CartModal';

const App: React.FC = () => {
    const [products, setProducts] = useState<ParsedProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
            } catch (error) {
                setError('Не удалось загрузить продукты. Пожалуйста, попробуйте позже.');
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleOpenCart = () => {
        setIsCartOpen(true);
    };

    return (
        <Router>
            <div className="wrapper">
                <Header onSearch={setSearchTerm} onCartClick={handleOpenCart} />
                <main>
                    {isLoading ? (
                        <div>Загрузка...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <section className="hero-section">
                                        <Carousel />
                                    </section>
                                    <section className="products-section">
                                        <ProductList products={products} searchQuery={searchTerm} />
                                    </section>
                                </>
                            } />
                            <Route path="/favorites" element={<Favorites />} />
                        </Routes>
                    )}
                </main>
                <Footer />
                <CartModal 
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                />
            </div>
        </Router>
    );
};

export default App;