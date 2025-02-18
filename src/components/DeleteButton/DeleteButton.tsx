import { FC } from 'react';
import styles from './DeleteButton.module.css';

interface DeleteButtonProps {
  onDelete: () => void;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ onDelete }) => {
  return (
    <button 
      className={styles.deleteButton}
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      ×
    </button>
  );
}; 