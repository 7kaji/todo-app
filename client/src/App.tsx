import React from 'react';
import './App.css';
import Todos from './components/Todos'

const App: React.FC = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Todo List</h1>
      </div>
      <Todos />
    </div>
  );
}

export default App;
