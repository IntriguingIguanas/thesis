import React from 'react'
import List from './List.jsx'
import Video from './Video.jsx'
import { connect } from 'react-redux'
import { listsFetched } from '../actions/List.js'
import io from 'socket.io-client'

import {
  Grid,
  Card
} from 'semantic-ui-react'

export class BoardPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      forms: {createListName: '', inviteUser: ''},
      board_id: this.props.params.board_id,
      boardName: this.props.params.boardName,
      lists: []
    }
    this.onCreateList = this.onCreateList.bind(this)
    this.inviteUser = this.inviteUser.bind(this)
    this.moveList = this.moveList.bind(this)
    this.findIndexOfList = this.findIndexOfList.bind(this)
  }

  componentWillMount() {
    const socket = io()
    this.setState({
      socket: socket
    })
    socket.emit('join-board', { board_id: this.state.board_id })

    socket.on('update-board', (res) => {
      this.setState({
        lists: res.rows
      })
    })
  }

  componentWillUnmount() {
    this.state.socket.emit('disconnect');
  }

  handleChange(form, e) {
    const forms = this.state.forms
    forms[form] = e.target.value;
    this.setState({
      forms: forms
    })
  }

  onCreateList() {
    this.state.socket.emit('create-list', {
      board_id: this.state.board_id,
      name: this.state.forms.createListName
    })
    this.setState({
      forms: {
        createListName: '',
        inviteUser: this.state.forms.inviteUser
      }
    })
  }

  inviteUser() {
    this.state.socket.emit('invite-user-to-board', {
      invitee: this.state.forms.inviteUser,
      board_id: this.state.board_id
    })

    alert(`${this.state.forms.inviteUser} was successfully invited to ${this.state.boardName}`)

    this.setState({
      forms: { createListName: this.state.forms.createListName,
               inviteUser: '' }
    })
  }

  findIndexOfList(list_id) {
    var indexOfSource = undefined;
    this.state.lists.map((list, index) => {
      if (list.id === list_id) {
        indexOfSource = index;
      }
    })
    return indexOfSource
  }

  moveList(direction, list_id) {
    var indexOfSource = this.findIndexOfList(list_id);
    var data = {
      array: [ this.state.lists[indexOfSource] ]
    }
    if (direction === 'left') {
      data.array.push(this.state.lists[indexOfSource - 1])
    } else if (direction === 'right') {
      data.array.push(this.state.lists[indexOfSource + 1])
    }
    this.state.socket.emit('list-order-update', data);
  }

  render() {
    return (
      <div>
        <h3>{ this.state.boardName }</h3>
        <div>
          <input
            value={ this.state.forms.inviteUser }
            onChange={ this.handleChange.bind(this, 'inviteUser') }
          />
          <button onClick={ this.inviteUser }>INVITE</button>
        </div>
        <input
          value={ this.state.forms.createListName }
          onChange={ this.handleChange.bind(this, 'createListName') }
        />
        <button onClick={ this.onCreateList }>CREATE LIST</button>

        {/* ----- VIDEOS ----- */}
        <div className='video'>
          <Video socket={ this.state.socket }/>
        </div>

        {/* ----- LISTS SCROLL BOX ----- */}
        <Grid className='lists-box' columns='4'>
          { this.state.lists.map(list =>
            <Grid.Column key={ list.id }>
              <List
                socket={ this.state.socket }
                listname={ list.listname }
                list_id={ list.id }
                moveList = { this.moveList }
              />
            </Grid.Column>
          )}
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.list,
    lists: state.list.lists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listsFetched: (lists) => { dispatch(listsFetched(lists)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage)
