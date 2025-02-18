import { usePresentation } from '../store/presentation/PresentationProvider'
import { Slide } from '../store/presentation/types'

export default function SlidePropertiesPanel() {
  const { presentation, updateCurrentSlide } = usePresentation()
  const currentSlide = presentation.slides.find(
    (s: Slide) => s.id === presentation.currentSlideId
  )

  if (!currentSlide) return null

  return (
    <div className="properties-panel">
      <label>
        Фон слайда:
        <input
          type="color"
          value={currentSlide.background}
          onChange={(e) => 
            updateCurrentSlide({ ...currentSlide, background: e.target.value })
          }
        />
      </label>
    </div>
  )
} 