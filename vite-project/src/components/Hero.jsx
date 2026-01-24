import React, { useState } from 'react';
import styles from './Hero.module.css';

const sliderData = [
  {
    image: '/src/assets/assets/new_frontend_assets/hero1.jpg',
    //subtitle: "design",
    title: "Adaptive Essentials",
    description: "Thoughtfully tailored pieces made to adapt, wherever the day takes you."
  },
  {
    image: '/src/assets/assets/new_frontend_assets/hero2.jpg',
    //subtitle: "design",
    title: "Urban Velocity",
    description: "Fluid materials anchored by structure, made for motion in metropolitan spaces."
  },
  {
    image: '/src/assets/assets/new_frontend_assets/hero3.jpg',
    //subtitle: "design",
    title: "Quiet Authority",
    description: "Restrained silhouettes with decisive form, expressing authority through simplicity."
  },
  {
    image: '/src/assets/assets/new_frontend_assets/hero4.jpg',
    //subtitle: "design",
    title: "In Motion",
    description: "Relaxed proportions shaped by intent, \n created for rhythm, movement, and pause."
  },
  {
    image: '/src/assets/assets/new_frontend_assets/hero5.jpg',
    //subtitle: "design",
    title: "Modern Lineage",
    description: "Tailoring shaped by continuity, bridging tradition and modern form."
  }
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.list}>
        {sliderData.map((slide, index) => (
          <div key={index} className={`${styles.item} ${index === activeIndex ? styles.active : ''}`}>
            <img src={slide.image} alt={slide.title} />
            <div className={styles.content}>
              {/* <p>{slide.subtitle}</p> */}
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.arrows}>
        <button onClick={prevSlide}>&lt;</button>
        <button onClick={nextSlide}>&gt;</button>
      </div>

      <div className={styles.thumbnail}>
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`${styles.thumbnailItem} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <img src={slide.image} alt={slide.title} />
            <div className={styles.thumbnailContent}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;