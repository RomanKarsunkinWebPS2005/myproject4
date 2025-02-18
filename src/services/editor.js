let currentPresentation = null;
let editorChangeHandler = null;

export const getPresentation = () => {
  return JSON.parse(JSON.stringify(currentPresentation));
};

export const setPresentation = (newPresentation) => {
  currentPresentation = JSON.parse(JSON.stringify(newPresentation));
  if (editorChangeHandler) {
    editorChangeHandler();
  }
};

export const dispatch = (action) => {
  console.log('Dispatching action:', action);
  
  if (!currentPresentation && action.type !== 'INIT') return;
  
  let updated = false;

  switch (action.type) {
    case 'INIT':
      currentPresentation = JSON.parse(JSON.stringify(action.payload));
      updated = true;
      break;

    case 'UPDATE_SLIDE':
      const { slideId, updates } = action.payload;
      currentPresentation = {
        ...currentPresentation,
        slides: currentPresentation.slides.map(slide =>
          slide.id === slideId 
            ? { ...slide, ...updates } 
            : slide
        )
      };
      updated = true;
      break;

    case 'ADD_SLIDE':
      const newSlide = {
        id: crypto.randomUUID(),
        background: '#ffffff',
        elements: []
      };
      currentPresentation = {
        ...currentPresentation,
        slides: [...currentPresentation.slides, newSlide],
        currentSlideId: newSlide.id
      };
      updated = true;
      break;

    case 'DELETE_SLIDE':
      const filteredSlides = currentPresentation.slides.filter(
        slide => slide.id !== action.payload
      );
      currentPresentation = {
        ...currentPresentation,
        slides: filteredSlides,
        currentSlideId: currentPresentation.currentSlideId === action.payload 
          ? filteredSlides[0]?.id 
          : currentPresentation.currentSlideId
      };
      updated = true;
      break;

    case 'SET_CURRENT_SLIDE':
      currentPresentation = {
        ...currentPresentation,
        currentSlideId: action.payload
      };
      updated = true;
      break;

    case 'ADD_ELEMENT':
      currentPresentation = {
        ...currentPresentation,
        slides: currentPresentation.slides.map(slide =>
          slide.id === currentPresentation.currentSlideId
            ? { 
                ...slide, 
                elements: [...slide.elements, {
                  ...action.payload,
                  id: crypto.randomUUID()
                }]
              }
            : slide
        )
      };
      updated = true;
      break;

    case 'UPDATE_ELEMENT':
      currentPresentation = {
        ...currentPresentation,
        slides: currentPresentation.slides.map(slide => ({
          ...slide,
          elements: slide.elements.map(element =>
            element.id === action.payload.elementId
              ? { ...element, ...action.payload.updates }
              : element
          )
        }))
      };
      updated = true;
      break;

    case 'REMOVE_ELEMENT':
      currentPresentation = {
        ...currentPresentation,
        slides: currentPresentation.slides.map(slide => ({
          ...slide,
          elements: slide.elements.filter(element => element.id !== action.payload)
        }))
      };
      updated = true;
      break;
  }

  if (updated && editorChangeHandler) {
    console.log('State updated:', currentPresentation);
    editorChangeHandler();
  }
};

export const addEditorChangeHandler = (handler) => {
  editorChangeHandler = handler;
}; 