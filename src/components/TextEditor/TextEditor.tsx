import { FC, useState, useEffect, useRef } from 'react';
import { TextElement } from '../../store/presentation/types';
import styles from './TextEditor.module.css';
import { TextToolbar } from '../TextToolbar/TextToolbar';
import { usePresentation } from '../../store/presentation/PresentationProvider';

interface TextEditorProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
  onClose: () => void;
}

export const TextEditor: FC<TextEditorProps> = ({ element, onUpdate, onClose }) => {
  const [text, setText] = useState(element.content);
  const editorRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: element.width, height: element.height });
  const lastCaretPosition = useRef<number>(0);
  const { removeElement } = usePresentation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const editorWrapper = editorRef.current?.closest(`.${styles.editorWrapper}`);
      
      // Проверяем, что клик был вне всего компонента редактора
      if (editorWrapper && !editorWrapper.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      // Установить курсор в конец текста
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, []);

  // Сохраняем позицию курсора
  const saveCaretPosition = () => {
    const selection = window.getSelection();
    if (!selection?.focusNode || !editorRef.current) return;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    lastCaretPosition.current = preCaretRange.toString().length;
  };

  // Восстанавливаем позицию курсора
  const restoreCaretPosition = () => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    let currentPos = 0;
    let done = false;

    const traverseNodes = (node: Node) => {
      if (done) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const nodeLength = node.textContent?.length || 0;
        if (currentPos + nodeLength >= lastCaretPosition.current) {
          range.setStart(node, lastCaretPosition.current - currentPos);
          range.setEnd(node, lastCaretPosition.current - currentPos);
          done = true;
        } else {
          currentPos += nodeLength;
        }
      } else {
        node.childNodes.forEach(traverseNodes);
      }
    };

    traverseNodes(editorRef.current);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    saveCaretPosition();
    const newText = e.currentTarget.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
    
    // Если текст пустой, удаляем элемент
    if (!newText) {
      onClose();
      removeElement(element.id);
      return;
    }

    setText(newText);

    // Измеряем реальную ширину контента
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'pre-wrap'; // Учитываем переносы строк
    tempDiv.style.width = `${element.width}px`;
    tempDiv.style.fontSize = `${element.fontSize}px`;
    tempDiv.innerHTML = newText;
    document.body.appendChild(tempDiv);

    const contentOverflows = tempDiv.scrollWidth > element.width;
    document.body.removeChild(tempDiv);

    onUpdate({ 
      content: newText,
      ...(contentOverflows && { width: element.width + 40 }) // Увеличиваем ширину только при переполнении
    });

    requestAnimationFrame(restoreCaretPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCaretPosition();
      document.execCommand('insertLineBreak');
      const newText = editorRef.current?.innerHTML || '';
      setText(newText);
      onUpdate({ content: newText });
      requestAnimationFrame(restoreCaretPosition);
    }
  };

  const handleResize = (e: React.MouseEvent, direction: string) => {
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

      setSize({ width: newWidth, height: newHeight });
      onUpdate({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={styles.editorWrapper}>
      <TextToolbar element={element} onUpdate={onUpdate} />
      <div 
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          fontSize: `${element.fontSize}px`,
          color: element.color,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          fontStyle: element.fontStyle,
          textDecoration: element.textDecoration,
          textAlign: element.textAlign || 'left',
          whiteSpace: 'pre-wrap',
          width: size.width,
          height: size.height
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <div className={styles.resizers}>
        <div className={`${styles.resizer} ${styles.nw}`} onMouseDown={(e) => handleResize(e, 'nw')} />
        <div className={`${styles.resizer} ${styles.ne}`} onMouseDown={(e) => handleResize(e, 'ne')} />
        <div className={`${styles.resizer} ${styles.sw}`} onMouseDown={(e) => handleResize(e, 'sw')} />
        <div className={`${styles.resizer} ${styles.se}`} onMouseDown={(e) => handleResize(e, 'se')} />
      </div>
    </div>
  );
}; 