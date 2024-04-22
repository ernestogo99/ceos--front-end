"use client"
import React, { useState, useEffect } from 'react';
import axios from '../utils/api.js';
import styles from './todostyle.module.css';
import { useRouter } from 'next/router';

const TodoListPage = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedTodo, setEditedTodo] = useState({ id: '', title: '', text: '' }); // Inicialize editedTodo corretamente
    const [searchTerm, setSearchTerm] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        axios.get('/gettask', { headers: { Authorization: `Token ${token}` } })
            .then(res => setTodos(res.data))
            .catch(err => console.log(err));
    }, []);

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
            setTodos(prevTodos => prevTodos.filter(todo => todo.title !== title));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
        window.location.reload();
    };


    const handleEdit = (id) => {
        setEditMode(true);
        const todoToEdit = todos.find(todo => todo.id === id);
        setEditedTodo({
            ...todoToEdit
        });
    };



    const logoff = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';  // Redirecione para a página de login
    };

    const handleUpdateTodo = async () => {
        try {
            await axios.put(`/updatetask/${editedTodo.id}`, { title: editedTodo.text }, { headers: { Authorization: `Token ${token}` } });
            setTodos(prevTodos => prevTodos.map(todo => {
                if (todo.id === editedTodo.id) {
                    return { ...todo, text: editedTodo.text };
                }
                return todo;
            }));
            window.location.reload();

            setEditMode(false);
            setEditedTodo({ id: '', title: '', text: '' }); // Limpe o estado editedTodo após a edição
        } catch (error) {
            console.error('Error updating todo:', error);
        }

    };
    return (
        <div className={styles.corpo}>
            <div className={styles.todoList}>
                <h1>Todo List</h1>

                <button onClick={() => logoff()} className={styles.logoff}>Log off</button>
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
                    {todos.map((todo) => (
                        <div key={todo.id} className={styles.todoItem}>
                            <div className={styles.todoText}>{todo.title}</div>
                            {editMode && editedTodo.id === todo.id ? (
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
                                    <div className={styles.buttonsContainer}>
                                        <button onClick={() => handleEdit(todo.id)} className={styles.editButton}>Editar</button>
                                        <button onClick={() => handleDeleteTodo(todo.id)} className={styles.deleteButton}>Excluir</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodoListPage;
