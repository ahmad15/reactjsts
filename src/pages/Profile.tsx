import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { IoArrowBack, IoSaveOutline } from "react-icons/io5";

import MessageBanner from '../components/MessageBanner';
import Modal from '../components/Modal';
import LoadingSpinner from "../components/Loading.Spinner";

import Token from '../models/token.model';
import User from '../models/user.model';

import UserApi from "../api/user";
import errorHandler from '../utils/error';

import '../styles/Profile.css';
import isEmpty from 'lodash.isempty';

type ProfileProps = {
  getToken: () => string;
  setToken: (input: User["authResponse"]) => void;
}

function Profile(props: ProfileProps) {
  const navigate = useNavigate();
  const token = props.getToken();
  const [idState, setIdState] = useState<string>("");
  const [nameState, setNameState] = useState<string>("");
  const [emailState, setEmailState] = useState<string>("");
  const [oldPasswordState, setOldPasswordState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [rePasswordState, setRePasswordState] = useState<string>("");
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
  
  const getDetailProfile = React.useCallback((id: string) => {
    setIsLoading(true);
    UserApi.getDetailData(token, id)
      .then(response => {
        setIdState(response.data.id)
        setNameState(response.data.name)
        setEmailState(response.data.email)
        setIsLoading(false);
      })
      .catch(ex => {
        const error = errorHandler(ex);

        setNewErrMessage(error);
        setIsLoading(false);
      });
  }, [token]);

  const profileEditHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (passwordState !== rePasswordState) {
      setNewErrMessage('Password does not match with Re-type Password');
      setIsLoading(false);

      return;
    }

    let edit = {
      id: idState,
      email: emailState,
      name: nameState
    } as User['detail'];

    if (!isEmpty(passwordState) && !isEmpty(oldPasswordState)) {
      edit = {
        ...edit,
        oldPassword: oldPasswordState,
        password: passwordState
      };
    }

    UserApi.patchProfileData(token, edit)
      .then(response => {
        setNewMessage(response.data.message);
        props.setToken({ tokenId: response.data.tokenId });

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

  useEffect(() => {
    const decodeToken = jwtDecode<Token["credential"]>(token);

    getDetailProfile(decodeToken.id);
  }, [getDetailProfile, token]);

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">
        <IoArrowBack onClick={() => navigate('/')} size={25} className="icon-header" /> Profile
        </h1>
      </header>
      <MessageBanner errorMessage={errMessage} onCLose={closeHandler} />
      <section>
        <form onSubmit={profileEditHandler}>
          <div className="form-control">
            <label className="field-label" htmlFor="name">Name</label>
            <input type="text" required={true} id="name" maxLength={200} readOnly={isLoading} autoComplete="on" value={nameState} onChange={e => setNameState(e.target.value)} />
          </div>
          <div className="form-control">
            <label className="field-label" htmlFor="email">Email</label>
            <input type="email" required={true} id="email" maxLength={200} readOnly={isLoading} autoComplete="on" value={emailState} onChange={e => setEmailState(e.target.value)} />
          </div>
          <div className='update-title'>Update Password</div>
          <div className='change-password' id='update-password'>
            <div className="form-control">
              <label className="field-label" htmlFor="old-password">Old Password</label>
              <input type="password" id="old-password" readOnly={isLoading} value={oldPasswordState} onChange={e => setOldPasswordState(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="field-label" htmlFor="password">Password</label>
              <input type="password" id="password" readOnly={isLoading} value={passwordState} onChange={e => setPasswordState(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="field-label" htmlFor="repassword">Re-type Password</label>
              <input type="password" id="repassword" readOnly={isLoading} value={rePasswordState} onChange={e => setRePasswordState(e.target.value)} />
            </div>
          </div>
          {isLoading ? <LoadingSpinner /> : 
            <div className="form-button">
              <button type="submit"><IoSaveOutline size={18} className="icon" /> Save</button>
              <button onClick={() => navigate('/')}><IoArrowBack size={18} className="icon" /> Back</button>
            </div>}
        </form>
      </section>
      <Modal
        id='success-modal'
        text={message}
        btnClose="Close"
        title="Update Profile Success"
        isOpen={modalState}
        onClose={() => onCloseModalHandler()}
      />
    </div>
  );
}

export default Profile;
