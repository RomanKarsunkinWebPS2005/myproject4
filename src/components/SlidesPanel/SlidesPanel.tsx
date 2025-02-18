import React, { FC } from 'react';
import { usePresentation } from '../../store/presentation/PresentationProvider';
import { SlidePreview } from '../SlidePreview';
import styles from './SlidesPanel.module.css';

export const SlidesPanel: FC = () => {
  const { presentation, setCurrentSlide } = usePresentation();

  const handleSlideClick = (slideId: string) => {
    setCurrentSlide(slideId);
  };

  if (!presentation || !presentation.slides) {
    return null;
  }

  return (
    <div className={styles.slidesPanel}>
      {presentation.slides.map((slide) => (
        <SlidePreview
          key={slide.id}
          slide={slide}
          isActive={slide.id === presentation.currentSlideId}
          onClick={() => handleSlideClick(slide.id)}
        />
      ))}
    </div>
  );
}; 