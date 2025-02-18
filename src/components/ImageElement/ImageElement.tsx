import { FC } from 'react';
import { ImageElement as ImageElementType } from '../../store/presentation/types';
import { usePresentation } from '../../store/presentation/PresentationProvider';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { Resizable } from '../Resizable/Resizable';
import styles from './ImageElement.module.css';

interface ImageElementProps {
  element: ImageElementType;
  isPreview?: boolean;
}

export const ImageElement: FC<ImageElementProps> = ({ element, isPreview }) => {
  const { removeElement, dispatch: editorDispatch } = usePresentation();

  const handleResize = (size: { width: number; height: number }) => {
    editorDispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementId: element.id,
        updates: size
      }
    });
  };

  if (isPreview) {
    return (
      <img 
        src={element.content} 
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    );
  }

  return (
    <div 
      className={styles.container}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`
      }}
    >
      <Resizable
        width={element.width}
        height={element.height}
        onResize={handleResize}
        minSize={{ width: 50, height: 50 }}
        disabled={isPreview}
      >
        <div className={styles.element}>
          <DeleteButton onDelete={() => removeElement(element.id)} />
          <img 
            src={element.content} 
            alt=""
            className={styles.image}
          />
        </div>
      </Resizable>
    </div>
  );
}; 