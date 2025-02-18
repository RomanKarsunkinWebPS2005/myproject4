import { FC, PropsWithChildren, useRef, CSSProperties } from 'react';
import { usePresentation } from '../../store/presentation/PresentationProvider';
import styles from './Resizable.module.css';

interface ResizableProps extends PropsWithChildren {
  width: number;
  height: number;
  onResize: (size: { width: number; height: number }) => void;
  minSize?: { width: number; height: number };
  style?: CSSProperties;
  disabled?: boolean;
}

export const Resizable: FC<ResizableProps> = ({ 
  children, 
  width, 
  height, 
  onResize,
  minSize = { width: 50, height: 50 },
  style,
  disabled
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width, height });

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    if (disabled) return;
    
    e.stopPropagation();
    isResizing.current = true;
    startPosition.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width, height };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;

      const deltaX = moveEvent.clientX - startPosition.current.x;
      const deltaY = moveEvent.clientY - startPosition.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      if (direction.includes('e')) newWidth += deltaX;
      if (direction.includes('w')) newWidth -= deltaX;
      if (direction.includes('s')) newHeight += deltaY;
      if (direction.includes('n')) newHeight -= deltaY;

      newWidth = Math.max(minSize.width, newWidth);
      newHeight = Math.max(minSize.height, newHeight);

      onResize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={elementRef}
      className={styles.resizable}
      style={{
        ...style,
        width: `${width}px`,
        height: `${height}px`,
        cursor: disabled ? 'default' : 'move'
      }}
    >
      {children}
      {!disabled && (
        <div className={styles.resizers}>
          <div className={`${styles.resizer} ${styles.nw}`} onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className={`${styles.resizer} ${styles.ne}`} onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className={`${styles.resizer} ${styles.sw}`} onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className={`${styles.resizer} ${styles.se}`} onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </div>
      )}
    </div>
  );
}; 