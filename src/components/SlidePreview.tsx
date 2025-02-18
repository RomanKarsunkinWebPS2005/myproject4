import { FC } from 'react'
import styles from './SlidePreview.module.css'
import { Slide, SlideElement } from '../store/presentation/types'
import { usePresentation } from '../store/presentation/PresentationProvider'
import { TextElement } from '../components/TextElement/TextElement'
import { ImageElement } from '../components/ImageElement/ImageElement'
import { TextPreview } from './TextPreview/TextPreview'
import { TextElementType } from '../types/types'

interface SlidePreviewProps {
  slide: Slide
  isActive: boolean
  onClick: () => void
}

export const SlidePreview: FC<SlidePreviewProps> = ({ slide, isActive, onClick }) => {
  const { deleteSlide } = usePresentation()

  console.log('Rendering slide:', slide);

  return (
    <div 
      className={`${styles.preview} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <button 
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation()
          deleteSlide(slide.id)
        }}
      >
        ×
      </button>
      <div 
        className={styles.content}
        style={{ backgroundColor: slide.background }}
      >
        {slide.elements.map((element: SlideElement) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${(element.x / 1280) * 100}%`,
              top: `${(element.y / 720) * 100}%`,
              width: `${(element.width / 1280) * 100}%`,
              height: `${(element.height / 720) * 100}%`,
              transformOrigin: 'top left',
              padding: '2px'
            }}
          >
            {element.type === 'text' ? (
              <TextPreview 
                element={element as TextElementType}
                scale={0.17}
              />
            ) : (
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={element.content} 
                  alt=""
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 