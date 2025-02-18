import { FC } from 'react'
import styles from './TextPreview.module.css'
import { TextElement } from '../store/presentation/types'

interface TextPreviewProps {
  element: TextElement
  scale?: number
}

export const TextPreview: FC<TextPreviewProps> = ({ element, scale = 1 }) => {
  return (
    <div 
      style={{
        fontSize: `${element.fontSize * scale}px`,
        color: element.color,
        fontFamily: element.fontFamily,
        width: '100%',
        height: '100%',
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4px',
        lineHeight: 'normal',
        userSelect: 'none'
      }}
      className={styles.preview}
    >
      {element.content}
    </div>
  )
} 