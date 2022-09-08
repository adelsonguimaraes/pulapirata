/// não utilizado

// class SocketController {
//     construct() {
//         this.socket = io('/');
//     }

//     connectLobby(userId, userName) {
//         this.socket.emit('connect-lobby', {
//             'room_id': 'lobby',
//             'user_id': (userId),
//             'user_name': (userName)
//         })
//     }

//     createRoom(data) {
//         this.socket.emit('create-room', data)
//     }

//     connectRoom(userId) {
//         this.socket.emit('connect-room', {user_id: userId})
//     }

//     cancelRoom(obj) {
//         this.socket.emit('cancel-room', obj)
//     }

//     enterRoom(obj) {
//         this.socket.emit('enter-room', (obj))
//     }

//     startGame(obj) {
//         this.socket.emit('start-game' , obj)
//     }

//     clickOnSlot(userId, slotId) {
//         this.socket.emit('click-on-slot', {
//             user_id: userId,
//             slot_id: slotId
//         })
//     }

//     mapSlots(data) {
//         this.socket.emit('map-slots', this.mapSlots(data))
//     }
// }