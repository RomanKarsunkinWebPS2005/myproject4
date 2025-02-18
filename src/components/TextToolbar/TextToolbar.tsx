import { FC } from 'react';
import styles from './TextToolbar.module.css';
import { TextElement } from '../../store/presentation/types';

interface TextToolbarProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
}

export const TextToolbar: FC<TextToolbarProps> = ({ element, onUpdate }) => {
  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];
  const fontFamilies = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Courier New'];

  return (
    <div className={styles.toolbar}>
      {/* Шрифт */}
      <select 
        value={element.fontFamily}
        onChange={(e) => onUpdate({ fontFamily: e.target.value })}
        className={styles.select}
      >
        {fontFamilies.map(font => (
          <option key={font} value={font}>{font}</option>
        ))}
      </select>

      {/* Размер шрифта */}
      <select 
        value={element.fontSize}
        onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
        className={styles.select}
      >
        {fontSizes.map(size => (
          <option key={size} value={size}>{size}px</option>
        ))}
      </select>

      {/* Кнопки форматирования */}
      <div className={styles.buttonGroup}>
        <button 
          className={`${styles.button} ${element.fontWeight === 'bold' ? styles.active : ''}`}
          onClick={() => onUpdate({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
        >
          B
        </button>
        <button 
          className={`${styles.button} ${element.fontStyle === 'italic' ? styles.active : ''}`}
          onClick={() => onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
        >
          I
        </button>
        <button 
          className={`${styles.button} ${element.textDecoration === 'underline' ? styles.active : ''}`}
          onClick={() => onUpdate({ textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' })}
        >
          U
        </button>
      </div>

      {/* Выравнивание текста */}
      <div className={styles.buttonGroup}>
        <button 
          className={`${styles.button} ${element.textAlign === 'left' ? styles.active : ''}`}
          onClick={() => onUpdate({ textAlign: 'left' })}
        >
          ⫷
        </button>
        <button 
          className={`${styles.button} ${element.textAlign === 'center' ? styles.active : ''}`}
          onClick={() => onUpdate({ textAlign: 'center' })}
        >
          ⫶
        </button>
        <button 
          className={`${styles.button} ${element.textAlign === 'right' ? styles.active : ''}`}
          onClick={() => onUpdate({ textAlign: 'right' })}
        >
          ⫸
        </button>
      </div>

      {/* Цвет текста */}
      <input 
        type="color"
        value={element.color}
        onChange={(e) => onUpdate({ color: e.target.value })}
        className={styles.colorPicker}
      />
    </div>
  );
}; 