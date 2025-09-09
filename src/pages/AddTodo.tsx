import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

import MessageBanner from '../components/MessageBanner';
import Modal from '../components/Modal';
import NewTodo from '../components/NewTodo';

import Todo from '../models/todo.model';

import TodoApi from "../api/todo";
import errorHandler from '../utils/error';

type AddTodoProps = {
  getToken: () => string;
}

function AddTodo(props: AddTodoProps) {
  const navigate = useNavigate();
  const token = props.getToken();
  const [message, setMessage] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<boolean>(false);

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
  
  const todoAddHandler = (input: Todo["create"]) => {
    setIsLoading(true);
    TodoApi.postData(token, input)
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

  const closeHandler = () => {
    setErrMessage("");
    setMessage("");
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">
        <IoArrowBack onClick={() => navigate('/')} size={25} className="icon-header" /> Add Todo
        </h1>
      </header>
      <MessageBanner errorMessage={errMessage} onCLose={closeHandler} />
      <NewTodo
        onAddTodo={todoAddHandler}
        isLoading={isLoading}
      />
      <Modal
        id='success-modal'
        text={message}
        btnClose="Close"
        title="Add Todo Success"
        isOpen={modalState}
        onClose={() => onCloseModalHandler()}
      />
    </div>
  );
}

export default AddTodo;
