import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useDrawingStore } from '../store/useDrawingStore';
import { Point } from '../types/canvas';
import { getStroke } from 'perfect-freehand';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    elements,
    selectedTool,
    strokeColor,
    strokeWidth,
    roughness,
    addElement,
  } = useDrawingStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redrawCanvas();
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size setup

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      if (element.type === 'pencil') {
        const stroke = getStroke(element.points, {
          size: element.strokeWidth,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        });

        ctx.beginPath();
        ctx.fillStyle = element.strokeColor;
        
        if (stroke.length > 0) {
          ctx.moveTo(stroke[0][0], stroke[0][1]);
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i][0], stroke[i][1]);
          }
        }
        
        ctx.fill();
      } else {
        const [start, end] = element.points;
        if (!start || !end) return;

        switch (element.type) {
          case 'line':
            roughCanvas.line(start.x, start.y, end.x, end.y, {
              stroke: element.strokeColor,
              strokeWidth: element.strokeWidth,
              roughness: element.roughness,
            });
            break;
          case 'rectangle':
            roughCanvas.rectangle(
              start.x,
              start.y,
              end.x - start.x,
              end.y - start.y,
              {
                stroke: element.strokeColor,
                strokeWidth: element.strokeWidth,
                roughness: element.roughness,
              }
            );
            break;
          case 'ellipse':
            const width = Math.abs(end.x - start.x);
            const height = Math.abs(end.y - start.y);
            const centerX = start.x + (end.x - start.x) / 2;
            const centerY = start.y + (end.y - start.y) / 2;
            
            roughCanvas.ellipse(
              centerX,
              centerY,
              width,
              height,
              {
                stroke: element.strokeColor,
                strokeWidth: element.strokeWidth,
                roughness: element.roughness,
              }
            );
            break;
        }
      }
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [elements, strokeColor, strokeWidth, roughness]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setPoints([newPoint]);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };

    if (selectedTool === 'pencil') {
      setPoints((prev) => [...prev, newPoint]);
    } else {
      setPoints([points[0], newPoint]);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (points.length < 2) return; // Don't add single-point elements

    const element = {
      id: Date.now().toString(),
      type: selectedTool,
      points: points,
      strokeColor,
      strokeWidth,
      roughness,
    };

    addElement(element);
    setPoints([]);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

export default Canvas;