import { gql } from '@apollo/client';

const ALL_TASKS = gql`
query AllTasks{
  allTasks{
    id
    title
    description
    cardState
  }
}
`

const CREATE_TASK = gql`
mutation CreateTask($title:String!, $description:String){
  createTask(title:$title, description:$description){
    task{
      title
      description
    }
  }
}
`

const UPDATE_TASK_COLUMN = gql`
mutation UpdateTaskColumn($id: ID!, $cardState: Int!){
  updateTaskColumn(id:$id, cardState:$cardState){
    task{
      id
      cardState
    }
  }
}
`

const DELETE_TASK = gql`
mutation DeleteTask($id:ID!){
  deleteTask(id:$id){
    task{
      cardState
    }
  }
}
`

export { ALL_TASKS, CREATE_TASK, UPDATE_TASK_COLUMN, DELETE_TASK }
