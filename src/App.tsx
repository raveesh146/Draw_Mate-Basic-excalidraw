import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Toolbar />
      <Canvas />
    </div>
  );
}

export default App;