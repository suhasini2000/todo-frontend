import React from 'react';

function TodoList({ todos, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} style={{ marginBottom: 10 }}>
          {todo.task}
          <button onClick={() => onDelete(todo.id)} style={{ marginLeft: 10 }}>
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
