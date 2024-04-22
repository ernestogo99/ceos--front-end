import axios from '../utils/api.js'


const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const getData = async () =>  {
    const data = axios.get('/gettask', { headers: { Authorization: `Token ${token}` } });
    return data.json()
  }
  
  export default async function Todos() {
    const data = await getData();
    return (
      <>
        <h1>Tarefas para fazer:</h1>
        <ul className={styles.todolist}>
          {data.map((todo) => (
            <li key={todo.id}>
              {todo.id} - {todo.title}
            </li>
          ))}
        </ul>
      </>
    )
  }