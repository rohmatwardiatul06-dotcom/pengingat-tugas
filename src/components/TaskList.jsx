import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import { fetchExternalTasks } from '../services/Api';

const TaskList = ({ taskManager, externalTasks, setExternalTasks }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch external data on mount
  useEffect(() => {
    const loadExternalTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchExternalTasks();
        setExternalTasks(data);
      } catch (err) {
        setError('Gagal memuat data eksternal: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExternalTasks();
  }, [setExternalTasks]);

  const handleAddTask = (taskData) => {
    taskManager.addTask(taskData);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Yakin ingin menghapus tugas ini?')) {
      taskManager.deleteTask(id);
    }
  };

  const handleToggleComplete = (id) => {
    taskManager.toggleComplete(id);
  };

  const handleEditTask = (id, updatedData) => {
    taskManager.updateTask(id, updatedData);
  };

  const tasks = taskManager.getTasks();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>⏳ Memuat data </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="welcome-section">
        <h1>📋 Daftar Tugas Saya</h1>
        <p>Tanggal: {new Date().toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      {error && <div className="error">{error}</div>}

      <TaskForm onAddTask={handleAddTask} />

      <div className="tasks-section card">
        <h3>📂 Tugas yang harus di selesaikan({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada tugas. Tambahkan tugas pertama!</p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
            />
          ))
        )}
      </div>

      <div className="external-tasks-section card">
        <h3>🌐 Data dari API Eksternal ({externalTasks.length})</h3>
        {externalTasks.map(task => (
          <TaskItem
            key={`ext-${task.id}`}
            task={task}
            external={true}
            onDelete={() => {}}
            onToggleComplete={() => {}}
            onEdit={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;