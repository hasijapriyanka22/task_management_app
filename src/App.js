import React, { useState, useEffect } from 'react';
import './App.css';

const TaskList = ({ tasks, onEdit, onDelete }) => (
  <ul>
    {tasks.map((task) => (
      <li key={task.id}>
        <div>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
        {task.title}
      </li>
    ))}
  </ul>
);

const TaskForm = ({ onSubmit, buttonText, initialTitle }) => {
  const [title, setTitle] = useState(initialTitle || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  const handleAddTask = (title) => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed: false }),
    })
      .then((response) => response.json())
      .then((newTask) => setTasks([newTask, ...tasks]));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (id, newTitle) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setEditingTask(null);
        setIsModalOpen(false);
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      });
  };

  return (
    <div className='body'>  
      <h1>Task List</h1>
      <h2>Add Task</h2>
      <TaskForm onSubmit={handleAddTask} buttonText="Add Task" />
      <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Edit Task</h2>
        <TaskForm
          onSubmit={(newTitle) => handleUpdateTask(editingTask.id, newTitle)}
          buttonText="Save Changes"
          initialTitle={editingTask?.title}
        />
      </Modal>
    </div>
  );
};

export default App;