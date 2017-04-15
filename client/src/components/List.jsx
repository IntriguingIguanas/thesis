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
      isEditing: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onCreateTask = this.onCreateTask.bind(this)
    this.onEditListName = this.onEditListName.bind(this)
    this.saveListName = this.saveListName.bind(this)

    var socket = this.props.socket
    socket.on('update tasks', (tasks) => {

    })
  }

  onInputChange(e) {
    this.setState({
      text: e.target.value
    })
  }

  onCreateTask() {
    this.props.createTask(this.state.text, this.props.list_id)
  }

  onEditListName() {
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  saveListName() {
    this.props.saveListName(false)
  }

  render() {
    // console.log(this.props)
    return (
      <div>
        <div>
          <h4 onClick={ this.onEditListName }>{ this.props.listname }</h4>
          { this.state.isEditing &&
            <div>
              <input type='text' value=''/>
              <button>Save</button>
            </div>
          }
        </div>
        <input onChange={ this.onInputChange }/>
        <button onClick={ this.onCreateTask }>CREATE TASK</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.list,
    list_id: state.list.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTask: (taskname, list_id) => {
      dispatch(createTask(taskname, list_id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
