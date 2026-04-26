export const fetchExternalTasks = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }
    
    const data = await response.json();
    return data.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      external: true
    }));
  } catch (error) {
    console.error('Error fetching external tasks:', error);
    throw error;
  }
};