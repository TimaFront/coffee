import React, { useState, useEffect, useCallback } from 'react';
import './Carousel.scss';

interface SlideData {
  image: string;
  title: string;
  description: string;
  buttonText: string;
}

const sliderData: SlideData[] = [
  {
    image: 'public/carousel/slide1.png',
    title: 'Первое, что вам нужно, чтобы начать свой день',
    description: 'Кофе, на который можно положиться',
    buttonText: 'Хочу кофе'
  },
  {
    image: 'public/carousel/slide2.png',
    title: 'Первое, что вам нужно, чтобы начать свой день',
    description: 'Кофе, на который можно положиться',
    buttonText: 'Хочу кофе'
  },
  {
    image: 'public/carousel/slide3.png',
    title: 'Первое, что вам нужно, чтобы начать свой день',
    description: 'Кофе, на который можно положиться',
    buttonText: 'Хочу кофе'
  }
];

const SlideDuration = 3333000;
const TransitionDuration = 500;

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSlides = sliderData.length;

  const handleTransitionEnd = () => {
    if (currentSlide === totalSlides) {
      setIsTransitioning(false);
      setCurrentSlide(0);
    }
  };

  const changeSlide = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    if (direction === 'next') {
      if (currentSlide === totalSlides - 1) {
        setCurrentSlide(currentSlide + 1);
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentSlide(0);
        }, TransitionDuration);
      } else {
        setCurrentSlide(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, TransitionDuration);
      }
    } else {
      if (currentSlide === 0) {
        setCurrentSlide(totalSlides);
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentSlide(totalSlides - 1);
        }, TransitionDuration);
      } else {
        setCurrentSlide(prev => prev - 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, TransitionDuration);
      }
    }
  }, [isTransitioning, totalSlides, currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide('next');
    }, SlideDuration);

    return () => clearInterval(interval);
  }, [changeSlide]);

  return (
    <section className="slider-section">
      <div className="container">
        <div className="slider">
          <div
            className="slider__container"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isTransitioning ? `transform ${TransitionDuration}ms ease-in-out` : 'none'
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {[...sliderData, sliderData[0]].map((slide, index) => (
              <div key={index} className="slider__slide">
                <div className="slider__image-container">
                  <img src={slide.image} alt={slide.title} className="slider__image" />
                </div>
                <div className="slider__content">
                  <h2 className="slider__title">{slide.title}</h2>
                  <p className="slider__description">{slide.description}</p>
                  <button className="slider__button">
                    {slide.buttonText} <img src="./public/carousel/cupmini.svg" alt="cup" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="slider__bottom">
            <button
              className="slider__arrow slider__arrow--prev"
              onClick={() => changeSlide('prev')}
            >
              <span className="slider__arrow-circle">
                <img src="./public/carousel/vector-left.png" alt="previous" />
              </span>
            </button>
            <button
              className="slider__arrow slider__arrow--next"
              onClick={() => changeSlide('next')}
            >
              <span className="slider__arrow-circle">
                <img src="./public/carousel/vector-right.png" alt="next" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel; 