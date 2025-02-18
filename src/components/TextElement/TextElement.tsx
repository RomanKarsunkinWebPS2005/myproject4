import { FC, useState, useRef, useEffect } from 'react'
import { TextEditor } from '../TextEditor/TextEditor'
import { TextElement as TextElementType } from '../../store/presentation/types'
import styles from './TextElement.module.css'
import { DeleteButton } from '../DeleteButton/DeleteButton'
import { usePresentation } from '../../store/presentation/PresentationProvider'

interface TextElementProps {
  element: TextElementType
  onUpdate: (updates: Partial<TextElementType>) => void
  isPreview?: boolean
}

export const TextElement: FC<TextElementProps> = ({ element, onUpdate, isPreview }) => {
  const [isEditing, setIsEditing] = useState(false)
  const { removeElement } = usePresentation()
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPreview || !contentRef.current) return;

    // Получаем реальную ширину текста
    const textWidth = contentRef.current.scrollWidth;
    const textHeight = contentRef.current.scrollHeight;
    
    // Если текст не помещается, увеличиваем размер блока
    if (textWidth > element.width * 0.17) { // 0.17 - коэффициент масштабирования
      onUpdate({
        ...element,
        width: Math.ceil(textWidth / 0.17)
      });
    }
  }, [element.content, isPreview]);

  const handleDoubleClick = () => {
    if (!isPreview) {
      setIsEditing(true)
    }
  }

  const style: React.CSSProperties = {
    fontSize: `${element.fontSize}px`,
    color: element.color,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textDecoration: element.textDecoration,
    pointerEvents: isPreview ? 'none' : 'auto',
    userSelect: isPreview ? 'none' : 'text',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    display: 'block',
    textAlign: element.textAlign || 'left',
    ...(isPreview && {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    })
  }

  return (
    <div 
      className={`${styles.textElement} ${isPreview ? styles.preview : ''}`}
      onDoubleClick={handleDoubleClick}
      style={{ 
        pointerEvents: isPreview ? 'none' : 'auto',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`
      }}
    >
      {!isPreview && <DeleteButton onDelete={() => removeElement(element.id)} />}
      {isEditing ? (
        <TextEditor
          element={element}
          onUpdate={onUpdate}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <div
          ref={contentRef}
          style={style}
        >
          {element.content}
        </div>
      )}
    </div>
  )
} 