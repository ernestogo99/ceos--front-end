// components/LoginForm.js
"use client"
import styles from './signupstyle.module.css';
import React, { useState, useEffect } from 'react'; // Importe o useEffect corretamente
import axios from '../utils/api.js';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
    const router = useRouter(); // Usar useRouter diretamente dentro do componente
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const signupSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                '/authentication/signup',
                { username: username, password: password, email: email } // Dados de autenticação como um único objeto
            );

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                router.push('/todolist');
            } else {
                setError('Falha ao registrar');
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                setError(error.response.data.detail);
            } else {
                setError('Erro ao se registrar. Tente novamente.');
            }
        }
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);


    return (
        <div className={styles.corpo}>


            <div className={styles.box}>
                <form onSubmit={signupSubmit}>
                    <h2>Inscreva-se hoje</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.inputbox}>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <span>Usuário</span>
                        <i></i>
                    </div>
                    <div className={styles.inputbox}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <span>Email</span>
                        <i></i>
                    </div>
                    <div className={styles.inputbox}>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <span>Senha</span>
                        <i></i>
                    </div>
                    <input type="submit" value="Criar conta" />
                </form>
            </div>

            <div className={styles.description}>
                <h1 className={isLoaded ? styles.loaded : ''}>
                    Faça sua inscrição agora e torne sua vida muito mais produtiva.
                </h1>
            </div>
        </div>
    );
};

export default SignupPage;
