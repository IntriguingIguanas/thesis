// const { addList } = require('../database/db-queries/list.js')
const board = require('../database/db-queries/board.js')
const list = require('../database/db-queries/list.js')
const task = require('../database/db-queries/task.js')
const User = require('../database/db-queries/User.js')
const parseSQLData  = require('./parseDataHelper.js')

var sockets = require('socket.io');
var io;
//import database queries

var rooms = [];
var currentBoard = null;

module.exports = {
  io: function() {
    return io;
  },
  init: function(server) {
    io = sockets(server);

    io.on('connection', function(socket) {
      console.log('Connected to ' + socket);

      socket.on('join-board', function(data) {
        var room = data.board_id.toString()
        console.log(room)
        board.fetchBoard(data.board_id)
        .then(board => {
          socket.emit('retrieve-board', parseSQLData(board.rows))
        })
        .catch(err => {
          console.log('error retrieving board', err)
          socket.emit('retrieve-board', 'Error retrieving board')
        })

        socket.join(room)
        io.of('/').in(room).clients(function(error, clients) {
          if (error) throw error;
          console.log(`Clients in room ${room}: ${clients}`);
        });

        // -------------- LISTS --------------
        socket.on('create-list', function(req) {
          list.addList(req.name, req.board_id)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('CREATE LIST ERR', err)
          })
        });

        socket.on('update-list-name', (req) => {
          list.updateListName(req.listname, req.list_id)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('UPDATE LIST ERR')
          })
        });

        socket.on('delete-list', (req) => {
          console.log('list_id', req.list_id)
          list.deleteList(req.list_id)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('DELETE LIST ERR', err)
          })
        });

        // -------------- TASKS --------------
        socket.on('fetch-tasks', (req) => {
          task.fetchTasks(req.list_id)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('FETCH TASKS ERR')
          })
        });

        socket.on('add-task', function(req) {
          task.addTask(req.list_id, req.text)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('ADD TASK ERR', err)
          })
        });

        socket.on('update-task', (req) => {
          task.updateTask(req.task_id, req.newText)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('UPDATE TASK ERR', err)
          })
        });

        socket.on('delete-task', (req) => {
          task.deleteTask(req.task_id)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('DELETE TASK ERR', err)
          })
        });

        //------------ INVITE USERS ------------
        socket.on('invite-user-to-board', (data) => {
          User.addUserToBoard(data.invitee, data.board_id)
          .then(pgData => {
            console.log(`${data.invitee} added to board id of ${data.board_id}`)
          })
          .catch(err => {
            console.log(err)
          })
        })

        //------------ MOVE LIST ------------
        socket.on('list-order-update', (req) => {
          list.updateListOrder(req.list_id, req.newListOrder)
          .then(success => {
            return board.fetchBoard(req.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log('UPDATE LIST ORDER ERR', err)
          })
        })

        //------------ MOVE TASK ------------
        socket.on('task-order-update', (data) => {
          console.log(data, "DATA")
          task.updateTaskOrder(data)
          .then(success => {
            console.log(success, "SUCCESS")
            return board.fetchBoard(data.board_id)
          })
          .then(board => {
            io.in(room).emit('retrieve-board', parseSQLData(board.rows))
          })
          .catch(err => {
            console.log(err)
          })
        })

        //------------- DISCONNECT -------------
        socket.on('disconnect', function() {
          console.log('Client disconnected!')
        });

        return io;
      })
    })
  }
}
