import { FC, useState, useEffect } from 'react'
import styles from './ColorPalette.module.css'

interface ColorPaletteProps {
  onColorChange: (color: string) => void
  initialColor: string
}

export const ColorPalette: FC<ColorPaletteProps> = ({ onColorChange, initialColor }) => {
  const [currentColor, setCurrentColor] = useState(initialColor)

  useEffect(() => {
    setCurrentColor(initialColor)
  }, [initialColor])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCurrentColor(newColor)
    onColorChange(newColor)
  }

  return (
    <div className={styles.palette}>
      <input
        type="color"
        value={currentColor}
        onChange={handleColorChange}
        className={styles.colorPicker}
        title="Выберите цвет фона"
      />
    </div>
  )
} 