import React from 'react'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux'
import BoardPage from './BoardPage.jsx'
import { createBoard, fetchBoards } from '../actions/Board'
// import SideBar from './SideBar.jsx'

export class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boardName: ''
    }
    this.handleBoardNameChange = this.handleBoardNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    console.log('LOBBY', this.props)
    console.log('USERID', this.props.LogIn.user_id)
    this.props.fetchBoards(this.props.LogIn.user_id)
  }

  handleBoardNameChange(e) {
    this.setState({
      boardName: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.createBoard(this.state.boardName)
  }

  render() {
    console.log('BOARDS', this.props.boards)
    return (
      <div>
        <input
          value={ this.state.boardName }
          onChange={ this.handleBoardNameChange }
        />
        <button onClick={ this.handleSubmit }>CREATE BOARD</button>
        { this.props.boards.map((board) => 
        {return(
          <div
            key={ board.boardname }
            onClick={ () => this.props.sendToLobby(board.board_id) }
          >{ board.boardname }
          </div>)
        }
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    boards: state.board.boards,
    user_id: state.LogIn.user_id

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createBoard: (boardName) => { dispatch(createBoard(boardName)) },
    fetchBoards: (user_id) => { dispatch(fetchBoards(user_id)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby)