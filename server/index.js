const express = require ('express');
const app = express ();
const server = require ('http').createServer (app);
const io = require ('socket.io') (server);
let port = process.env.PORT || 3000;

io.on ('connection', socket => {
  socket.on ('disconnect', function () {
    io.emit ('Disconnect');
  });

  socket.on ('send-notification', function (data) {
    io.emit ('res-send-notification', data);
  });

  socket.on ('read-notification', function (data) {
    io.emit ('response-read-notification', --data);
  });

  socket.on ('read-notification-change-color', function (data) {
    io.emit ('res-read-notification-change-color', data);
  });
});

server.listen (port, function () {
  console.log ('Running server successfully at' + port);
});
