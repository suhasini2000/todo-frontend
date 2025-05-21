import { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    if (!newTask.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask, done: false })
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to add task');
          return;
        }
        return res.json();
      })
      .then(todo => {
        if (todo) {
          setTodos([...todos, todo]);
          setNewTask('');
        }
      });
  };

  const deleteTodo = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTask(todo.task);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask('');
  };

  const saveEdit = (id) => {
    if (!editingTask.trim()) {
      alert('Task cannot be empty!');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editingTask })
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to update task');
          return;
        }
        return res.json();
      })
      .then(updated => {
        if (updated) {
          setTodos(todos.map(todo => todo.id === id ? { ...todo, task: updated.task } : todo));
          setEditingId(null);
          setEditingTask('');
        }
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

      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: 10 }}>
            {editingId === todo.id ? (
              <>
                <input
                  value={editingTask}
                  onChange={e => setEditingTask(e.target.value)}
                  style={{ marginRight: 10 }}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={cancelEdit} style={{ marginLeft: 5 }}>Cancel</button>
              </>
            ) : (
              <>
                {todo.task}
                <button onClick={() => startEdit(todo)} style={{ marginLeft: 10 }}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 5 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;