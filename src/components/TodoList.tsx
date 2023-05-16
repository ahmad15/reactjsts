import { useState } from "react";
import isEmpty from 'lodash.isempty';

import LoadingSpinner from "./Loading.Spinner";

import Todo from '../models/todo.model';

import '../styles/TodoList.css';

interface TodoListProps {
  isLoading: boolean,
  items: Todo["detail"][];
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string) => void;
  onDoneTodo: (id: string) => void;
  onSortTodo: (sort: string) => void;
}

function TodoList (props: TodoListProps) {
  const [sortState, setSortState] = useState(false);

  const onSortHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setSortState(!sortState);
    
    const sortString = (sortState) ? 'asc' : 'desc';
    props.onSortTodo(sortString);
  }

  return (
    <div className="content-list">
      { props.isLoading ? <LoadingSpinner /> :
        <div>
          <div className='sort'>
            { !isEmpty(props.items) ? <button onClick={onSortHandler}>Sort by Deadline</button> : null }
          </div>
          <ul>
            { props.items.map(todo =>
              <li className={ todo.done ? 'done' : ''} key={todo.id}>
                <div className='content'>
                  <h4>{todo.title}</h4>
                  <p>{todo.description}</p>
                  <span>Deadline: [ {new Date(todo.deadline).toDateString()} ]</span>
                </div>
                <div className='button-action'>
                  { !todo.done ? <button onClick={() => props.onDoneTodo(todo.id)}>Done</button> : null }
                  <button onClick={() => props.onEditTodo(todo.id)}>Edit</button>
                  <button onClick={() => props.onDeleteTodo(todo.id)}>Delete</button>
                </div>
              </li>)
            }
          </ul>
        </div> 
      }
    </div>
  );
}

export default TodoList;