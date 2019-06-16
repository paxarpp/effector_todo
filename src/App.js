import React from 'react';
import './App.css';
import {createEvent, createStore, createStoreObject} from 'effector'
import {createComponent, useStore} from 'effector-react'

const addTodo = createEvent('add-todo');
const removeTodo = createEvent('remove-todo');
const addTodoTitle = createEvent('add-todo-title');
const toggleComplit = createEvent('toggle-complit');
const setFilter = createEvent('set-filter');

const todos = createStore([])
  .on(addTodo, (state, todo) => [...state, todo])
  .on(removeTodo, (state, id) => [...state.filter(todo => todo.id !== id)])
  .on(toggleComplit, (state, id) => [...state.map(todo => {
    if (todo.id === id) {
      todo.complite = !todo.complite;
    }
    return todo;
  })]);

const title = createStore('')
  .on(addTodoTitle, (_, value) => value);

const filter = createStore('all')
  .on(setFilter, (_, value) => value);

const data = createStoreObject({todos, title, filter});

const logging = (value, eventName) => {
  console.log(eventName);
  console.log(value);
};
addTodo.watch(logging);
removeTodo.watch(logging);
addTodoTitle.watch(logging);
toggleComplit.watch(logging);
setFilter.watch(logging);


const TodoList = () => {
  const {todos, filter} = useStore(data);
  const todosTemp = filter === 'all' ?
    [...todos] : filter === 'not' ?
      todos.filter( todo => !todo.complite) : todos.filter( todo => todo.complite);
  return (
    todosTemp.map(todo => (
        <div className={'todo'} key={todo.id} onClick={() => toggleComplit(todo.id)}>
          <button className={'remove-todo'} onClick={() => removeTodo(todo.id)}>X</button>
          <span className={todo.complite ? 'complite' : ''}>{todo.title}</span>
        </div>
      )
    )
  )
};

const getId = () => Date.now();

const changeValue = (e) => {
  addTodoTitle(e.target.value);
}
const handlerAddTodo = (title) => {
  if (title.trim() === '') {
    return;
  }
  addTodo({ title, id: getId(), complite: false });
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
        <button onClick={() => handlerAddTodo(title)}>add</button>
      </div>
      <button onClick={() => setFilter('all')}>all</button>
      <button onClick={() => setFilter('complite')}>complite</button>
      <button onClick={() => setFilter('not')}>notcompite</button>
      <TodoList />
    </div>
  );
};

export default App;
