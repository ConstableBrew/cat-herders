var port = process.env.PORT || 8000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.use(express.static('./dist'));

io.on('connection', socket => {
    
});

http.listen(port, function(){
  console.log(`listening on *:${port}`);
});