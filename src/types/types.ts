export interface TextElementType {
  type: 'text';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  // ... другие свойства
}
