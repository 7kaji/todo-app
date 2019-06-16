import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'

interface ITodo {
  id: number
  title: string
  done: boolean
  // created_at: string
  // updated_at: string
}

function Todos(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('')
  const [todos, setTodos] = useState<ITodo[]>([])

  useEffect(
    () => {
      getTodos()
    }, []
  )

  const getTodos = async() => {
    await axios.get('/api/v1/todos')
    .then(response => {
      setTodos(response.data)
    })
    .catch(error => console.log(error))
  }

  const createTodo = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && !(inputValue === '')) {
      axios.post('/api/v1/todos', {todo: {title: inputValue}})
      .then(response => {
        setTodos([response.data, ...todos])
        setInputValue('')
      })
      .catch(error => console.log(error))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value)
  }

  const updateTodo = (e: React.ChangeEvent<HTMLInputElement>, id: number): void => {
    axios.put(`/api/v1/todos/${id}`, {todo: {done: e.target.checked}})
    .then(response => {
      const todoIndex = todos.findIndex(x => x.id === response.data.id)
      setTodos([...todos.slice(0, todoIndex), response.data, ...todos.slice(todoIndex + 1)])
    })
    .catch(error => console.log(error))
  }

  const deleteTodo = (id: number): void => {
    axios.delete(`/api/v1/todos/${id}`)
    .then(response => {
      const todoIndex = todos.findIndex(x => x.id === id)
      setTodos([...todos.slice(0, todoIndex), ...todos.slice(todoIndex + 1)])
    })
    .catch(error => console.log(error))
  }

  return (
    <Fragment>
      <div className="inputContainer">
        <input className="taskInput" type="text"
          placeholder="Add a task"
          onKeyPress={createTodo}
          value={inputValue}
          onChange={handleChange}
        />
      </div>
      <div className="listWrapper">
        <ul className="taskList">
          {todos.map((todo) => {
            return(
              <li className="task" key={todo.id}>
                <input className="taskCheckbox" type="checkbox"
                  checked={todo.done}
                  onChange={(e) => updateTodo(e, todo.id)}
                />
                <label className="taskLabel">{todo.title}</label>
                <span className="deleteTaskBtn"
                  onClick={(e) => deleteTodo(todo.id)}
                >
                  x
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </Fragment>
  )
}

export default Todos
