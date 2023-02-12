import express from 'express';
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';
// import WebSocket from "ws";
import http, { ServerResponse } from 'http';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

// app.listen(3000, handleListen); //port 3000 listen

const httpServer = http.createServer(app); //createServer(reqlistener) 리스너를 인자로받고 서버생성..

/* websocket io*/
// const wsServer = new Server(httpServer, {
//   cors: {
//     origin: ["https://admin.socket.io"],
//     credentials: true,
//   },
// });
// instrument(wsServer, {
//   auth: false,
// });

const wsServer = new Server(httpServer);

wsServer.on('connection', (socket) => {
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcome');
  });
  socket.on('offer', (offer, roomName) => {
    socket.to(roomName).emit('offer', offer);
  });
  socket.on('answer', (answer, roomName) => {
    socket.to(roomName).emit('answer', answer);
  });

  socket.on('ice', (ice, roomName) => {
    socket.to(roomName).emit('ice', ice);
  });
});

/* function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

function publicRooms() {
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); //except you
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
}); */ // chating part

const handleListen = () => console.log(`Listening on http://Localhost:3000`);
httpServer.listen(3000, handleListen);

// const wss = new WebSocket.Server({ server }); //인자로 server넣거나 {server} 후자의 경우 위의 http서버, wss서버 둘다 돌릴수있음
//http서버 원하지않으면 중괄호 빼고..
//이렇게하면 서버는 ws,http 이해가능..
//여기서 http가 필요한이유는 views static files, home, redirection 지원해서..

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to browser!");
//   socket.on("close", () => console.log("disconnected from browser"));

//   socket.on("message", (msg) => {
//     // console.log(message.toString("utf-8"));
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload; //socket이 객체라 이렇게 nickname항목 생성
//         console.log(message.payload);
//         break;
//     }
//     // for (let s of sockets) s.send(message); //for in에서 객체의 키값에 접근.. socket obj가 아님
//     // for (let i = 0; i < 2; i++) {
//     //   sockets[i].send(message);
//     // }  //이렇게는되는데 for in문이 생각이랑 좀 다르네..
//   });
// });

//wss는 서버전체를 위한것 socket은 연결된 브라우저를 위한것 여기다 처리하는게 중요..

// server.listen(3000, handleListen);
