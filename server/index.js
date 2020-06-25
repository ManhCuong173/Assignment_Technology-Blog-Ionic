const express = require ('express');
const app = express ();
const server = require ('http').createServer (app);
const io = require ('socket.io') (server);
let port = process.env.PORT || 3000;

io.on ('connection', socket => {
  socket.on ('disconnect', function () {
    soclet.emit ('Disconnect');
  });

  socket.on ('send-notification', function (data) {
    socket.emit ('res-send-notification', data);
  });

  socket.on ('read-notification', function (data) {
    socket.emit ('response-read-notification', --data);
  });

  socket.on ('read-notification-change-color', function (data) {
    socket.emit ('res-read-notification-change-color', data);
  });

  socket.on ('new-comment', function (data) {
    socket.emit ('res-new-comment', data);
  });
});

server.listen (port, function () {
  console.log ('Running server successfully at' + port);
});
