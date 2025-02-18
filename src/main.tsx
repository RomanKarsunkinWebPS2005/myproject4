import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './views/App/App'
import { PresentationProvider } from './store/presentation/PresentationProvider'
import './index.css'
import { getPresentation, addEditorChangeHandler } from './services/editor.js'

const initialPresentation = {
  id: '1',
  title: 'Новая презентация',
  slides: [
    {
      id: '1',
      background: '#ffffff',
      elements: []
    }
  ],
  currentSlideId: '1'
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

const render = () => {
  root.render(
    <React.StrictMode>
      <PresentationProvider initialPresentation={initialPresentation}>
        <App />
      </PresentationProvider>
    </React.StrictMode>
  )
}

addEditorChangeHandler(render)
render()
