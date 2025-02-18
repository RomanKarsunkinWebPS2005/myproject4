export function dispatch(action: { 
  type: string; 
  payload: any 
}): void;

export function getPresentation(): {
  id: string;
  title: string;
  slides: Array<{
    id: string;
    background: string;
    elements: Array<any>;
  }>;
  currentSlideId: string;
};

export function addEditorChangeHandler(handler: () => void): void; 