const { addList } = require('../database/db-queries/list.js')
const { fetchBoard } = require('../database/db-queries/board.js')
const { fetchLists } = require('../database/db-queries/list.js') 

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
        var room = data.taskBoardId.toString()
        fetchBoard(data.taskBoardId)
        .then(rows => {
          socket.emit('update-board', rows)
          socket.to(room).emit('update-board', rows)
        })    
        socket.join(room)
        io.of('/').in(room).clients(function(error, clients) {
          if (error) throw error;
          console.log(`Clients in room ${room}: ${clients}`);
        });
// <------------- CREATE LIST ------------->
        socket.on('create-list', function(data) {
          addList(data.name, data.boardId)
          .then(msg => {
            fetchBoard(data.boardId)
            .then(rows => {
              socket.emit('update-board', rows)
              socket.to(room).emit('update-board', rows)
            })
            .catch(err => {
              console.log('Retrieving board error')
            })
          })
          .catch(err => {
            console.log('Error creating list', err)
          })
        });

      })

      socket.on('disconnect', function () {
        console.log('client disconnected')
      });
    })

    return io;
  }

}
