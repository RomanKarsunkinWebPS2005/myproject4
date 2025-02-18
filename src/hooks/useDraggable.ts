import { useCallback, useRef, useState } from 'react';
import { Position } from '../types/common';
import { usePresentation } from '../store/presentation/PresentationProvider';

interface UseDraggableProps {
  elementId: string;
  initialPosition: Position;
  bounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  disabled?: boolean;
}

export const useDraggable = ({ elementId, initialPosition, bounds, disabled }: UseDraggableProps) => {
  const { dispatch: editorDispatch } = usePresentation();
  const [position, setPosition] = useState<Position>(initialPosition);
  const isDragging = useRef(false);
  const startPosition = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.stopPropagation();
    isDragging.current = true;
    startPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;

      let newX = moveEvent.clientX - startPosition.current.x;
      let newY = moveEvent.clientY - startPosition.current.y;

      if (bounds) {
        newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
        newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));
      }

      setPosition({ x: newX, y: newY });
      
      editorDispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          elementId,
          updates: { x: newX, y: newY }
        }
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position, bounds, elementId, editorDispatch, disabled]);

  return {
    position,
    handleMouseDown
  };
}; 