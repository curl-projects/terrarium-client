import React from 'react';
import styles from './DeleteCardButton.module.css'
import { useMutation } from "@apollo/client"
import { ALL_TASKS, DELETE_TASK } from 'utility/graphql.js'

function DeleteCardButton(props){

  // mutation for deleting each card in the backend
  const [deleteTask, {data: deleteCardData,
                      loading: deleteCardLoading,
                      error: deleteCardError}] = useMutation(DELETE_TASK, {
                        refetchQueries: [{
                          query: ALL_TASKS
                        }]
                      })

  // deletes a card when the delete button is clicked
  function handleDeleteClick(e){
    deleteTask({variables: {
      id: e.target.attributes.cardid.nodeValue
    }})
  }


  return(
    <div className={styles.deleteCardWrapper}>
        <p className={styles.deleteCardIcon} cardid={props.item.id} onClick={handleDeleteClick}>✖</p>
    </div>
  )
}

export default DeleteCardButton;
