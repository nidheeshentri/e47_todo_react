import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const api_domain = "http://localhost:3001"

function App() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState("")
  const [count, setCount] = useState(0)
  const [editId, setEditId] = useState(false)
  const [editedTask, setEditedTask] = useState("")
  const [image, setImage] = useState("")
  const [images, setImages] = useState([])

  const getTask = () => {
    let token = localStorage.getItem("token")
    axios.get(api_domain, {
      headers: {
        Authorization: token
      }
    })
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
    let token = localStorage.getItem("token")

    if (token){
      axios.post(`${api_domain}/user/check-token`, {token})
      .then(res => {
        getTask()
      }).catch(()=>{
        navigate("/login")
      })

      axios.get(`${api_domain}/images`)
      .then(res =>{
        setImages(res.data.images)
      }).catch(err => {
        alert("Error on fetching images")
      })
    }else{
      navigate("/login")
    }
  }, [])

  const changeHandler = (e) => {
    setTaskInput(e.target.value)
  }

  const formSubmitHandler = (e) =>{
    e.preventDefault()
    let token= localStorage.getItem("token")
    axios.post(api_domain, {task: taskInput, token: token})
    .then(res => {
      console.log(res)
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

  const saveChanges = () => {
    axios.put(`http://localhost:3001/edit-task/${editId}`, {task: editedTask})
    .then(res => {
      setEditId(false)
      getTask()
    })
    .catch(err => {
      alert("Something went wrong")
    })
  }

  const fileSubmitHandler = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("image", image)
    axios.post(`${api_domain}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err.response.data)
    })
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      {images.map((img, index) => {
        return(
          <img src = {`${api_domain}${img.url}`} width={"300px"}/>
        )
      })}
      <form onSubmit = {fileSubmitHandler}>
        <input type = "file" name = "file" onChange={handleFileChange}/>
        <input type = "submit" value = "Submit" />
      </form>
      <h1>Todo app</h1>
      <h2>{count}</h2>
      <form onSubmit = {formSubmitHandler}>
        <input type = "text" placeholder='Enter task' value = {taskInput} onChange={changeHandler}/><br />
        <input type = "submit" value = "Add task" />
      </form>
      <ul>
        {tasks.map((task, index)=>{
          return(
            <li key = {index}>{editId == task._id
              ?<>
                <input type = "text" defaultValue={editedTask} onChange = {(e)=>setEditedTask(e.target.value)}/>
                <button onClick = {saveChanges}>Save</button>
              </>
              :<>
                {task.task}
                <button onClick={()=>{
                  setEditId(task._id)
                  setEditedTask(task.task)
                }}>Edit</button><button onClick = {()=>deleteTask(task.task)}>Delete</button>
              </>} </li>
          )
        })}
      </ul><p>{editId}</p>
    </>
  )
}

export default App
