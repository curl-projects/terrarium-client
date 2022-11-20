import React, {useState} from 'react';
import styles from './CreateCardButton.module.css'
import { useMutation, gql } from "@apollo/client"
import { ALL_TASKS, CREATE_TASK } from 'utility/graphql.js'

function CreateCardButton(){
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [createTask, {data, error, loading}] = useMutation(CREATE_TASK, {
    refetchQueries: [
      {query: ALL_TASKS}
    ]
  })

  function handleTitleChange(e){
    setTitle(e.target.value)
  }

  function handleDescriptionChange(e){
    setDescription(e.target.value)
  }

  function handleClick(){
    createTask({variables: {
      title: title,
      description: description,
    }})
    setTitle("")
    setDescription("")
  }

  return(
    <div className={styles.createWrapper}>
    <div className={styles.inputWrapper}>
      <input type='text' placeholder="Title" className={styles.input} value={title} onChange={handleTitleChange} />
      <input type='text' placeholder="Description" className={styles.input} value={description} onChange={handleDescriptionChange} />
      <div className={styles.buttonWrapper} onClick={handleClick}>
        <p className={styles.buttonText}>Add new task</p>
    </div>
    </div>
    </div>
  )
}

export default CreateCardButton
