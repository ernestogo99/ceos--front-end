"use client"
import React, { useState, useEffect } from 'react';
import axios from '../utils/api.js';
import styles from './todostyle.module.css';

const TodoListPage = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedTodo, setEditedTodo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    useEffect(() => {
        async function getTasks() {
            try {
                const response = await axios.get('/gettask', { headers: { Authorization: `Token ${token}` } });
                setTodos(response.data);
            } catch (error) {
                console.log(error);
            } 
        }
        getTasks();
    }, [token]);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;

        try {
            const response = await axios.post('/createtask', { title: newTodo }, { headers: { Authorization: `Token ${token}` } });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleDeleteTodo = async (title) => {
        try {
            await axios.delete(`/deletetask/${title}`, { headers: { Authorization: `Token ${token}` } });
            const updatedTodos = todos.filter(todo => todo.title !== title);
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleEdit = (title) => {
        setEditMode(true);
        setEditedTodo({
            title,
            text: todos.find(todo => todo.title === title).text
        });
    };

    const handleUpdateTodo = async () => {
        try {
            await axios.put(`/updatetask/${editedTodo.title}`, { text: editedTodo.text }, { headers: { Authorization: `Token ${token}` } });
            const updatedTodos = [...todos];
            const index = updatedTodos.findIndex(todo => todo.title === editedTodo.title);
            updatedTodos[index] = { ...updatedTodos[index], text: editedTodo.text };
            setTodos(updatedTodos);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const filteredTodos = todos.filter((todo) =>
        todo && todo.text && todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.todoList}>
            <h1>Todo List</h1>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />
            <form onSubmit={handleAddTodo} className={styles.addForm}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new todo"
                    className={styles.todoInput}
                />
                <button type="submit" className={styles.addButton}>Add</button>
            </form>
            <div className={styles.todoListContainer}>
                {filteredTodos.map((todo) => (
                    <div key={todo.title} className={styles.todoItem}>
                        {editMode && editedTodo.title === todo.title ? (
                            <>
                                <input
                                    type="text"
                                    value={editedTodo.text}
                                    onChange={(e) =>
                                        setEditedTodo({
                                            ...editedTodo,
                                            text: e.target.value
                                        })
                                    }
                                    className={styles.todoInput}
                                />
                                <button onClick={handleUpdateTodo} className={styles.updateButton}>Update</button>
                            </>
                        ) : (
                            <>
                                <span>{todo.text}</span>
                                <button onClick={() => handleEdit(todo.title)} className={styles.editButton}>Edit</button>
                                <button onClick={() => handleDeleteTodo(todo.title)} className={styles.deleteButton}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoListPage;
