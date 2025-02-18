import { useEffect, useCallback } from 'react';
import { usePresentation } from '../store/presentation/PresentationProvider';

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo } = usePresentation();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Проверяем только код клавиши, который не зависит от регистра
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z' || e.code === 'KeyZ')) {
      // Ctrl+Z или Cmd+Z
      e.preventDefault();
      if (canUndo) {
        console.log('Executing undo via keyboard shortcut');
        undo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z' || e.code === 'KeyZ')) {
      // Ctrl+Shift+Z или Cmd+Shift+Z
      e.preventDefault();
      if (canRedo) {
        console.log('Executing redo via keyboard shortcut');
        redo();
      }
    }
  }, [undo, redo, canUndo, canRedo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    console.log('Keyboard shortcuts enabled', { canUndo, canRedo });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      console.log('Keyboard shortcuts disabled');
    };
  }, [handleKeyDown]);
}; 