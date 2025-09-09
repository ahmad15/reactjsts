import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { IoAdd, IoSearch, IoRefresh } from "react-icons/io5";

import '../styles/NewTodo.css';
import "react-datepicker/dist/react-datepicker.css";

type SearchTodoProps = {
  onFilterTodo: (query: string) => void;
};

function SearchTodo(props: SearchTodoProps) {
  const navigate = useNavigate();
  const filterInputRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const isFilterEmpty = () => {
    return !filterInputRef.current?.value && !startDate && !endDate;
  };

  const filterClearHandler = (event: React.FormEvent) => {
    event.preventDefault();

    filterInputRef.current!.value = '';
    setStartDate(null);
    setEndDate(null);
    props.onFilterTodo('');
  };

  const keyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      filterSubmitHandler(event);
    }
  };

  const filterSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const filter = filterInputRef.current!.value;
    let query = `content=${encodeURIComponent(filter)}`;
    query = startDate ? `${query}&deadlineFrom=${startDate.toISOString()}` : query;
    query = endDate ? `${query}&deadlineTo=${endDate.toISOString()}` : query;

    props.onFilterTodo(query);
  };

  return (<section>
      <form onKeyDown={keyDownHandler}>
        <div className="form-control">
          <h4>Search Todo</h4>
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="filter">Title or Description</label>
          <input type="filter" id="filter" maxLength={200} ref={filterInputRef} />
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="deadline-from">Deadline From</label>
          <DatePicker
            id="deadline-from"
            selected={startDate}
            required={false}
            dateFormat='dd/MM/yyyy'
            onChange={date => date && setStartDate(date)}
          />
        </div>
        <div className="form-control">
          <label className="field-label" htmlFor="deadline-to">Deadline To</label>
          <DatePicker
            id="deadline-to"
            selected={endDate}
            required={false}
            dateFormat='dd/MM/yyyy'
            onChange={date => date && setEndDate(date)}
          />
        </div>
        <div className="form-button form-control">
          <button onClick={(e) => filterSubmitHandler(e)}><IoSearch size={18} className="icon" /> Search</button>
          {!isFilterEmpty() &&
            <button onClick={(e) => filterClearHandler(e)}><IoRefresh size={18} className="icon" /> Clear</button>}
          <button onClick={() => navigate('/add-todo')}><IoAdd size={18} className="icon" /> Add Todo</button>
        </div>
      </form>
    </section>
  );
}

export default SearchTodo;