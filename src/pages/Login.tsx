import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import CONST from "../constants";
import UserApi from "../api/user";
import LoadingSpinner from "../components/Loading.Spinner";

import User from "../models/user.model";

import '../styles/NewTodo.css';
import isEmpty from "lodash.isempty";

type LoginProps = {
  setToken: (input: User["authResponse"]) => void;
}

function Login(props: LoginProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);

  const onLoginHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const input = {
      email: emailInputRef.current!.value,
      password: passInputRef.current!.value
    };

    setErrMessage('');
    setIsLoading(true);
    UserApi.auth(input)
      .then(response => {
        if(response.status === CONST.RESPONSE.SUCCESS) {
          props.setToken(response.data);
          navigate("/");
        }
        setIsLoading(false);
      })
      .catch(ex => {
        const error =
            ex.code === "ECONNABORTED"
            ? "A timeout has occurred"
            : ex.response.status === 401
              ? "Email or Password is not valid"
              : "An unexpected error has occurred";

          setErrMessage(error);
          setIsLoading(false);
          console.log('Error: ' + error);
      });
  }

  return (
    <div>
      <form onSubmit={onLoginHandler}>
        <div className="form-control">
          <label htmlFor="new-todo">Login</label>
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="email">Email</label>
          <input type="text" required={true} id="email" ref={emailInputRef} />
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="password">Password</label>
          <input type="password" required={true} id="password" ref={passInputRef} />
        </div>
        { isLoading ? <LoadingSpinner /> : <button type="submit">Log In</button> }
      </form>
      { !isEmpty(errMessage) ? <div className="error-message">
        {errMessage}
      </div> : null }
    </div>
  );
}

export default Login;