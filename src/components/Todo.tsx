

import React, { useState, useEffect } from 'react';
import './ToDo.scss';
import 'material-icons/iconfont/material-icons.scss';

interface ToDoProps {
    title: string;
    environment: string;
}

const ToDo: React.FC<ToDoProps> = ({ title, environment }) => {
    const [newTodo, setNewTodo] = useState<string>('');
    const [editTodo, setEditTodo] = useState<{ id: number, text: string } | null>(null);
    const [todos, setTodos] = useState<{ id: number, text: string, completed: boolean, editMode: boolean, environment: string }[]>([]);

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = () => {
        if (newTodo.trim() !== '') {
            const newToDo = { id: todos.length, text: newTodo, completed: false, editMode: false, environment };
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
        const todoToEdit = todos.find(todo => todo.id === id);
        if (todoToEdit) {
            setEditTodo({ id: todoToEdit.id, text: todoToEdit.text });
            const updatedToDos = todos.map(todo =>
                todo.id === id ? { ...todo, editMode: true } : todo
            );
            setTodos(updatedToDos);
        }
    }

    const handleSaveEdit = (editTodo: { id: number, text: string }) => {
        if (editTodo) {
            const updatedToDos = todos.map(todo => {
                if (todo.id === editTodo.id) {
                    return { ...todo, text: editTodo.text, editMode: false };
                }
                return todo;
            });
            setTodos(updatedToDos);
            setEditTodo(null); 
        }
    }

    return (
        <div className="ToDo">
            <h1 className='ToDo__Location'>{title}</h1>
            <h1 className='ToDo__Title'>ToDooze</h1>
            <form className="ToDo__Form">
                <input placeholder='TaDooze' className="ToDo__Input" type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                <button className="ToDo__Button" type="button" onClick={handleAddTodo}>Add</button>
            </form>
            <ul className="ToDo__List">
                {todos.map((todo) => {
                    if (todo.environment === environment) {
                        return (
                            <div className='ToDo__Container' key={todo.id}>
                                {editTodo && editTodo.id === todo.id && todo.editMode && <span onClick={() => handleSaveEdit(editTodo)} className="material-icons-outlined">save</span>}

                                {!todo.editMode && <span onClick={() => handleEditTodo(todo.id)} className="material-icons-outlined">edit</span>}
                                {todo.editMode ?
                                    <input
                                        placeholder='Edit Todo'
                                        className="ToDo__Item"
                                        type="text"
                                        value={editTodo?.text || ''}
                                        onChange={(e) => setEditTodo(prevState => ({ ...(prevState || {}), text: e.target.value, id: prevState?.id || 0 }))}
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
                        );
                    }
                    return null;
                })}
            </ul>
            {todos.length === 0 && <><span className="material-icons-outlined">add_task</span> <span className='ToDo__Empty'>Congrats, you have nothing ToDooze</span></>}
            {todos.length > 0 && <button onClick={() => setTodos([])} className="ToDo__Clear" type="button">Clear List</button>}
            <div className='ToDo__Footer'>Created by: Will-i-am</div>
        </div>
    );
};

export default ToDo;
