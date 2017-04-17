import React from 'react'
import List from './List.jsx'
import { connect } from 'react-redux'
import { listsFetched } from '../actions/List.js'
import io from 'socket.io-client'

export class BoardPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listName: '',
      socket: null,
      board_id: this.props.params.board_id,
      boardName: this.props.params.boardName,
      invitee: 'Invite someone...',
      lists: []
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onCreateList = this.onCreateList.bind(this)
    this.onInviteeInputChange = this.onInviteeInputChange.bind(this)
    this.inviteUser = this.inviteUser.bind(this)
  }

  componentWillMount() {
    const socket = io()
    this.setState({
      socket: socket
    })
    socket.emit('join-board', { board_id: this.state.board_id }
    )
  }

  componentDidMount() {
    this.state.socket.on('update-board', (res) => {
      console.log('LISTS RECEIVED', res.rows)
      // this.props.listsFetched(res.rows)
      this.setState({
        lists: res.rows
      })
    })
  }

  componentWillUnmount() {
    this.state.socket.emit('disconnect');
  }

  onInputChange(e) {
    this.setState({
      listName: e.target.value
    })
  }

  onCreateList() {
    this.state.socket.emit('create-list', { boardId: this.state.board_id, name: this.state.listName })
  }

  onInviteeInputChange(e) {
    this.setState({
      invitee: e.target.value
    })
  }

  onCreateList() {
    this.state.socket.emit('create-list', { board_id: this.state.board_id, name: this.state.listName })
  }

  inviteUser() {
    this.state.socket.emit('invite-user-to-board', {invitee: this.state.invitee, board_id: this.state.board_id})

    this.setState({
      invitee: ''
    })

    alert(`${this.state.invitee} was successfully invited to ${this.state.boardName}`)
  }

  render() {
    return (
      <div>
        <h3>{ this.state.boardName }</h3>
        <div>
          <input value={ this.state.invitee }
            onChange={ this.onInviteeInputChange }
            onClick= { this.clearInviteeInput }
          />
          <button onClick={ this.inviteUser }>INVITE</button>
        </div>

        <input value={ this.state.listName } onChange={ this.onInputChange }/>
        <button onClick={ this.onCreateList }>CREATE LIST</button>
        { console.log('LISTS TO RENDER', this.state.lists) }
        { this.state.lists.map((list, index) =>
          <List
            key={ index }
            socket={ this.state.socket }
            listname={ list.listname }
            list_id={ list.id }
          />) }
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
