import { useState, useCallback } from 'react';
import { Size } from '../types/common';

interface UseResizeProps {
  initialSize: Size;
  onResize: (size: Size) => void;
  minSize?: Size;
  maxSize?: Size;
}

export const useResize = ({ initialSize, onResize, minSize, maxSize }: UseResizeProps) => {
  const [size, setSize] = useState<Size>(initialSize);

  const handleResize = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) newWidth = startWidth + deltaX;
      if (direction.includes('w')) newWidth = startWidth - deltaX;
      if (direction.includes('s')) newHeight = startHeight + deltaY;
      if (direction.includes('n')) newHeight = startHeight - deltaY;

      // Применяем ограничения
      if (minSize) {
        newWidth = Math.max(minSize.width, newWidth);
        newHeight = Math.max(minSize.height, newHeight);
      }
      if (maxSize) {
        newWidth = Math.min(maxSize.width, newWidth);
        newHeight = Math.min(maxSize.height, newHeight);
      }

      const newSize = { width: newWidth, height: newHeight };
      setSize(newSize);
      onResize(newSize);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [size, onResize, minSize, maxSize]);

  return { size, handleResize };
}; 