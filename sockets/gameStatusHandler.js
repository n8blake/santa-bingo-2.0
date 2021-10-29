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
    socket.on('start', function (room) {
        console.log(`Starting game ${room}`);
        if(room){
            console.log(socket.request.session);
            const gameUUID = room;
            const userUUID = socket.request.session.user.uuid;
            gameController.startGame(gameUUID, userUUID)
                .then(result => {
                    console.log(result);
                    if(result){
                        socket.to(room).emit('started', 'game started');
                    } else {
                        // uhhh idk?
                        socket.to(room).emit('ended', 'game ended');
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    });
    socket.on('end', function (room) {
        console.log(`Ending game ${room}`);
        if(room){
            console.log(socket.request.session);
            const gameUUID = room;
            const userUUID = socket.request.session.user.uuid;
            gameController.endGame(gameUUID, userUUID)
                .then(result => {
                    console.log(result);
                    if(result){
                        socket.to(room).emit('ended', 'game ended');
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    });
}
