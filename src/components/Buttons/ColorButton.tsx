import { FC, useState, useEffect, useRef } from 'react'
import styles from './Buttons.module.css'

interface ColorButtonProps {
  onColorChange: (color: string) => void
}

export const ColorButton: FC<ColorButtonProps> = ({ onColorChange }) => {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.colorContainer} ref={pickerRef}>
      <button 
        className={styles.button}
        onClick={() => setShowPicker(!showPicker)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" fill="currentColor"/>
        </svg>
        <span>Фон</span>
      </button>
      {showPicker && (
        <div className={styles.colorPicker}>
          <input 
            type="color"
            defaultValue="#ffffff"
            onChange={(e) => {
              onColorChange(e.target.value)
            }}
          />
        </div>
      )}
    </div>
  )
} 