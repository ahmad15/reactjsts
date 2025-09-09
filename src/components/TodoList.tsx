import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash.isempty';

import LoadingSpinner from "./Loading.Spinner";
import Modal from "./Modal";
import StatusSelect from './StatusSelect';

import Todo from '../models/todo.model';

import '../styles/TodoList.css';
import listImg from "../assets/list-item.png";
import CONST from "../constants";
import { IoArrowDown, IoArrowUp, IoCheckmark, IoEllipsisHorizontal } from "react-icons/io5";

interface TodoListProps {
  isLoading: boolean,
  defaultFilter: string,
  items: Todo["detail"][];
  onDeleteTodo: (id: string) => void;
  onDoneTodo: (id: string, status: string | null) => void;
  onFilterTodo: (query: string) => void;
}

function isTemplateSpan(items: Todo["detail"][]): boolean {
  // Checks if every item has a 'status' property (basic validation)
  return Array.isArray(items) && items.every(item => typeof item.status === 'string');
}

function TodoList (props: TodoListProps) {
  const BASE_URL = process.env.REACT_APP_API_URI;

  const navigate = useNavigate();
  const [sortState, setSortState] = useState(false);
  const [btnActionState, setbtnActionState] = useState<boolean[]>([]);
  const [modalState, setModalState] = useState({show: false, id: ""});
  const [statusState, setStatusState] = useState<string[]>([]);
  const [statusFilterState, setStatusFilterState] = useState<string[]>([]);
  const [queryState, setQueryState] = useState<string>(props.defaultFilter);

  const onBtnActionHandler = (index: number, show: boolean) => {
    btnActionState[index] = show;
    setbtnActionState([...btnActionState]);
  };

  const onSortHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setSortState(!sortState);
    
    const sortString = (sortState) ? 'asc' : 'desc';
    const query = queryState.includes('sort=') ? queryState.replace(/sort=[^&]*/, `sort=${sortString}`) : `${queryState}&sort=${sortString}`;

    setQueryState(query);
    props.onFilterTodo(query);
  }

  const onFilterHandler = (event: React.FormEvent, status: string) => {
    event.preventDefault();
    let statusFilter;

    if (statusFilterState.includes(status)) {
      statusFilter = statusFilterState.filter(item => item !== status);
      setStatusFilterState(statusFilter);
    } else {
      statusFilter = [...statusFilterState, status];
      setStatusFilterState(statusFilter);
    }

    const query =  queryState.includes('status=') ? queryState.replace(/status=[^&]*/, `status=${statusFilter.join(',')}`) : `${queryState}&status=${statusFilter.join(',')}`;

    setQueryState(query);
    props.onFilterTodo(query);
  }

  const onStatusHandler = (e: ChangeEvent<HTMLSelectElement>, index: number, id: string) => {
    statusState[index] = e.target.value;
    setStatusState([...statusState]);
    props.onDoneTodo(id, e.target.value);
  };

  const onDeleteHandler = (id: string) => {
    setModalState({show: false, id: ""});
    props.onDeleteTodo(id);
  };

  const setContentClassName = (todo: Todo["detail"]) => {
    if (todo.done) {
      return 'done';
    }

    switch (todo.status) {
      case CONST.STATUS.IN_PROGRESS:
        return 'in-progress';
      case CONST.STATUS.ON_HOLD:
        return 'on-hold';
      case CONST.STATUS.DONE:
        return 'done';
      default:
        return '';
    }
  };

  const setFilterActiveClass = (status: string) => {
    return statusFilterState.includes(status) ? 'active' : '';
  };

  const setIconFilterActive = (status: string) => {
    return statusFilterState.includes(status) ? <IoCheckmark size={15} className="icon" /> : '';
  };

  useEffect(() => {
    const statusFilter = props.defaultFilter.split('&')[1].replace('status=', '');
    const sortFilter = props.defaultFilter.split('&')[0].replace('sort=', '') === 'asc' ? true : false;
    const statusFilters = statusFilter.split(',');
    const statusItems = isTemplateSpan(props.items) ? props.items.map(item => item.status) : [];

    setStatusState(statusItems);
    setStatusFilterState(statusFilters);
    setSortState(sortFilter);
  }, [props.items, props.defaultFilter]);

  return (
    <div className="content-list">
      { props.isLoading ? <LoadingSpinner /> :
        <div>
          <div className='sort'>
            <div className="button-group">
              <button onClick={onSortHandler}>Deadline {sortState ? <IoArrowUp size={15} className="icon" /> : <IoArrowDown size={15} className="icon" />}</button>
              <button className={setFilterActiveClass(CONST.STATUS.DONE)} onClick={(e) => onFilterHandler(e, CONST.STATUS.DONE)}>Done {setIconFilterActive(CONST.STATUS.DONE)}</button>
              <button className={setFilterActiveClass(CONST.STATUS.ON_HOLD)} onClick={(e) => onFilterHandler(e, CONST.STATUS.ON_HOLD)}>On Hold {setIconFilterActive(CONST.STATUS.ON_HOLD)}</button>
              <button className={setFilterActiveClass(CONST.STATUS.IN_PROGRESS)} onClick={(e) => onFilterHandler(e, CONST.STATUS.IN_PROGRESS)}>In Progress {setIconFilterActive(CONST.STATUS.IN_PROGRESS)}</button>
              <button className={setFilterActiveClass(CONST.STATUS.TODO)} onClick={(e) => onFilterHandler(e, CONST.STATUS.TODO)}>Todo {setIconFilterActive(CONST.STATUS.TODO)}</button>
            </div>
          </div>
          <ul>
            { !isEmpty(props.items) ? props.items.map((todo, index) =>
              <li className={setContentClassName(todo)} key={todo.id}>
                <div className="todo-snapshot">
                  { todo.snapshotpath ? <img src={BASE_URL+"/"+todo.snapshotpath} alt={todo.title} /> : <img src={listImg} alt={todo.title} /> }
                </div>
                <div className='content'>
                  <h4>{todo.title.toUpperCase()}</h4>
                  <p>{todo.description}</p>
                  <span>Deadline: [ {new Date(todo.deadline).toDateString()} ]</span><br></br>
                  <span>Updated: [ {todo?.updated && new Date(todo.updated).toDateString()} ]</span>
                </div>
                <div className='menu-action' onMouseLeave={() => onBtnActionHandler(index, false)}>
                  <button className="button-icon" onClick={() => onBtnActionHandler(index, !btnActionState[index])}><IoEllipsisHorizontal size={15} /></button>
                  {btnActionState[index] && <div className='button-action'>
                    { !todo.done ? <StatusSelect
                        id={todo.id}
                        name="status"
                        required={true}
                        value={statusState[index]}
                        onChange={(e) => onStatusHandler(e, index, todo.id)}
                      /> : <button onClick={() => props.onDoneTodo(todo.id, null)}>Reopen</button> }
                    { !todo.done && <button onClick={() => navigate(`/edit-todo/${todo.id}`)}>Edit</button> }
                    <button onClick={() => setModalState({show: true, id: todo.id})}>Delete</button>
                  </div>}
                </div>
              </li>) :
              <li className="no-data">No todos available</li>
            }
          </ul>
        </div> 
      }
      <Modal
        id="modal-delete"
        text="Are you sure you want to delete this todo?"
        btnOK="Yes"
        btnClose="No"
        title="Delete Confirmation"
        isOpen={modalState.show}
        onProsess={() => onDeleteHandler(modalState.id)}
        onClose={() => setModalState({show: false, id: ""})}
      />
    </div>
  );
}

export default TodoList;