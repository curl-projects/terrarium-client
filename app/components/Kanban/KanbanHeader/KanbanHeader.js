import React from 'react';
import styles from './KanbanHeader.module.css'
import CreateCardButton from '../CreateCardButton/CreateCardButton.js'

function KanbanHeader(){

  return(
    <div className={styles.kanbanHeader}>
    <div className={styles.kanbanTitle}>
      <div className={styles.titleIcon}>
         <p className={styles.titleIconGearText}><span role='img' aria-label="gear">⚙️</span></p>
      </div>
      <div className={styles.kanbanTitleTextWrapper}>
        <p className={styles.kanbanTitleText}>My Kanban Board (Drag and Drop)</p>
      </div>
      <div className={styles.kanbanTitleDescriptionWrapper}>
        <p className={styles.kanbanTitleDescriptionText}>Use this Kanban board to keep track of your time. Remember there's more to life than work!</p>
      </div>
    </div>
    <div className={styles.kanbanCreate}>
    <CreateCardButton />
    </div>
    </div>
  )
}

export default KanbanHeader
