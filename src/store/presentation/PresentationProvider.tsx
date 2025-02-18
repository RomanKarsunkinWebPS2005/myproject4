import { createContext, useContext, useEffect, useState, FC, PropsWithChildren } from 'react';
import { getPresentation, dispatch as editorDispatch, addEditorChangeHandler } from '../../services/editor.js';
import type { Slide, Presentation, SlideElement, ImageElement } from './types';

interface PresentationContextType {
  presentation: Presentation;
  dispatch: (action: { type: string; payload: any }) => void;
  addSlide: () => void;
  updateCurrentSlide: (slide: Slide) => void;
  setCurrentSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  addElement: (element: Omit<SlideElement, 'id'>) => void;
  removeElement: (elementId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};

interface ProviderProps extends PropsWithChildren {
  initialPresentation: Presentation;
}

export const PresentationProvider: FC<ProviderProps> = ({ children, initialPresentation }) => {
  const [presentation, setPresentation] = useState(initialPresentation);
  const [history, setHistory] = useState<Presentation[]>([initialPresentation]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const addToHistory = (newState: Presentation) => {
    if (!isUndoRedoAction) {
      setHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, JSON.parse(JSON.stringify(newState))];
      });
      setCurrentIndex(prev => prev + 1);
    }
  };

  const undo = () => {
    if (canUndo) {
      setIsUndoRedoAction(true);
      const newIndex = currentIndex - 1;
      const prevState = JSON.parse(JSON.stringify(history[newIndex]));
      setCurrentIndex(newIndex);
      setPresentation(prevState);
      editorDispatch({ type: 'INIT', payload: prevState });
    }
  };

  const redo = () => {
    if (canRedo) {
      setIsUndoRedoAction(true);
      const newIndex = currentIndex + 1;
      const nextState = JSON.parse(JSON.stringify(history[newIndex]));
      setCurrentIndex(newIndex);
      setPresentation(nextState);
      editorDispatch({ type: 'INIT', payload: nextState });
    }
  };

  const addSlide = () => {
    editorDispatch({ type: 'ADD_SLIDE', payload: null });
    const newState = getPresentation();
    addToHistory(newState);
  };

  const updateCurrentSlide = (updatedSlide: Slide) => {
    editorDispatch({
      type: 'UPDATE_SLIDE',
      payload: {
        slideId: updatedSlide.id,
        updates: updatedSlide
      }
    });
    const newState = getPresentation();
    addToHistory(newState);
  };

  const setCurrentSlide = (slideId: string) => {
    editorDispatch({ type: 'SET_CURRENT_SLIDE', payload: slideId });
    const newState = getPresentation();
    addToHistory(newState);
  };

  const deleteSlide = (slideId: string) => {
    editorDispatch({ type: 'DELETE_SLIDE', payload: slideId });
    const newState = getPresentation();
    addToHistory(newState);
  };

  const addElement = (element: Omit<SlideElement, 'id'>) => {
    editorDispatch({
      type: 'ADD_ELEMENT',
      payload: { ...element, id: crypto.randomUUID() }
    });
    const newState = getPresentation();
    addToHistory(newState);
  };

  const removeElement = (elementId: string) => {
    editorDispatch({
      type: 'REMOVE_ELEMENT',
      payload: elementId
    });
    const newState = getPresentation();
    addToHistory(newState);
  };

  useEffect(() => {
    editorDispatch({ type: 'INIT', payload: initialPresentation });
    
    addEditorChangeHandler(() => {
      const newPresentation = getPresentation();
      setPresentation(newPresentation);
      setIsUndoRedoAction(false);
    });
  }, []);

  const updatePresentation = (newPresentation: Presentation) => {
    editorDispatch({
      type: 'UPDATE_PRESENTATION',
      payload: newPresentation
    });
  };

  const setActiveElement = (elementId: string) => {
    // TODO: Реализовать выбор активного элемента
  };

  const handleAddImage = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      const element: Omit<ImageElement, 'id'> = {
        type: 'image',
        content,
        x: 490,
        y: 260,
        width: 300,
        height: 200
      };

      addElement(element);
    };
    reader.readAsDataURL(file);
  };

  return (
    <PresentationContext.Provider value={{
      presentation,
      dispatch: editorDispatch,
      addSlide,
      updateCurrentSlide,
      setCurrentSlide,
      deleteSlide,
      addElement,
      removeElement,
      undo,
      redo,
      canUndo,
      canRedo
    }}>
      {children}
    </PresentationContext.Provider>
  );
}; 