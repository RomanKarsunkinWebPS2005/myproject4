import { usePresentation } from '../../store/presentation/PresentationProvider'
import styles from './SlidesPanel.module.css'
import { SlidePreview } from '../../components/SlidePreview'

export const SlidesPanel = () => {
  const { presentation, addSlide, setCurrentSlide } = usePresentation()

  return (
    <div className={styles.container}>
      <div className={styles.numbers}>
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.number} ${slide.id === presentation.currentSlideId ? styles.numberActive : ''}`}
            onClick={() => setCurrentSlide(slide.id)}
          >
            {index + 1}
          </div>
        ))}
        <button className={styles.addButton} onClick={addSlide}>+</button>
      </div>
      <div className={styles.previews}>
        {presentation.slides.map(slide => (
          <SlidePreview
            key={slide.id}
            slide={slide}
            isActive={slide.id === presentation.currentSlideId}
            onClick={() => setCurrentSlide(slide.id)}
          />
        ))}
      </div>
    </div>
  )
} 