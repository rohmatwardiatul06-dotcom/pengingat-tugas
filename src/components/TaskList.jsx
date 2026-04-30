import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { fetchExternalTasks } from "../services/Api";

const TaskList = ({ taskManager, externalTasks, setExternalTasks }) => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");

  // Fetch external data on mount
  useEffect(() => {
    const loadExternalTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchExternalTasks();
        setExternalTasks(data);
      } catch (err) {
        setError("Gagal memuat data eksternal: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExternalTasks();
  }, [setExternalTasks]);

  const handleAddTask = (taskData) => {
    taskManager.addTask(taskData);
    setRefresh(!refresh); // TAMBAHAN
  };

  const handleToggleComplete = (id) => {
    taskManager.toggleComplete(id);
    setRefresh(!refresh); // TAMBAHAN
  };

  const handleEditTask = (id, updatedData) => {
    taskManager.updateTask(id, updatedData);
    setRefresh(!refresh); // TAMBAHAN
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Yakin ingin menghapus tugas ini?")) {
      taskManager.deleteTask(id);
      setRefresh(!refresh);
    }
  };

  const tasks = taskManager.getTasks();
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

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
        <p>
          Tanggal:{" "}
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      <TaskForm onAddTask={handleAddTask} />

      {/* TAMBAHAN */}
      <div className="tasks-section card">
        <h3> Tugas yang belum selesai ({activeTasks.length})</h3>

        {activeTasks.length === 0 ? (
          <p className="text-center">Tidak ada tugas aktif</p>
        ) : (
          activeTasks.map((task) => (
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

      {/* TAMBAHAN */}
      <div className="tasks-section card">
        <h3>Tugas yang sudah selesai({completedTasks.length})</h3>

        {completedTasks.length === 0 ? (
          <p className="text-center">Belum ada tugas selesai</p>
        ) : (
          completedTasks.map((task) => (
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
        {externalTasks.map((task) => (
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
