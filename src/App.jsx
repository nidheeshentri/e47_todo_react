import { useEffect, useState } from 'react'
import axios from 'axios'
const api_domain = "http://localhost:3001"

function App() {
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState("")
  const [count, setCount] = useState(0)

  const getTask = () => {
    axios.get(api_domain)
    .then(res => {
      console.log(res.data)
      setTasks(res.data.taskItems)
      setCount(res.data.count)
    })
    .catch(err => {
      console.log("Error")
    })
  }

  useEffect(()=>{
    getTask()
  }, [])

  const changeHandler = (e) => {
    setTaskInput(e.target.value)
  }

  const formSubmitHandler = (e) =>{
    e.preventDefault()
    axios.post(api_domain, {task: taskInput})
    .then(res => {
      setTaskInput("")
      getTask()
    })
    .catch(()=>{
      console.log("Error")
    })
    console.log(taskInput)
  }
  const deleteTask = (index) => {
    axios.delete(`${api_domain}/task/${index}`)
    .then(res => {
      getTask()
    })
    .catch(err => {
      alert(err.response.data.message)
    })
  }

  return (
    <>
      <h1>Todo app</h1>
      <h2>{count}</h2>
      <form onSubmit = {formSubmitHandler}>
        <input type = "text" placeholder='Enter task' value = {taskInput} onChange={changeHandler}/><br />
        <input type = "submit" value = "Add task" />
      </form>
      <ul>
        {tasks.map((task, index)=>{
          return(
            <li key = {index}>{task.task} - {task._id} <button>Edit</button><button onClick = {()=>deleteTask(task.task)}>Delete</button></li>
          )
        })}
      </ul>
    </>
  )
}

export default App
