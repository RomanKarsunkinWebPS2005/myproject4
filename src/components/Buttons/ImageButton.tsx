import { FC, useRef } from 'react'
import styles from './Buttons.module.css'
import { usePresentation } from '../../store/presentation/PresentationProvider'

export const ImageButton: FC = () => {
  const { addElement } = usePresentation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        addElement({
          type: 'image',
          content: event.target?.result as string,
          x: 640,
          y: 360,
          width: 400,
          height: 300
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <button className={styles.toolButton} onClick={handleClick}>
        <span className="material-icons">image</span>
        Изображение
      </button>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  )
} 