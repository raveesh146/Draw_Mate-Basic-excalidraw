import React from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import {
  BsPencil,
  BsDash,
  BsSquare,
  BsCircle,
  BsArrowCounterclockwise,
  BsTrash,
  BsDashLg,
  BsPlusLg,
} from 'react-icons/bs';

const Toolbar: React.FC = () => {
  const {
    selectedTool,
    strokeColor,
    strokeWidth,
    roughness,
    setSelectedTool,
    setStrokeColor,
    setStrokeWidth,
    setRoughness,
    clearCanvas,
    undoLastElement,
  } = useDrawingStore();

  const tools = [
    { icon: <BsPencil size={20} />, type: 'pencil' as const, title: 'Pencil' },
    { icon: <BsDashLg size={20} />, type: 'line' as const, title: 'Line' },
    { icon: <BsSquare size={20} />, type: 'rectangle' as const, title: 'Rectangle' },
    { icon: <BsCircle size={20} />, type: 'ellipse' as const, title: 'Ellipse' },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2 z-50">
      <div className="flex gap-1 border-r pr-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            title={tool.title}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              selectedTool === tool.type ? 'bg-gray-200' : ''
            }`}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-r pr-2">
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          title="Stroke Color"
          className="w-8 h-8 rounded cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2 border-r pr-2">
        <button
          onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
          title="Decrease Stroke Width"
          className="p-2 rounded hover:bg-gray-100"
        >
          <BsDash size={16} />
        </button>
        <span className="w-8 text-center">{strokeWidth}</span>
        <button
          onClick={() => setStrokeWidth(strokeWidth + 1)}
          title="Increase Stroke Width"
          className="p-2 rounded hover:bg-gray-100"
        >
          <BsPlusLg size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-r pr-2">
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={roughness}
          onChange={(e) => setRoughness(parseFloat(e.target.value))}
          title="Roughness"
          className="w-24"
        />
      </div>

      <div className="flex gap-1">
        <button
          onClick={undoLastElement}
          title="Undo"
          className="p-2 rounded hover:bg-gray-100"
        >
          <BsArrowCounterclockwise size={20} />
        </button>
        <button
          onClick={clearCanvas}
          title="Clear Canvas"
          className="p-2 rounded hover:bg-gray-100"
        >
          <BsTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;