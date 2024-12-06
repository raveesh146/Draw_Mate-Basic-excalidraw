import { create } from 'zustand';
import { DrawElement } from '../types/canvas';

interface DrawingState {
  elements: DrawElement[];
  selectedTool: 'line' | 'rectangle' | 'ellipse' | 'pencil';
  strokeColor: string;
  strokeWidth: number;
  roughness: number;
  addElement: (element: DrawElement) => void;
  setSelectedTool: (tool: DrawElement['type']) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setRoughness: (roughness: number) => void;
  clearCanvas: () => void;
  undoLastElement: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  elements: [],
  selectedTool: 'pencil',
  strokeColor: '#000000',
  strokeWidth: 2,
  roughness: 1,
  
  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),
    
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  
  setStrokeColor: (color) => set({ strokeColor: color }),
  
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  
  setRoughness: (roughness) => set({ roughness: roughness }),
  
  clearCanvas: () => set({ elements: [] }),
  
  undoLastElement: () =>
    set((state) => ({
      elements: state.elements.slice(0, -1),
    })),
}));