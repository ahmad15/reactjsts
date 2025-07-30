import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";

import Todo from '../models/todo.model';

import '../styles/NewTodo.css';
import "react-datepicker/dist/react-datepicker.css";

type NewTodoProps = {
  onAddTodo: (input: Todo["create"]) => void;
};

function NewTodo(props: NewTodoProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState(new Date());

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const inputTodo = {
      title: titleInputRef.current!.value,
      description: descInputRef.current!.value,
      deadline: startDate
    };

    setStartDate(new Date());
    titleInputRef.current!.value = '';
    descInputRef.current!.value = '';

    props.onAddTodo(inputTodo);
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div className="form-control">
        <label htmlFor="new-todo">What needs to be done?</label>
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="title">Title</label>
        <input type="text" required={true} id="title" maxLength={200} ref={titleInputRef} />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="description">Description</label>
        <input type="text" required={true} id="description" maxLength={500} ref={descInputRef} />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="deadline">Deadline</label>
        <DatePicker
          minDate={new Date()}
          selected={startDate}
          required={true}
          dateFormat='dd/MM/yyyy'
          onChange={date => date && setStartDate(date)}
        />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default NewTodo;