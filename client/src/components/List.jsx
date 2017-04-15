import React from 'react'
import Task from './Task.jsx'
import { connect } from 'react-redux'
import { createTask } from '../actions/Task.js'
import { editingListName, saveListName } from '../actions/List.js'

export class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      name: '',
      tasks: null,
      isEditing: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onCreateTask = this.onCreateTask.bind(this)

  }
  componentWillMount() {
    for (var key in this.props.listObj) {
      var name = key
      var tasks = this.props.listObj[name]
    }
    this.setState({ name: name, tasks: tasks })
  }
  onInputChange(e) {
    this.setState({
      text: e.target.value
    })
  }

  onCreateTask() {
    this.props.createTask(this.state.text, this.props.list_id)
  }

  render() {
    return (
      <div>
        <div>
          <h4>{ this.state.name }</h4>
          { this.state.tasks && this.state.tasks.map(task => {
              if (task.text) {
                return <Task task={task}/>
              }
            })
          }
        </div>
        <input onChange={ this.onInputChange }/>
        <button onClick={ this.onCreateTask }>CREATE TASK</button>
      </div>
    )
  }
}

export default List

