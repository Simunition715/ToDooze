import React, { useState } from 'react';
import './ToDo.scss';
import 'material-icons/iconfont/material-icons.scss';

interface ToDoProps {
    toDos: {
        id: number;
        text: string;
        completed: boolean;
        editMode: boolean;
    }[];
}

const ToDo: React.FC<ToDoProps> = ({ toDos }) => {
    const [newTodo, setNewTodo] = useState<string>('');
    const [todos, setTodos] = useState(toDos);
    const [editTodos, setEditTodos] = useState<{ [key: number]: string }>({});

     // Load todos from localStorage on component mount
     React.useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    // Save todos to localStorage whenever todos change
    React.useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);


    const handleAddTodo = () => {
        if (newTodo.trim() !== '') {
            const newToDo = { id: todos.length, text: newTodo, completed: false, editMode: false };
            setTodos([...todos, newToDo]);
            setNewTodo('');
        }
    }

    const handleCompletedToDo = (id: number) => {
        const updatedToDos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedToDos);
    }

    const handleDeleteTodo = (id: number) => {
        const updatedToDos = todos.filter(todo => todo.id !== id);
        setTodos(updatedToDos);
    }

    const handleEditTodo = (id: number) => {
        const updatedEditTodos = { ...editTodos };
        updatedEditTodos[id] = todos.find(todo => todo.id === id)?.text || '';
        setEditTodos(updatedEditTodos);

        const updatedToDos = todos.map(todo =>
            todo.id === id ? { ...todo, editMode: true } : todo
        );
        setTodos(updatedToDos);
    }

    const handleSaveEdit = (id: number) => {
        const updatedToDos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: editTodos[id], editMode: false };
            }
            return todo;
        });
        setTodos(updatedToDos);
    }

    return (
        <div className="ToDo">
            <h1 className='ToDo__Title'>ToDooze</h1>
            <form className="ToDo__Form">
                <input placeholder='TaDooze' className="ToDo__Input" type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                <button className="ToDo__Button" type="button" onClick={handleAddTodo}>Add</button>
            </form>
            <ul className="ToDo__List">
                {todos.map((todo) => (
                    <div className='ToDo__Container' key={todo.id}>
                        {editTodos[todo.id] && todo.editMode && <span onClick={() => handleSaveEdit(todo.id)} className="material-icons-outlined">save</span>}
                        {!todo.editMode && <span onClick={() => handleEditTodo(todo.id)} className="material-icons-outlined">edit</span>}
                        {todo.editMode ?
                            <input
                                placeholder='Edit Todo'
                                className="ToDo__Item"
                                type="text"
                                value={editTodos[todo.id]}
                                onChange={(e) => setEditTodos({ ...editTodos, [todo.id]: e.target.value })}
                            /> :
                            <li
                                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                                onClick={() => handleCompletedToDo(todo.id)}
                                className="ToDo__Item"
                            >
                                {todo.text}
                            </li>
                        }
                        <span onClick={() => handleDeleteTodo(todo.id)} className="material-icons-outlined">delete</span>
                    </div>
                ))}
            </ul>
            {todos.length === 0 && <><span className="material-icons-outlined">add_task</span> <span className="ToDo__Empty">You have nothing ToDooze</span></>}
            {todos.length > 0 && <button onClick={() => setTodos([])} className="ToDo__Clear" type="button">Clear List</button>}
        <div className='ToDo__Footer'>Created by: Will-i-am</div>
        </div>
    );
};

export default ToDo;
