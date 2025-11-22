import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Square, RefreshCw, Zap } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8080/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTodos(todos.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="cyber-container w-full">

        <header className="mb-8 text-center relative">
          <h1 className="glitch-text mb-2">NEON TASKS <Zap className="inline-block text-yellow-400" size={40} /></h1>
          <p className="text-cyan-400 tracking-widest">SYSTEM.V.1.0 // READY</p>
          <div className="h-1 w-32 bg-pink-500 mx-auto mt-4 shadow-pink" style={{ height: '4px', width: '8rem' }}></div>
        </header>

        <div className="cyber-card mb-8">
          <form onSubmit={addTodo} className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="ENTER NEW DIRECTIVE..."
              className="cyber-input flex-1"
            />
            <button type="submit" className="cyber-btn flex items-center gap-2">
              <Plus size={20} /> ADD
            </button>
          </form>
        </div>

        <div className="cyber-card" style={{ minHeight: '300px' }}>
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl text-pink-500">ACTIVE PROTOCOLS</h2>
            <button onClick={fetchTodos} className="cyber-btn-secondary p-2 rounded-full hover-rotate-180 transition-transform">
              <RefreshCw size={18} />
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todos.length === 0 && (
                <div className="text-center text-gray-500 py-10" style={{ padding: '2.5rem 0' }}>
                  NO ACTIVE TASKS DETECTED
                </div>
              )}
              {todos.map((todo) => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? (
                      <Check className="text-green-400" size={24} />
                    ) : (
                      <Square className="text-pink-500" size={24} />
                    )}
                    <span className={`text-lg ${todo.completed ? 'text-gray-500' : 'text-white'}`}>
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-gray-600 text-sm font-mono">
          POWERED BY RUST & REACT // <span className="text-cyan-600">SECURE CONNECTION</span>
        </footer>

      </div>
    </div>
  );
}

export default App;
