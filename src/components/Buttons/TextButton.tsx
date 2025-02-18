import { FC } from 'react'
import styles from './Buttons.module.css'
import { usePresentation } from '../../store/presentation/PresentationProvider'

export const TextButton: FC = () => {
  const { addElement } = usePresentation()

  const handleClick = () => {
    addElement({
      type: 'text',
      content: 'Новый текст',
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial'
    })
  }

  return (
    <button className={styles.toolButton} onClick={handleClick}>
      <span className="material-icons">text_fields</span>
      Текст
    </button>
  )
} 