import { FC } from 'react'
import { usePresentation } from '../../store/presentation/PresentationProvider'
import { ColorPalette } from '../ColorPalette'
import { TextButton } from '../Buttons/TextButton'
import { ImageButton } from '../Buttons/ImageButton'
import styles from './TopPanel.module.css'

export const TopPanel: FC = () => {
  const { presentation, updateCurrentSlide, undo, redo, canUndo, canRedo } = usePresentation()
  
  const currentSlide = presentation?.slides?.find(
    slide => slide?.id === presentation?.currentSlideId
  ) || null;

  const handleColorSelect = (color: string) => {
    if (currentSlide) {
      updateCurrentSlide({
        ...currentSlide,
        background: color
      });
    }
  }

  return (
    <div className={styles.topPanel}>
      <div className={styles.group}>
        <button 
          className={styles.historyButton} 
          onClick={undo}
          disabled={!canUndo}
          title="Отменить (Ctrl+Z)"
        >
          ↶ Отменить
        </button>
        <button 
          className={styles.historyButton} 
          onClick={redo}
          disabled={!canRedo}
          title="Повторить (Ctrl+Shift+Z)"
        >
          ↷ Повторить
        </button>
      </div>
      <div className={styles.group}>
        <TextButton />
        <ImageButton />
      </div>
      <div className={styles.group}>
        <ColorPalette 
          onColorChange={handleColorSelect}
          initialColor={currentSlide?.background || '#ffffff'}
        />
      </div>
    </div>
  )
} 