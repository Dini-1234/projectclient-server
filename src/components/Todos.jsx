import React, { useState, useEffect, useContext } from 'react';
import Search from './Search';
import AddItem from './AddItem';
import Delete from './Delete';
import Edit from './Edit';
import { UserContext } from './context';
import '../css/todos.css'
const Todos = () => {
  const { user } = useContext(UserContext);
  const [myTodos, setMyTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isEditing, setIsEditing] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3010/todos?userId=${user.id}`)
      .then(response => response.json())
      .then(json => {
        setMyTodos(json);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      });
  }, [user.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCheckboxChange = (taskId) => {
    setMyTodos(prev => {
      const updatedTodos = prev.map(todo =>
        todo.id === taskId ? { ...todo, completed: !todo.completed } : todo
      );
      return updatedTodos;
    });

    fetch(`http://localhost:3010/todos/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...myTodos.find(todo => todo.id === taskId),
        completed: !myTodos.find(todo => todo.id === taskId).completed,
      }),
    }).catch(err => console.error('Error updating task:', err));
  };

  const saveEdit = (taskId) => {
    const updatedTask = { ...myTodos.find(todo => todo.id === taskId), title: newTitle };

    fetch(`http://localhost:3010/todos/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(() => {
        setMyTodos(prev =>
          prev.map(todo =>
            todo.id === taskId ? { ...todo, title: newTitle } : todo
          )
        );
        setIsEditing(null);
      })
      .catch(err => console.error('Error updating task:', err));
  };

  const sortTodos = (todos) => {
    return todos.sort((a, b) => {
      if (sortOrder === 'asc') {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      } else {
        if (a[sortField] < b[sortField]) return 1;
        if (a[sortField] > b[sortField]) return -1;
        return 0;
      }
    });
  };

  return (
    <div>
      <AddItem setMyItem={setMyTodos} type="todos" />
      <Search search={search} setSearch={setSearch} />

      <div className='todosList'>
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
          <option value="id">ID</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Ascending sort</option>
          <option value="desc">Descending sort</option>
        </select>

        <ul>
          {sortTodos(myTodos)
            .filter(task =>
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.id.toString().includes(search) ||
              ("true".includes(search.toLowerCase()) && task.completed) ||
              ("false".includes(search.toLowerCase()) && !task.completed)
            )
            .map((task, index) => (
              <li key={task.id}>
                {isEditing === task.id ? (
                  <div className='task-text'>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button onClick={() => saveEdit(task.id)}>Save</button>
                    <button onClick={() => setIsEditing(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(task.id)}
                    />
                    <div className='task-text'>
                      {index + 1}. {task.title}
                    </div>
                    <div className="task-actions">
                      <Delete setMyItem={setMyTodos} id={task.id} type="todos" />
                      <Edit myTodos={myTodos} id={task.id} setIsEditing={setIsEditing} setNewTitle={setNewTitle} />
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Todos;