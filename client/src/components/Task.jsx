import React from 'react'

export const Task = (props) => {
  return (
    <div>
      <div>{ props.task.text }</div>
      <div> – assigned to { props.task.assigned }</div>
    </div>
  )
}

export default Task