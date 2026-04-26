const { useState, useEffect } = React;

class TaskManager {
    constructor() { this.tasks = []; this.loading = false; this.error = null; }
    
    async fetchTasks() {
        this.loading = true; this.error = null;
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            const data = await response.json();
            this.tasks = data.map(task => ({
                id: task.id, title: task.title, completed: task.completed,
                priority: 'medium', dueDate: new Date().toISOString().split('T')[0]
            }));
        } catch (err) {
            this.error = err.message;
        } finally { this.loading = false; }
    }
    
    addTask(title, priority, dueDate) {
        this.tasks.unshift({ id: Date.now(), title, completed: false, priority, dueDate });
    }
    deleteTask(id) { this.tasks = this.tasks.filter(t => t.id !== id); }
    toggleComplete(id) {
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    }
    updateTask(id, updates) {
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    }
    getTasks() { return this.tasks; }
    isLoading() { return this.loading; }
    getError() { return this.error; }
}

const taskManager = new TaskManager();

// Dark Mode Hook
function useDarkMode() {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(saved === 'true' || (!saved && prefersDark));
    }, []);
    useEffect(() => {
        document.body.className = darkMode ? 'dark' : 'light';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);
    return [darkMode, setDarkMode];
}

function App() {
    const [darkMode, setDarkMode] = useDarkMode();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadTasks();
        setFilteredTasks(taskManager.getTasks());
    }, []);

    const loadTasks = async () => {
        await taskManager.fetchTasks();
        setTasks(taskManager.getTasks());
        setFilteredTasks(taskManager.getTasks());
        setLoading(taskManager.isLoading());
        setError(taskManager.getError());
    };

    const handleAddTask = (newTask) => {
        taskManager.addTask(newTask.title, newTask.priority, newTask.dueDate);
        setTasks([...taskManager.getTasks()]);
        setFilteredTasks([...taskManager.getTasks()]);
    };

    const handleDeleteTask = (id) => {
        taskManager.deleteTask(id);
        setTasks([...taskManager.getTasks()]);
        setFilteredTasks([...taskManager.getTasks()]);
    };

    const handleToggleComplete = (id) => {
        taskManager.toggleComplete(id);
        setTasks([...taskManager.getTasks()]);
        setFilteredTasks([...taskManager.getTasks()]);
    };

    return (
        <div className="min-h-screen p-4 transition-colors duration-300">
            <Navbar 
                onRefresh={loadTasks} 
                showForm={showForm} 
                onToggleForm={() => setShowForm(!showForm)}
                darkMode={darkMode} 
                toggleDarkMode={() => setDarkMode(!darkMode)}
            />
            
            <div className="max-w-4xl mx-auto mt-8 space-y-6">
                <TaskStats tasks={tasks} darkMode={darkMode} />
                
                <TaskSearchFilter 
                    tasks={tasks} 
                    setFilteredTasks={setFilteredTasks}
                    darkMode={darkMode}
                />
                
                {showForm && <TaskForm onAddTask={handleAddTask} darkMode={darkMode} />}
                {loading && <LoadingSpinner />}
                {error && (
                    <div className={`glass p-6 text-center rounded-2xl ${darkMode ? 'text-red-300 bg-red-500/10' : 'text-red-100 bg-red-500/20'}`}>
                        <p className="text-lg font-semibold">❌ {error}</p>
                        <button onClick={loadTasks} className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl">
                            Coba Lagi
                        </button>
                    </div>
                )}
                
                <TaskList 
                    tasks={filteredTasks}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                    darkMode={darkMode}
                />
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));