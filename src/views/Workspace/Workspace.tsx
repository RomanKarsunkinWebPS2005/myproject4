import { useEffect, useRef, FC, useState } from 'react';
import { usePresentation } from '../../store/presentation/PresentationProvider';
import { TextElement, ImageElement, SlideElement } from '../../store/presentation/types';
import { TextElement as TextElementComponent } from '../../components/TextElement/TextElement';
import { ImageElement as ImageElementComponent } from '../../components/ImageElement/ImageElement';
import styles from './Workspace.module.css';

export const Workspace: FC = () => {
  const { presentation, dispatch: editorDispatch } = usePresentation();
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentSlide = presentation.slides.find(
    s => s.id === presentation.currentSlideId
  );

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48;
        const scale = Math.min(containerWidth / 1280, 0.8);
        containerRef.current.style.setProperty('--scale', scale.toString());
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (!currentSlide) return null;

  const handleElementUpdate = (elementId: string, updates: Partial<TextElement>) => {
    editorDispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementId,
        updates
      }
    });
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.slideContainer} ref={containerRef}>
        <div 
          className={styles.slide}
          style={{ backgroundColor: currentSlide.background }}
          onClick={() => setActiveElementId(null)}
        >
          {currentSlide.elements.map(element => 
            element.type === 'text' ? (
              <TextElementComponent
                key={element.id}
                element={element as TextElement}
                onUpdate={(updates) => handleElementUpdate(element.id, updates)}
              />
            ) : (
              <div
                key={element.id}
                className={`${styles.element} ${activeElementId === element.id ? styles.active : ''}`}
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveElementId(element.id);
                }}
              >
                <ImageElementComponent 
                  element={element as ImageElement}
                  isPreview={false}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}; 