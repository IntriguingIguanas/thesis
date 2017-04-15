import React from 'react'
import List from './List.jsx'
import { connect } from 'react-redux'
import { createList, listsFetched } from '../actions/List.js'
import io from 'socket.io-client'
import _ from 'underscore'

export class BoardPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listName: '',
      socket: null,
      rows: null
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onCreateList = this.onCreateList.bind(this)

  }

  componentWillMount() {
    var socket = io();
    this.setState({
      socket: socket
    }, () =>{
      this.state.socket.emit('join-board', { taskBoardId: this.props.board_id })
      this.state.socket.on('update-board', (res) => {
        let lists = parseData(res.rows)
        this.props.listsFetched(lists)
      })
    });
  }

  componentDidUpdate() {
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
    this.state.socket.emit('create-list', { boardId: this.props.board_id, name: this.state.listName })
  }

  render() {
    return (
      <div>
        <h3>{ this.props.boardname }</h3>
        <input value={ this.state.listName } onChange={ this.onInputChange }/>
        <button onClick={ this.onCreateList }>CREATE LIST</button>

        { this.props.lists.map(list =>
          <List
            listObj={ list }
          />) }
      </div>
    )
  }
}

const parseData = (rows) => {
  var result = [];
  var listNames = _.uniq(rows.map(row => {
    return row.listname
  }))
  listNames.forEach(name => {
    var obj = {}
    obj[name] = [];
    rows.forEach(row => {
      if (row.listname === name) {
        obj[name].push(row)
      }
    })
    result.push(obj)
  })
  return result
}

const mapStateToProps = (state) => {
  return {
    ...state.list,
    board_id: state.list.id,
    lists: state.list.lists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createList: (boardname, board_id) => { dispatch(createList(boardname, board_id)) },
    listsFetched: (lists) => { dispatch(listsFetched(lists)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage)
