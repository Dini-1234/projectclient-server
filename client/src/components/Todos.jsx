import { useState, useEffect, useContext } from 'react';
import AddItem from './AddItem';
import Delete from './Delete';
import { UserContext } from './context';
import '../css/todos.css'
import EditItem from './EditItem';

const Todos = () => {
  const { user } = useContext(UserContext);
  const [myTodos, setMyTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isEditing, setIsEditing] = useState(null);
  const fields = [{ name: "title", inputType: "text" }];
  const initialObject = { user_id: user.id, completed: false };

  useEffect(() => {
    fetch(`http://localhost:3000/api/todos/${user.id}`)
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

  const handleCheckboxChange = (taskId) => {
    setMyTodos(prev => {
      const updatedTodos = prev.map(todo =>
        todo.id === taskId ? { ...todo, completed: !todo.completed } : todo
      );
      return updatedTodos;
    });

    fetch(`http://localhost:3000/api/todos/${taskId}`, {
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

  const sortTodos = (todos) => {
    if (!Array.isArray(todos)) return [];
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

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (myTodos.length === 0) {
    return <div>No todos found.</div>;
  }
  
  return (
    <div>
      <AddItem fields={fields} initialObject={initialObject} setData={setMyTodos} type="todos" />
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
            .map((task) => (
              <li key={task.id}>
                <div className="task-actions">
                  {isEditing === task.id ? (
                    <EditItem
                      item={task}
                      fields={[{ name: "title", inputType: "text" }]} 
                      type="todos"
                      setData={setMyTodos}
                      setIsEditing={setIsEditing}
                    />
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleCheckboxChange(task.id)}
                      />
                      <div className="task-text">{task.title}</div>
                      <button onClick={() => {
                        setIsEditing(task.id);
                      }}>Edit</button>
                      <Delete setMyItem={setMyTodos} id={task.id} type="todos" />
                    </>
                  )}
                </div>

              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Todos;