import { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddTask(formData);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3> Tambah Tugas Baru</h3>
      
      <div className="form-group">
        <label>Judul Tugas </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
          placeholder="Tulis judul tugas..."
        />
      </div>

      <div className="form-group">
        <label>Deskripsi</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Detail tugas (opsional)..."
        />
      </div>

      <div className="form-row">
        <div className="form-group" style={{flex: 1, marginRight: '1rem'}}>
          <label>Prioritas</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="low">🟢 Rendah</option>
            <option value="medium">🟡 Sedang</option>
            <option value="high">🔴 Tinggi</option>
          </select>
        </div>

        <div className="form-group" style={{flex: 1}}>
          <label>Tanggal Jatuh Tempo</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Tambah Tugas
      </button>
    </form>
  );
};

export default TaskForm;