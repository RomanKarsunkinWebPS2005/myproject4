// Базовый тип для слайда
export interface Slide {
  id: string;
  elements: (TextElement | ImageElement)[];
  background: string;
}

// Тип для всей презентации
export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  currentSlideId: string;
}

export type BaseElement = Omit<SlideElement, 'id'>;

export type PresentationContextType = {
  presentation: Presentation;
  addSlide: () => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  updateSlideElement: (element: SlideElement) => void;
  addElement: (element: BaseElement) => void;
  removeElement: (elementId: string) => void;
  setCurrentSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  updatePresentation: (newPresentation: Presentation) => void;
  updateCurrentSlide: (updatedSlide: Slide) => void;
  setActiveElement: (elementId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export interface SlideElement {
  id: string;
  type: 'text' | 'image';
  content: string
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextElement extends SlideElement {
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right';
}

export interface ImageElement extends SlideElement {
  type: 'image';
  content: string; // base64 или URL
}

export interface ElementUpdate {
  elementId: string;
  updates: Partial<TextElement | ImageElement>;
} 