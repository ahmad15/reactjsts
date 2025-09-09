import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { IoPersonCircleOutline, IoPersonCircleSharp, IoPower } from "react-icons/io5";

import MessageBanner from '../components/MessageBanner';
import SearchTodo from '../components/SearchTodo';
import TodoList from '../components/TodoList';

import Todo from '../models/todo.model';
import Token from '../models/token.model';

import TodoApi from "../api/todo";
import errorHandler from '../utils/error';
import CONST from '../constants';

type HomeProps = {
  removeToken: () => void;
  getToken: () => string;
}

function Home(props: HomeProps) {
  const navigate = useNavigate();
  const token = props.getToken();
  const [apiResponse, setApiResponse] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo["detail"][]>([]);
  const [credential, setCredential] = useState<Token["credential"]>();
  const [defaultFilter, setDefaultFilter] = useState<string>("sort=asc&status=todo");
  const [btnActionState, setbtnActionState] = useState<boolean>(false);

  const setNewMessage = (message: string) => {
    setMessage("");
    setErrMessage("");
    setMessage(message);
  };

  const setNewErrMessage = (message: string) => {
    setMessage("");
    setErrMessage("");
    setErrMessage(message);
  };

  const todoDoneHandler = (id: string, status: string | null) => {
    let todo = todos.filter(todo => todo.id === id);
    const patch = {
      ...todo[0],
      snapshot: null
    };

    if (status && status !== CONST.STATUS.DONE) {
      patch.status = status;
    } else {
      patch.done = !todo[0].done;
    }

    if (status === CONST.STATUS.DONE) {
      patch.done = true;
    }

    setIsLoading(true);
    TodoApi.patchData(token, patch)
      .then(response => {
        setApiResponse(!apiResponse);
        setNewMessage(response.data.message);
        setIsLoading(false);
      })
      .catch(ex => {
        const error = errorHandler(ex);

        setNewErrMessage(error);
        setIsLoading(false);
      });
  };

  const todoDeleteHandler = (id: string) => {
    setIsLoading(true);
    TodoApi.deleteData(token, id)
      .then(response => {
        setApiResponse(!apiResponse);
        setNewMessage(response.data.message);
        setIsLoading(false);
      })
      .catch(ex => {
        const error = errorHandler(ex);

        setNewErrMessage(error);
        setIsLoading(false);
      });
  };

  const todoFilterHandler = React.useCallback((query: string) => {
    setDefaultFilter(query);
    setIsLoading(true);
    TodoApi.getData(token, query)
      .then(response => {
        setTodos(response.data);
        setIsLoading(false);
      })
      .catch(ex => {
        if (ex.response?.status === 404) {
          setTodos([]);
        } else {
          const error = errorHandler(ex);

          setNewErrMessage(error);
        }

        setIsLoading(false);
      });
  }, [token]);

  const logoutHandler = (event: React.FormEvent) => {
    event.preventDefault();

    props.removeToken();
    navigate('/login');
  };

  const closeHandler = () => {
    setErrMessage("");
    setMessage("");
  };

  useEffect(() => {
    const decodeToken = jwtDecode<Token["credential"]>(token);
    
    setCredential(decodeToken);
    todoFilterHandler(defaultFilter);
  }, [apiResponse, todoFilterHandler, defaultFilter, token]);

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">Todo List</h1>
        <div className="app-credential" onMouseLeave={() => setbtnActionState(false)}>
          <button className="app-credential-name button-icon" onClick={() => setbtnActionState(!btnActionState)}><IoPersonCircleOutline size={18} className="icon" /> {credential?.name}</button>
          { btnActionState && <div className='button-action'>
            <button className='button-icon button-item' onClick={() => navigate('/profile')}><IoPersonCircleSharp size={18} className='icon' /> Profile</button>
            <button className='button-icon button-item' onClick={logoutHandler}><IoPower size={18} className='icon' /> Logout</button>
          </div>}
        </div>
      </header>
      <SearchTodo onFilterTodo={todoFilterHandler} />
      <MessageBanner successMessage={message} errorMessage={errMessage} onCLose={closeHandler} />
      <TodoList
        isLoading={isLoading}
        defaultFilter={defaultFilter}
        items={todos}
        onDeleteTodo={todoDeleteHandler}
        onDoneTodo={todoDoneHandler}
        onFilterTodo={todoFilterHandler}
      />
    </div>
  );
}

export default Home;
