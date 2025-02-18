import { FC } from 'react';
import { TextElement as TextElementType } from '../../store/presentation/types';
import styles from './TextPreview.module.css';

interface TextPreviewProps {
  element: TextElementType;
  scale?: number;
}

export const TextPreview: FC<TextPreviewProps> = ({ element, scale = 0.17 }) => {
  return (
    <div 
      className={styles.previewWrapper}
      style={{
        position: 'absolute',
        left: `${element.x * scale}px`,
        top: `${element.y * scale}px`,
        width: `${Math.min(element.width, 1280) * scale}px`, // Ограничиваем шириной слайда
        minWidth: '50px',
        maxWidth: `${1280 * scale}px`, // Максимальная ширина слайда
        fontSize: `${element.fontSize * scale}px`,
        color: element.color,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textDecoration: element.textDecoration,
        textAlign: element.textAlign || 'left'
      }}
      dangerouslySetInnerHTML={{ __html: element.content }} // Для поддержки переносов строк
    />
  );
}; 