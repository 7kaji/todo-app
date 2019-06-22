import React from 'react';
import './App.css';
import Todos from './components/Todos'

const App: React.FC = () => {
  return (
    <div className="container">
      <Todos />
    </div>
  );
}

export default App;
