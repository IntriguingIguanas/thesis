import React from 'react'
import List from './List.jsx'
import { connect } from 'react-redux'
import { boardFetched, fetchBoardError, moveList, moveTask } from '../actions/Board.js'
import { listsFetched } from '../actions/List.js'
import { fetchUsernames } from '../actions/Users.js'
import io from 'socket.io-client'
import { Link } from 'react-router'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import flow from 'lodash.flow'
import Autosuggest from 'react-autosuggest'
import {
  Grid,
  Card,
  Header
} from 'semantic-ui-react'

export class BoardPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: io(),
      forms: {createListName: ''},
      inviteUser: '',
      board_id: this.props.params.board_id,
      boardName: this.props.params.boardName,
      lists: [],
      suggestions:[]
    }

    this.onCreateList = this.onCreateList.bind(this)
    this.inviteUser = this.inviteUser.bind(this)
    this.moveList = this.moveList.bind(this)
    this.findList = this.findList.bind(this)
    this.moveTask = this.moveTask.bind(this)
    this.findIndexOfList = this.findIndexOfList.bind(this)
    this.getSuggestions = this.getSuggestions.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)

  }

  componentWillMount() {
    const { socket } = this.state
    this.props.fetchUsernames();

    socket.on('retrieve-board', (board) => {
      if (typeof board === 'object'){
        this.props.boardFetched(board);
      } else {
        this.props.fetchBoardError(board);
      }
    })

    socket.emit('join-board', { board_id: this.state.board_id })
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
    if (this.state.forms.createListName !== '') {
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
  }
//----------- INVITE USER -----------
  inviteUser() {
    this.state.socket.emit('invite-user-to-board', {
      invitee: this.state.inviteUser,
      board_id: this.state.board_id
    })

    alert(`${this.state.inviteUser} was successfully invited to ${this.state.boardName}`)
  }

  getSuggestions(value) {
    var inputValue = value.trim().toLowerCase();
    var inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.usernames.filter(user => {
      return (user.username.toLowerCase().slice(0, inputLength) === inputValue)
    })
  }

  getSuggestionValue(suggestion) {
    return suggestion.username;
  }

  renderSuggestion(suggestion) {
    return (
      <div>
      {suggestion.username}
      </div>
    )
  }

  onSuggestionsFetchRequested({ value }){
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    })
  };

  onChange(event, { newValue }) {
    this.setState({
      inviteUser: newValue
    })
  }

//------------ REACT DND ------------
  findIndexOfList(list_id) {
    var indexOfSource = undefined;
    this.state.lists.map((list, index) => {
      if (list.id === list_id) {
        indexOfSource = index;
      }
    })
    return indexOfSource
  }

  moveList(listId, nextX) {
    const { currentX } = this.findList(listId)
    this.props.moveList(currentX, nextX)

    const socket = this.state.socket
    let lists = this.props.board.lists
    let newListOrder = null

    console.log("LISTS", lists)

    if (nextX === 0) {
      newListOrder = (lists[1].list_order)/2
    } else if (lists[nextX+1]) {
      newListOrder = (lists[nextX-1].list_order + lists[nextX+1].list_order)/2
    } else {
      newListOrder = lists[nextX-1].list_order * 2
    }

    console.log(`NEW ORDER OF LIST ${listId}`, newListOrder)

    socket.emit('list-order-update', {
      list_id: listId,
      newListOrder: Math.round(newListOrder),
      board_id: this.state.board_id
    })
  }

  moveTask(currentX, currentY, nextX, nextY) {
    this.props.moveTask(currentX, currentY, nextX, nextY)
  }

  findList(id) {
    const { board } = this.props
    const list = board.lists.filter(l => l.listId === id)[0]

    return {
      list,
      currentX: board.lists.indexOf(list)
    }
  }

  render() {
    let inputProps = {
      placeholder: 'Enter Username',
      value: this.state.inviteUser,
      onChange: this.onChange
    }

    if (this.props.board.lists) {
      return (
        <div>
          {/* ----- NAV BAR ----- */}
          <div className="ui blue inverted stackable menu">
            <div className="ui container">
              <img className='logo' src="./Logo.png"></img>
            </div>
            <a className="item"><Link to='/lobby'>
              <i className="block layout icon"></i>BOARDS
            </Link></a>
            <a className="item"><Link to='/'>
              <i className="sign out icon"></i>SIGN OUT
            </Link></a>
          </div>

          {/* ----- BOARD NAME ----- */}
          <h4 className="ui header">
            <div className="content board name">
              <i className="bookmark icon"></i>
              {this.state.boardName}
            </div>
          </h4>

          <div className='invite create list'>
          {/* ----- CREATE LIST ----- */}
          <div className="ui action input">
            <input//here is where the autoSuggest goes
              value={ this.state.forms.createListName }
              onChange={ this.handleChange.bind(this, 'createListName') }
            />
            <button className="ui blue right labeled icon button" onClick={ this.onCreateList }>
              <i className="plus icon"></i>
              NEW LIST
            </button>
          </div>

          {/* ----- INVITE USERS ----- */}
          <div className="ui action input">
            <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
            />
            <button className="ui blue right labeled icon button" onClick={ this.inviteUser }><i className="add user icon"></i>
              INVITE
            </button>
          </div>

          </div>

          {/* ----- LISTS SCROLL BOX ----- */}
          <Grid className='canvas'>
            { this.props.board.lists.map((list,i) =>
              <Grid.Column className='list-column' width={4} key={ list.listId }>
                <List
                  socket={ this.state.socket }
                  lists={ this.props.board.lists }
                  listname={ list.listname }
                  list_id={ list.listId }
                  item={ list }
                  moveList = { this.moveList }
                  moveTask = { this.moveTask }
                  x = { i }
                />
              </Grid.Column>
            )}
          </Grid>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    user_id: state.LogIn.user_id,
    board: state.board.board,
    usernames: state.users.usernames
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    boardFetched: (board) => { dispatch(boardFetched(board)) },
    listsFetched: (lists) => { dispatch(listsFetched(lists)) },
    fetchBoardError: (board) => { dispatch(fetchBoardError(board)) },
    moveList: (currentX, nextX) => { dispatch(moveList(currentX, nextX)) },
    moveTask: (currentX, currentY, nextX, nextY) => { dispatch(moveTask(currentX, currentY, nextX, nextY)) },
    fetchUsernames: () => { dispatch(fetchUsernames()) }
  }
}

export default flow (
  DragDropContext(HTML5Backend),
  connect(mapStateToProps, mapDispatchToProps)
)(BoardPage)
