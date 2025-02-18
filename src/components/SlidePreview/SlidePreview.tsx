import { FC } from 'react';
import { Slide, TextElement, ImageElement, SlideElement } from '../../store/presentation/types';
import { usePresentation } from '../../store/presentation/PresentationProvider';
import { TextPreview } from '../TextPreview/TextPreview';
import styles from './SlidePreview.module.css';

interface SlidePreviewProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
}

export const SlidePreview: FC<SlidePreviewProps> = ({ slide, index, isSelected }) => {
  const { setCurrentSlide } = usePresentation();

  return (
    <div
      className={`${styles.preview} ${isSelected ? styles.selected : ''}`}
      onClick={() => setCurrentSlide(slide.id)}
      data-slide-index={index}
    >
      <div 
        className={styles.content}
        style={{ background: slide.background }}
      >
        {slide.elements.map(element => {
          switch (element.type) {
            case 'text':
              return (
                <TextPreview 
                  key={element.id}
                  element={element as TextElement}
                  scale={0.17}
                />
              );
            case 'image':
              const imageElement = element as ImageElement;
              return (
                <div
                  key={element.id}
                  style={{
                    position: 'absolute',
                    left: `${element.x * 0.17}px`,
                    top: `${element.y * 0.17}px`,
                    width: `${element.width * 0.17}px`,
                    height: `${element.height * 0.17}px`
                  }}>
                  <img 
                    src={imageElement.content}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}; 