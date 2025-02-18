import { usePresentation } from '../store/presentation/PresentationProvider'

export default function PresentationHeader() {
  const { presentation, dispatch } = usePresentation()
  
  return (
    <header>
      <input
        type="text"
        value={presentation.title}
        onChange={(e) => 
          dispatch({
            type: 'UPDATE_PRESENTATION',
            payload: { title: e.target.value }
          })
        }
        placeholder="Название презентации"
      />
    </header>
  )
} 