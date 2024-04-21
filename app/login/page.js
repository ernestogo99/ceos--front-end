// components/LoginForm.js
"use client"
import styles from './loginstyle.module.css';
import React, { useState, useEffect } from 'react'; // Importe o useEffect corretamente
import axios from '../utils/api.js';
import { useRouter } from 'next/navigation';
//import logoImg from './public/2U.png'; 

const LoginPage = () => {
  const router = useRouter(); // Usar useRouter diretamente dentro do componente

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/authentication/login',
        { username: username, password: password } // Dados de autenticação como um único objeto
      );


      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/todolist');
      } else {
        setError('Failed to login');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Erro ao efetuar login. Tente novamente mais tarde.');
      }
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (

    <div className={styles.corpo}>
      <div className={styles.logo}>
        <img className={isLoaded ? styles.loaded : ''} src="/images/2U (1).png" alt="Logo" />
      </div>
      <div className={styles.box}>
        <form onSubmit={loginSubmit}>
          <h2>Fazer login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputbox}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <span>Usuário</span>
            <i></i>
          </div>
          <div className={styles.inputbox}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <span>Senha</span>
            <i></i>
          </div>
          <input type="submit" value="Login" />
          <div className={styles.link}>
            <a href="/signup">Criar conta</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
