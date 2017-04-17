// const { addList } = require('../database/db-queries/list.js')
const board = require('../database/db-queries/board.js')
const list = require('../database/db-queries/list.js')
const task = require('../database/db-queries/task.js')
const User = require('../database/db-queries/User.js')

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

        list.fetchLists(data.board_id)
          .then(lists => {
            io.in(room).emit('update-board', lists)
          });

        socket.join(room)
        io.of('/').in(room).clients(function(error, clients) {
          if (error) throw error;
          console.log(`Clients in room ${room}: ${clients}`);
        });

        // -------------- LISTS --------------
        socket.on('create-list', function(data) {
          list.addList(data.name, data.board_id)
            .then(msg => {
              list.fetchLists(data.board_id)
                .then(lists => {
                  io.in(room).emit('update-board', lists)
                })
                .catch(err => {
                  console.log('Retrieving board error')
                })
            })
            .catch(err => {
              console.log('CREATE LIST ERR')
            })
        });

        socket.on('update-list-name', (req) => {
          list.updateListName(req.listname, req.list_id)
          .then(success => {
            io.in(room).emit('update-list-name-' + req.list_id, { listname: req.listname })
          })
          .catch(err => {
            console.log('UPDATE LIST ERR')
          })
        });

        socket.on('delete-list', (req) => {
          console.log('list_id', req.list_id)
          list.deleteList(req.list_id)
          .then(pgData => {
            console.log('pgData', pgData)
            list.fetchLists(pgData.rows[0].board_id)
              .then(lists => {
                console.log('>> LISTS', lists)
                io.in(room).emit('update-board', lists)
              })
              .catch(err => {
                console.log('UPDATE BOARD ERR')
              })
          })
          .catch(err => {
            console.log('DELETE LIST ERR')
          })
        });

        // -------------- TASKS --------------
        socket.on('create-task', function(data) {
          task.addTask(data.list_id, data.text)
            .then(results => {
              io.in(room).emit('update-listID-' + data.list_id)
            })
            .catch(err => {
              console.log('CREATE TASK ERR', err)
            })
        });

        socket.on('fetch-tasks', (data) => {
          task.fetchTasks(data.list_id)
            .then(pgData => {
              let tasksFetched = 'tasks-fetched-listID-' + data.list_id

              io.in(room).emit(tasksFetched, pgData.rows)
            })
            .catch(err => {
              console.log('FETCH TASKS ERR')
            })
        });

        //--------------INVITE USERS------------
        socket.on('invite-user-to-board', (data) => {
          User.addUserToBoard(data.invitee, data.board_id)
            .then(pgData => {
              console.log(`${data.invitee} added to board id of ${data.board_id}`)
            })
            .catch(err => {
              console.log(error)
            })
          //databasequery here
        })

        //-------------DISCONNECT---------------
        socket.on('disconnect', function() {
          // socket.disconnect()
          console.log('Client disconnected!')
        });

        return io;
      })
    })
  }
}