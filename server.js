const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const players = {};
const lobbys = { name: {}};

app.set('views', './Component');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
//app.use(express.static('public'));

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/Component/client.html');
  res.render('client', { lobbys: lobbys})
});

app.get('/:gameName/Lobby', (req, res) => {
  //res.sendFile(__dirname + '/Component/lobby.html');
  res.render('lobby', { name: req.params.gameName})
});

app.get('/:gameName/Game', (req, res) => {
  //res.sendFile(__dirname + '/Component/game.html');
  res.render('game', { name: req.params.gameName})
});

io.on('connection', (socket) => {
  socket.on('new player', playerName => {
    players[socket.id] = playerName;
    socket.broadcast.emit('player connected', playerName) //Send to all clients except sender
  })

  socket.on('chat message', message => {
    //socket.broadcast.emit('msg', {message: message, name: players[socket.id]});
    io.emit('msg', {message: message, name: players[socket.id]});
  });

  socket.on('player leaving', () => {
    socket.broadcast.emit('player disconnect', users[socket.id]);
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
