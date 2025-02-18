import { useCallback, useRef, useState } from 'react';
import { Position } from '../types/common';

interface UseDraggableSlideProps {
  index: number;
  onDragEnd: (sourceIndex: number, targetIndex: number) => void;
}

export const useDraggableSlide = ({ index, onDragEnd }: UseDraggableSlideProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number>(0);
  const slideElement = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!slideElement.current) return;
      
      const deltaY = moveEvent.clientY - dragStartY.current;
      slideElement.current.style.transform = `translateY(${deltaY}px)`;
      slideElement.current.style.zIndex = '1000';
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (!slideElement.current) return;
      
      setIsDragging(false);
      slideElement.current.style.transform = '';
      slideElement.current.style.zIndex = '';

      // Определяем целевой индекс на основе позиции курсора
      const slideElements = document.querySelectorAll('[data-slide-index]');
      let targetIndex = index;

      slideElements.forEach((element, i) => {
        const rect = element.getBoundingClientRect();
        if (upEvent.clientY > rect.top && upEvent.clientY < rect.bottom) {
          targetIndex = i;
        }
      });

      if (targetIndex !== index) {
        onDragEnd(index, targetIndex);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [index, onDragEnd]);

  return {
    isDragging,
    slideRef: slideElement,
    handleDragStart
  };
}; 