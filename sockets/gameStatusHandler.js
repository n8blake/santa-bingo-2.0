const gameController = require('../controllers/gameController');

module.exports = (io, socket) => {
    socket.on('join', function (room) {
        console.log(room);
        if(room){
            console.log(`Adding to ${room}`);
            socket.join(room);
            socket.emit('joined', room);
        }
    });
    socket.on('start', function (emission) {
        console.log(emission);
        console.log(`Starting game ${emission.gameRoom}`);
        if(emission.gameRoom){
            socket.to(emission.gameRoom).emit('started', emission.game);
        }
    });
    socket.on('end', function (room) {
        console.log(`Ending game ${room}`);
        if(room){
            console.log(socket.request.session);
            //const gameUUID = room;
            //const userUUID = socket.request.session.user._id;
            socket.to(room).emit('ended', 'game ended');
            
        }
    });
    socket.on('roomsUpdate', function(room){
        console.log(`Updating room: ${room}`);
        if(room){
            socket.to(room).emit('roomsUpdate', room);
        }
    });
    socket.on('closeRoom', function(room) {
        console.log(`Closing room ${room}`);
        if(room){
            socket.to(room).emit('close', room);
            socket.to('main').emit('roomsUpdate', room);
        }
    });
    socket.on('ejectPlayer', function(emission){
        console.log(`Player ejection:`)
        console.log(emission);
        if(emission.gameRoom && emission.playerId){
            socket.to(emission.gameRoom).emit('ejectPlayer', emission.playerId);
        }
    });
    socket.on('nextNumberCalled', function(emission){
        console.log('next number called');
        console.log(emission);
        if(emission.gameRoom && emission.game){
            socket.to(emission.gameRoom).emit('nextNumberCalled', emission.game)
        }
    });
}
