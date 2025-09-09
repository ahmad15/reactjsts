import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { IoAdd, IoArrowBack } from "react-icons/io5";

import LoadingSpinner from "./Loading.Spinner";
import File from './File';
import Todo from '../models/todo.model';

import '../styles/NewTodo.css';
import "react-datepicker/dist/react-datepicker.css";

type NewTodoProps = {
  onAddTodo: (input: Todo["create"]) => void;
  isLoading?: boolean;
};

function NewTodo(props: NewTodoProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [snapshot, setSnapshot] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSnapshot(event.target.files[0]);
    }
  };

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    let inputTodo = {
      title: titleInputRef.current!.value,
      description: descInputRef.current!.value,
      snapshot: snapshot,
      deadline: startDate
    };

    setStartDate(new Date());
    titleInputRef.current!.value = '';
    descInputRef.current!.value = '';
    setSnapshot(null);

    props.onAddTodo(inputTodo);
  };

  useEffect(() => {
    setIsLoading(props.isLoading || false);
  }, [props.isLoading]);

  return (<section>
      <form onSubmit={todoSubmitHandler}>
        <div className="form-control">
          <h4>What needs to be done?</h4>
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="title">Title</label>
          <input type="text" required={true} id="title" maxLength={200} readOnly={isLoading} ref={titleInputRef} />
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="description">Description</label>
          <textarea id="description" required={true} maxLength={500}  readOnly={isLoading} ref={descInputRef} rows={3} />
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="deadline">Deadline</label>
          <DatePicker
            id="deadline"
            readOnly={isLoading}
            minDate={new Date()}
            selected={startDate}
            required={true}
            dateFormat='dd/MM/yyyy'
            onChange={date => date && setStartDate(date)}
          />
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="snapshot">Snapshot</label>
          <File
            id="snapshot"
            acceptType="image/*"
            fileInfo={snapshot}
            required={false}
            readonly={isLoading}
            onChange={handleFileChange}
          />
        </div>
        {isLoading ? <LoadingSpinner /> : 
          <div className="form-button">
            <button type="submit"><IoAdd size={18} className="icon" /> Add Todo</button>
            <button onClick={() => navigate('/')}><IoArrowBack size={18} className="icon" /> Back</button>
          </div>}
      </form>
    </section>
  );
}

export default NewTodo;