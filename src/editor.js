export const updateElementPosition = (element, position) => {
  return {
    type: 'UPDATE_ELEMENT_POSITION',
    payload: {
      elementId: element.id,
      position
    }
  };
};

export const updateElementSize = (element, size) => {
  return {
    type: 'UPDATE_ELEMENT_SIZE',
    payload: {
      elementId: element.id,
      size
    }
  };
};

// В reducer добавим обработку новых действий:
case 'UPDATE_ELEMENT_POSITION': {
  const { elementId, position } = action.payload;
  return {
    ...state,
    slides: state.slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(element => 
        element.id === elementId
          ? { ...element, ...position }
          : element
      )
    }))
  };
}

case 'UPDATE_ELEMENT_SIZE': {
  const { elementId, size } = action.payload;
  return {
    ...state,
    slides: state.slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(element => 
        element.id === elementId
          ? { ...element, ...size }
          : element
      )
    }))
  };
} 