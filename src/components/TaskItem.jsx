import { useState } from 'react';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit, external = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const priorityColor = {
    low: '🟢',
    medium: '🟡', 
    high: '🔴'
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'low': return 'Rendah';
      case 'medium': return 'Sedang';
      case 'high': return 'Tinggi';
      default: return 'Normal';
    }
  };

    const handleEdit = () => {
  if (isEditing && editTitle.trim()) {
    onEdit(task.id, { 
      title: editTitle,
      description: editDescription // TAMBAHAN
    });
    setIsEditing(false);
  } else {
    setIsEditing(!isEditing);
  }
};

  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID') : 'Tidak ada';

  return (
    <div className={`task-item ${task.completed ? 'completed' : 'uncompleted'}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        disabled={external}
      />
      
      <div className="task-content" style={{flex: 1}}>
      {isEditing ? (
        <>
        <input
      type="text"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      style={{marginBottom: '0.5rem'}}
    />
    {/* TAMBAHAN */}
    <textarea
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
      rows="2"
    />
  </>
) : (
          <h4 style={{ 
            textDecoration: task.completed ? 'line-through' : 'none',
            margin: 0,
            color: task.completed ? '#666' : '#333'
          }}>
            {task.title}
          </h4>
        )}
        
        {task.description && (
          <p style={{margin: '0.25rem 0', color: '#666', fontSize: '0.9rem'}}>
            {task.description}
          </p>
        )}
        
        <div style={{fontSize: '0.85rem', color: '#888', marginTop: '0.5rem'}}>
          <span>{priorityColor[task.priority || 'medium']} {getPriorityText(task.priority || 'medium')}</span>
          {task.dueDate && (
            <>
              {' • '}
              <span>📅 {dueDate}</span>
            </>
          )}
          {external && (
            <>
              {' • '}
              <span style={{color: '#8da0f3'}}>🌐 Eksternal</span>
            </>
          )}
        </div>
      </div>
      
      {!external && (
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={handleEdit}
            className="btn btn-success"
            style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}
          >
            {isEditing ? '💾 Simpan' : '✏️ Edit'}
          </button>
          
          <button 
            onClick={() => onDelete(task.id)}
            className="btn btn-danger"
            style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}
          >
            🗑️ Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;