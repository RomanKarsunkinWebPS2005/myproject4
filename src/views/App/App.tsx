import { useState } from 'react'
import { SlidesPanel } from '../SlidesPanel/SlidesPanel'
import { Workspace } from '../Workspace/Workspace'
import { TopPanel } from '../../components/TopPanel/TopPanel'
import { dispatch } from '../../services/editor.js'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

export default function App() {
  const [title, setTitle] = useState('Моя презентация')

  useKeyboardShortcuts()

  const handleAddText = () => {
    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        id: Date.now().toString(),
        type: 'text',
        x: 640,
        y: 360,
        width: 200,
        height: 100,
        content: 'Новый текст',
        fontSize: 32,
        color: '#000000',
        fontFamily: 'Arial'
      }
    });
  };

  const handleAddImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageContent = e.target?.result as string;
          dispatch({
            type: 'ADD_ELEMENT',
            payload: {
              type: 'image',
              content: imageContent,
              x: 100,
              y: 100,
              width: 300,
              height: 200
            }
          });
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="app-container">
      <header className="presentation-header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
      </header>
      <TopPanel />
      <div className="main-content">
        <SlidesPanel />
        <Workspace />
      </div>
    </div>
  )
} 