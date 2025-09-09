import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

import MessageBanner from '../components/MessageBanner';
import Modal from '../components/Modal';
import EditTodo from '../components/EditTodo';

import Todo from '../models/todo.model';

import TodoApi from "../api/todo";
import errorHandler from '../utils/error';

type UpdateTodoProps = {
  getToken: () => string;
}

function UpdateTodo(props: UpdateTodoProps) {
  const navigate = useNavigate();
  const { todoId } = useParams();
  const token = props.getToken();
  const [message, setMessage] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<boolean>(false);
  const [todo, setTodo] = useState<Todo["detail"] | {}>({});

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

  const onCloseModalHandler = () => {
    setModalState(false);
    setMessage("");
    setErrMessage("");
    navigate('/');
  };

  const todoEditHandler = (edit: Todo["update"]) => {
    setIsLoading(true);
    TodoApi.patchData(token, edit)
      .then(response => {
        setNewMessage(response.data.message);
        setIsLoading(false);
        setModalState(true);

        setTimeout(() => {
          onCloseModalHandler();
        }, 10000);
      })
      .catch(ex => {
        const error = errorHandler(ex);

        setNewErrMessage(error);
        setIsLoading(false);
      });
  };

  const getDetailTodo = React.useCallback((id: string | undefined) => {
    if (!id) {
      setNewErrMessage("Todo ID is missing.");
      return;
    }

    setIsLoading(true);
    TodoApi.getDetailData(token, id)
      .then(response => {
        setIsLoading(false);
        setTodo(response.data);
      })
      .catch(ex => {
        const error = errorHandler(ex);

        setNewErrMessage(error);
        setIsLoading(false);
      });
  }, [token]);

  const closeHandler = () => {
    setErrMessage("");
    setMessage("");
  };

  useEffect(() => {
    getDetailTodo(todoId);
  }, [getDetailTodo, todoId]);

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">
        <IoArrowBack onClick={() => navigate('/')} size={25} className="icon-header" /> Edit Todo
        </h1>
      </header>
      <MessageBanner errorMessage={errMessage} onCLose={closeHandler} />
      <EditTodo
        onEditTodo={todoEditHandler}
        isLoading={isLoading}
        item={todo}
      />
      <Modal
        id='success-modal'
        text={message}
        btnClose="Close"
        title="Edit Todo Success"
        isOpen={modalState}
        onClose={() => onCloseModalHandler()}
      />
    </div>
  );
}

export default UpdateTodo;
