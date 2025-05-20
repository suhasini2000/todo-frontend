import { useEffect, useState } from 'react';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    if (!newTask.trim()) return;

    fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask, done: false })
    })
      .then(res => res.json())
      .then(todo => {
        setTodos([...todos, todo]);
        setNewTask('');
      });
  };

  const deleteTodo = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h1>To-Do List</h1>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter new task"
          style={{ flex: 1, marginRight: 10 }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <TodoList todos={todos} onDelete={deleteTodo} />
    </div>
  );
}

export default App;