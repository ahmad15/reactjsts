import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { IoSaveOutline, IoArrowBack } from "react-icons/io5";
import isEmpty from 'lodash.isempty';

import LoadingSpinner from "./Loading.Spinner";
import File from './File';
import StatusSelect from './StatusSelect';
import Todo from '../models/todo.model';
import CONST from "../constants";

import '../styles/NewTodo.css'
import "react-datepicker/dist/react-datepicker.css";

type EditTodoProps = {
  item: Todo["detail"] | {};
  onEditTodo: (input: Todo["update"]) => void;
  isLoading?: boolean;
};

function EditTodo(props: EditTodoProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [idState, setIdState] = useState('');
  const [titleState, setTitleState] = useState('');
  const [descState, setDescState] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [statusState, setStatusState] = useState('');
  const [switchState, setSwitchState] = useState(false);
  const [snapshot, setSnapshot] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSnapshot(event.target.files[0]);
    }
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusState(e.target.value);

    if (e.target.value === CONST.STATUS.DONE) {
      setSwitchState(!switchState);
    }
  }

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const inputTodo = {
      id: idState,
      title: titleState,
      description: descState,
      deadline: startDate,
      snapshot: snapshot,
      status: statusState,
      done: switchState
    };

    props.onEditTodo(inputTodo);
  };

  useEffect(() => {
    setIsLoading(props.isLoading || false);

    'id' in props.item && setIdState(props.item.id);
    'title' in props.item && setTitleState(props.item.title);
    'description' in props.item && setDescState(props.item.description);
    'deadline' in props.item && setStartDate(new Date(props.item.deadline));
    'status' in props.item && setStatusState(props.item.status);

  }, [props.isLoading, props.item]);

  return (
    <form onSubmit={todoSubmitHandler} id="edit-todo-form" className="form-control">
      <div className="form-control">
        <label className="field-label" htmlFor="title">Title</label>
        <input type="text"
          required={true}
          value={titleState}
          id="title"
          readOnly={isLoading}
          maxLength={200}
          onChange={e => setTitleState(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="description">Description</label>
        <textarea id="description" required={true} readOnly={isLoading} maxLength={500} rows={3} value={descState} onChange={e => setDescState(e.target.value)} />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="deadline">Deadline</label>
        <DatePicker
          id="deadline"
          minDate={new Date()}
          selected={startDate}
          readOnly={isLoading}
          required={true}
          dateFormat='dd/MM/yyyy'
          onChange={date => setStartDate(date!)}
        />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="status">Status</label>
        <StatusSelect
          id="status"
          name="status"
          required={true}
          value={statusState}
          readOnly={isLoading}
          onChange={handleStatusChange}
        />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="snapshot">Snapshot</label>
        <File
          id="snapshot"
          acceptType="image/*"
          fileInfo={snapshot}
          required={false}
          readOnly={isLoading}
          onChange={handleFileChange}
        />
      </div>
      {isLoading ? <LoadingSpinner /> : 
      <div className="form-button">
        <button disabled={isEmpty(props.item) && true} type="submit"><IoSaveOutline size={18} className="icon" /> Save</button>
        <button onClick={() => navigate('/')}><IoArrowBack size={18} className="icon" /> Back</button>
      </div>}
    </form>
  );
}

export default EditTodo;