import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";

import Switch from './Switch';
import Todo from '../models/todo.model';

import '../styles/NewTodo.css'
import "react-datepicker/dist/react-datepicker.css";

type EditTodoProps = {
  item: Todo["detail"];
  onEditTodo: (input: Todo["detail"]) => void;
  onCancelEditTodo: (input: Todo["detail"]) => void;
};

function EditTodo(props: EditTodoProps) {
  const [titleState, setTitleState] = useState(props.item.title);
  const [descState, setDescState] = useState(props.item.description);
  const [startDate, setStartDate] = useState(new Date(props.item.deadline));
  const [switchState, setSwitchState] = useState(props.item.done);

  const onChangeDescHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setDescState(e.target.value);
  };

  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleState(e.target.value);
  };

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const inputTodo = {
      id: props.item.id,
      title: titleState,
      description: descState,
      deadline: startDate,
      done: switchState
    };

    props.onEditTodo(inputTodo);
  };

  const todoCancelHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const inputTodo = {
      id: props.item.id,
      title: props.item.title,
      description: props.item.description,
      deadline: props.item.deadline,
      done: props.item.done
    };

    props.onCancelEditTodo(inputTodo);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSwitchState(!switchState);
  }

  return (
    <form onSubmit={todoSubmitHandler}>
      <div className="form-control">
        <label htmlFor="edit-todo">Edit TODO</label>
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="desc">Title</label>
        <input type="text"
          required={true}
          value={titleState}
          id="title"
          maxLength={200}
          onChange={title => onChangeTitleHandler(title)}
        />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="description">Description</label>
        <input type="text"
          required={true}
          value={descState}
          id="description"
          maxLength={200}
          onChange={desc => onChangeDescHandler(desc)}
        />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="deadline">Deadline</label>
        <DatePicker
          minDate={new Date()}
          selected={startDate}
          required={true}
          dateFormat='dd/MM/yyyy'
          onChange={date => setStartDate(date!)}
        />
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="done">Done</label>
        <Switch
          id="switch-done"
          label=""
          isChecked={switchState}
          onChange={onChangeHandler}
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={todoCancelHandler}>Cancel</button>
    </form>
  );
}

export default EditTodo;