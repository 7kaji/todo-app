import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import parse from 'parse-link-header'
import queryString from 'query-string'

interface ITodo {
  id: number
  title: string
  done: boolean
  // created_at: string
  // updated_at: string
}

interface IPage {
  page: string
  rel: string
  url: string
}

function Todos(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('')
  const [todos, setTodos] = useState<ITodo[]>([])
  const [currentPage, setCurrentPage] = useState<string>('1')
  const [prevPage, setPrevPage] = useState<IPage>({page: '0', rel: '', url: ''})
  const [nextPage, setNextPage] = useState<IPage>({page: '-1', rel: '', url: ''})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)

  useEffect(
    () => {
      const parsedHash = queryString.parse(window.location.search)
      getTodos(String(parsedHash.page))
    }, []
  )

  const getTodos = async(page: string) => {
    const stringified = queryString.stringify({page})
    const pageParamsString = (page === '1') ? '' : `?${stringified}`
    await axios.get(`/api/v1/todos${pageParamsString}`)
    .then(response => {
      const parsedLinkHeaders = parse(response.headers.link) || {}

      // pagination
      if (parsedLinkHeaders.prev) {
        const prev = parsedLinkHeaders.prev
        setPrevPage({page: prev.page, rel: prev.rel, url: prev.url})
      } else {
        setPrevPage({page: '0', rel: '', url: ''})
      }
      if (parsedLinkHeaders.next) {
        const next = parsedLinkHeaders.next
        setNextPage({page: next.page, rel: next.rel, url: next.url})
      } else {
        setNextPage({page: '-1', rel: '', url: ''})
      }
      setCurrentPage(response.headers['x-page'])
      setTotalCount(response.headers['x-total'])
      setTotalPage(Math.floor((Number(response.headers['x-total']) + Number(response.headers['x-per-page'])) / response.headers['x-per-page']))

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

  const handlePage = (page: string): void => {
    setCurrentPage(page)
    getTodos(page)
    window.history.pushState(null, `$Todos:${page}目`, `/?page=${page}`)
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
      <div className="header">
        <h1>Todo List</h1>
      </div>
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
      <div className="pagination">
        { currentPage !== '1' && <button onClick={() => handlePage(prevPage.page)}>prev</button> }
        <span>{ currentPage } of { totalPage }</span>
        { nextPage.page !== '-1' && <button onClick={() => handlePage(nextPage.page)}>next</button> }
      </div>
    </Fragment>
  )
}

export default Todos
