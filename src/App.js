import React from 'react';
import './App.css';
import {createEvent, createStore, createStoreObject} from 'effector'
import {createComponent, useStore} from 'effector-react'

const addTodo = createEvent('add-todo');
const removeTodo = createEvent('remove-todo');
const addTodoTitle = createEvent('add-todo-title');

const todos = createStore([])
  .on(addTodo, (state, todo) => [...state, todo])
  .on(removeTodo, (state, id) => [...state.filter(todo => todo.id !== id)]);

const title = createStore('')
  .on(addTodoTitle, (_, value) => value);

const data = createStoreObject({todos, title});

addTodo.watch((todo, eventName) => {
  console.log(eventName);
  console.log(todo);
});
removeTodo.watch((todo, eventName) => {
  console.log(eventName);
  console.log(todo);
});
addTodoTitle.watch((value, eventName) => {
  console.log(eventName);
  console.log(value);
});


const TodoList = () => {
  const {todos} = useStore(data);
  return (
    todos.map(todo => (
        <div className={'todo'} key={todo.id}>
          <button className={'remove-todo'} onClick={() => removeTodo(todo.id)}>X</button>
          {todo.title}
        </div>
      )
    )
  )
};

const getId = () => Math.round(Math.random() * 10000000);

const changeValue = (e) => {
  addTodoTitle(e.target.value);
}
const handlerAddTodo = (title) => {
  if (title.trim() === '') {
    return;
  }
  addTodo({ title, id: getId() });
  addTodoTitle('');
}

function App() {
  const {title} = useStore(data);
  return (
    <div className="App">
      <header className="App-header">
          Effector Todo
      </header>
      <div>
        <input type="text" onChange={changeValue} value={title}/>
        <button onClick={() => handlerAddTodo(title)}>+</button>
      </div>
      <TodoList />
    </div>
  );
};

export default App;
