'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';

export default function HandwritingInput({ onCharacterRecognized }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recognizedChar, setRecognizedChar] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  
  // Store drawing state
  const drawingState = useRef({
    cw: 200, // canvas width
    ch: 200, // canvas height
    x: [], // x coordinates for current stroke
    y: [], // y coordinates for current stroke
    time: [], // timestamp for current stroke
    points: [], // array to store strokes: [x,y,time]
    drawings: [], // array to store all strokes
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set up canvas
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    const state = drawingState.current;
    state.cw = canvas.width;
    state.ch = canvas.height;
  }, []);

  const drawPoint = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    return {
      x: (clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  };

  const startDrawing = (e) => {
    if (e.touches) e.preventDefault(); // Prevent scrolling on touch devices
    
    const pos = getMousePos(e);
    const state = drawingState.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setIsDrawing(true);
    state.x = [pos.x];
    state.y = [pos.y];
    state.time = [Date.now()];
    state.points = [[pos.x, pos.y, Date.now()]];
    
    drawPoint(ctx, pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.touches) e.preventDefault();

    const pos = getMousePos(e);
    const state = drawingState.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    state.x.push(pos.x);
    state.y.push(pos.y);
    state.time.push(Date.now());
    state.points.push([pos.x, pos.y, Date.now()]);

    // Draw line to new position
    ctx.beginPath();
    ctx.moveTo(state.x[state.x.length - 2], state.y[state.y.length - 2]);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    const state = drawingState.current;
    if (state.points.length > 0) {
      state.drawings.push(state.points);
      recognize();
    }
    
    setIsDrawing(false);
    state.points = [];

    // Get the drawing data
    if (state.drawings.length === 0) return;

    setIsRecognizing(true);
    try {
      const requestData = {
        options: 'enable_pre_space',
        requests: [{
          writing_guide: {
            writing_area_width: canvasRef.current.width,
            writing_area_height: canvasRef.current.height
          },
          ink: state.drawings,
          language: 'zh_CN'
        }]
      };

      fetch('https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
      .then(response => response.json())
      .then(result => {
        if (result?.[1]?.[0]?.[1]?.[0]) {
          setRecognizedChar(result[1][0][1][0]);
        }
      })
      .catch(error => {
        console.error('Error recognizing character:', error);
      })
      .finally(() => {
        setIsRecognizing(false);
      });
    } catch (error) {
      console.error('Error sending recognition request:', error);
      setIsRecognizing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const state = drawingState.current;
    state.drawings = [];
    state.points = [];
    setRecognizedChar(null);
  };

  const recognize = async () => {
    const state = drawingState.current;
    if (state.drawings.length === 0) return;

    setIsRecognizing(true);
    try {
      // Format the ink data properly
      const strokes = state.drawings.map(stroke => {
        const xs = stroke.map(point => point[0]);
        const ys = stroke.map(point => point[1]);
        const times = stroke.map(point => point[2]);
        return [xs, ys, times];
      });

      const data = {
        options: 'enable_pre_space',
        requests: [{
          writing_guide: {
            writing_area_width: state.cw,
            writing_area_height: state.ch
          },
          ink: strokes,
          language: 'zh_CN'
        }]
      };

      const response = await fetch('https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result?.[1]?.[0]?.[1]?.[0]) {
        setRecognizedChar(result[1][0][1][0]);
      }
    } catch (error) {
      console.error('Error recognizing character:', error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleSend = () => {
    if (recognizedChar) {
      onCharacterRecognized(recognizedChar);
      clearCanvas();
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-4">
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="border-2 border-gray-300 rounded-lg bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        <button
          onClick={clearCanvas}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Clear canvas"
        >
          <Eraser size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {isRecognizing ? (
          <div className="text-gray-500">Recognizing...</div>
        ) : recognizedChar ? (
          <>
            <div className="px-4 py-2 border border-gray-300 rounded-lg text-xl">
              {recognizedChar}
            </div>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Send
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}