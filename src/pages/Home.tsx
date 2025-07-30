import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash.isempty';

import TodoList from '../components/TodoList';
import NewTodo from '../components/NewTodo';
import EditTodo from '../components/EditTodo';

import Todo from '../models/todo.model';
import TodoApi from "../api/todo";

type HomeProps = {
  removeToken: () => void;
  getToken: () => string;
}

function Home(props: HomeProps) {
  const navigate = useNavigate();
  const token = props.getToken();
  const [apiResponse, setApiResponse] = useState(false);
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<Todo["detail"][]>([]);
  const [todoEdit, setTodoEdit] = useState<Todo["update"] | {}>();
  
  const todoAddHandler = (input: Todo["create"]) => {
    setIsLoading(true);
    TodoApi.postData(token, input)
      .then(response => {
        setApiResponse(!apiResponse);
        setMessage(response.data.message);
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
              : "An unexpected error has occurred";

          setErrMessage(error);
          setIsLoading(false);
      });
  };

  const todoDoneHandler = (id: string) => {
    let todo = todos.filter(todo => todo.id === id);
    todo[0].done =!todo[0].done;

    setIsLoading(true);
    TodoApi.patchData(token, todo[0])
      .then(response => {
        setApiResponse(!apiResponse);
        setMessage(response.data.message);
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
              : "An unexpected error has occurred";

          setErrMessage(error);
          setIsLoading(false);
      });
  };

  const todoEditHandler = (id: string) => {
    const todo = todos.filter(todo => todo.id === id);
    
    setTodoEdit(todo[0]);
    // remove item from state [temporary]
    setTodos(todos => { 
      return todos.filter(todo => todo.id !== id);
    });
  };

  const todoCancelEditHandler = (input: Todo["detail"]) => {
    // restore item back to original state
    setTodos([...todos, {
      id: input.id,
      title: input.title,
      description: input.description,
      deadline: input.deadline,
      done: input.done
    }]);
    setTodoEdit({});
  };

  const todoSubmitEditHandler = (edit: Todo["detail"]) => {
    setIsLoading(true);
    TodoApi.patchData(token, edit)
      .then(response => {
        setApiResponse(!apiResponse);
        setMessage(response.data.message);
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
              : "An unexpected error has occurred";

          setErrMessage(error);
          setIsLoading(false);
      });

    setTodoEdit({});
  };

  const todoDeleteHandler = (id: string) => {
    setIsLoading(true);
    TodoApi.deleteData(token, id)
      .then(response => {
        setApiResponse(!apiResponse);
        setMessage(response.data.message);
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
              : "An unexpected error has occurred";

          setErrMessage(error);
          setIsLoading(false);
      });
  };

  const todoSortHandler = (sort: string) => {
    setIsLoading(true);
    TodoApi.getData(token, `sort=${sort}`)
      .then(response => {
        setTodos(response.data);
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
            : ex.response.status === 404
              ? "Resource not found"
              : "An unexpected error has occurred";
          
          setErrMessage(error);
          setIsLoading(false);
      });
  };

  const logoutHandler = (event: React.FormEvent) => {
    event.preventDefault();

    props.removeToken();
    navigate('/login');
  };

  const closeHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setErrMessage("");
    setMessage("");
  };

  useEffect(() => {
    setIsLoading(true);
    TodoApi.getData(token, 'sort=asc')
      .then(response => {
        setTodos(response.data);
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
            : ex.response.status === 404
              ? "Resource not found"
              : "An unexpected error has occurred";

          setErrMessage(error);
          setIsLoading(false);
      });
  }, [apiResponse, token]);

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">Todo List</h1>
        <button type='button' className='btn-logout' onClick={logoutHandler}>Logout</button>
      </header>
      { isEmpty(todoEdit) ?
        <NewTodo onAddTodo={todoAddHandler} /> :
        <EditTodo
          item={todoEdit}
          onEditTodo={todoSubmitEditHandler}
          onCancelEditTodo={todoCancelEditHandler}
        />
      }
      { !isEmpty(message) ? <div className="success-message">
          {message}
          <button type='button' className='btn-logout' onClick={closeHandler}>x</button>
        </div> : !isEmpty(errMessage) ? <div className="error-message">
          {errMessage}
          <button type='button' className='btn-logout' onClick={closeHandler}>x</button>
        </div> : null }
      <TodoList
        isLoading={isLoading}
        items={todos}
        onDeleteTodo={todoDeleteHandler}
        onEditTodo={todoEditHandler}
        onDoneTodo={todoDoneHandler}
        onSortTodo={todoSortHandler}
      />
    </div>
  );
}

export default Home;
