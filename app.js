var express   = require('express');
var app       = express();
var Promise  = require('bluebird');
var mongoose  = require('mongoose');
mongoose = Promise.promisifyAll(mongoose);

var Broadcast = require('./broadcastModel');

var mongoConnect = mongoose.connectAsync('mongodb://localhost:27017/chat');

var clients = {};

app.use(express.static(__dirname + '/'));
app.set('port', process.env.PORT || 32769);
app.set( 'view engine', 'html' );
var http = require('http');
var server = http.createServer(app);
var sic =  require('socket.io');
var socket_io = require('socket.io')(server);

server.listen(app.get('port'), function() {
  console.log("Listening to port: " + app.get('port'));
});

app.get('/', function(req, res) {
  res.sendFile('index.html',{ root: __dirname + '/'});
});

socket_io
  .on('connection', function(socket) {
    clients[socket.id] = socket;
    console.log('connected');

    socket.on('initiate', function(data) {
      if (Object.keys(data).length) {
        // console.log('initiate');
        // console.log(data);
        // socket.join(data.uniqueAddressToken);
        /* get the data */
        Broadcast
          .findOne({uniqueAddressToken: data.uniqueAddressToken})
          .then(function(obj, err) {
            console.log('initiate');
            console.log(obj);
            socket.join(obj.data.uniqueAddressToken);
            // socket.emit('message', obj.data);
            // socket_io.to(obj.data.broadcaster).emit('message', obj.data);
            // socket_io.in(obj.data.broadcaster).emit('message', obj.data);

            clients[socket.id].emit('message',  obj.data);
          })
      }
    });

    socket.on('message', function(data) {
      if (data.broadcaster) {
        // console.log(data);
        console.log('if');
        console.log(data);
        socket.join(data.uniqueAddressToken);
        // socket.join(data.broadcaster);
        /*save the data for the broadcast*/
        var newBroadcast = Broadcast({
          uniqueAddressToken: data.uniqueAddressToken,
          data              : data
        });
        newBroadcast.save();
      } else {
        console.log('else');
        console.log(data);
        var room = null;
        if (data.joinUser) {
          room = data.joinUser;
        } else {
          room = data.userToken;
        }

        console.log('room')
        console.log(room);
        // socket.broadcast.emit(data.uniqueAddressToken, data);
        socket.broadcast.to(data.uniqueAddressToken).emit('message', data);
      }
    });

  socket.on('disconnect', function(status) {
    console.log('disconnect');
  })
});

/*close our connection when the app stop*/
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
