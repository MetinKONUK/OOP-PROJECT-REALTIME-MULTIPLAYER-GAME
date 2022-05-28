import WebSocket from "ws";
import Board from "./Board.js";
const PORT = 5000;
const wss = new WebSocket.Server({
  port: PORT,
});

var clients = []; //[ws, ws, ...]

var matches = []; //[new Board(), new Board(), ...]

//MODEL FOR INCOMING DATA
var DataFromClient = {
    Type: "",
    CurrentUsername: "",
    OpponentUsername:"",
    HomeSpotCoords : [],
    TargetSpotCoords : [],
  }
  
//MODEL FOR GOING DATA
var DataToClient = {
  Type: "",
  NewShapeCoordinates : null,
  NewShapeTypes : null,
  GameStartedFeedback : false,
  HomeSpotSetRequestFeedback : false,
  TargetSpotSetRequestFeedback : false,
  Path : null,
  Turn : null,
  ErrorMessage: null,
  ClearSpotsData : [],
  GameEndInfo : null,

};

const SendDataToClients = (dtc, clnts) => 
{
  var data = JSON.stringify(dtc);
  clnts.forEach(c => c.send(data));
}


const ListClients = () => {
  console.log("--------CLIENTS--------\n");
  clients.forEach(client => {
    console.log(`Username: ${client.Username} Opponent: ${client.Opponent.Username}\n`);
  });
}

const FindClientsBoard = (username) => {
  
    let result = null;
    matches.forEach(board => {
    console.log("HERE");
    console.log(board.player1.Username);
    console.log(board.player2.Username);

    if(board.player1.Username == username || board.player2.Username == username){
      result = board;
    }
  });
  return result;
}



const HandleMessage = (ws, data) => {
    DataFromClient = JSON.parse(data);

    if(DataFromClient.Type == "username")// SAVE CLIENT TO CLIENTS
    {
        console.log(`Client connected to server: ${DataFromClient.CurrentUsername}`);
        ws.Username = DataFromClient.CurrentUsername;
        clients.push(ws);
    }

    if(DataFromClient.Type == "opponent_username")// MAKE CLIENTS OPPONENT
    {
        //SET CLIENTS AS EACH OTHER'S OPPONENTS
        let Opponent = clients.filter(client => client.Username == DataFromClient.OpponentUsername)[0];
        ws.Opponent = Opponent;
        clients.filter(client => client.Username == Opponent.Username)[0].Opponent = ws;

        //CREATE MATCH BOARD FOR CLIENTS
        let board = new Board();
        board.player1 = ws;
        board.player2 = Opponent;
        board.player1.Score = 0;
        board.player2.Score = 0;
        board.turn = board.player1;
        board.SetBoard();
        let coordinates = board.PlaceShapes(); //PLACE SHAPES FOR SERVER BOARD
        let ShapeTypes = [];
        for(let i = 0; i < 3; ++i){
          ShapeTypes.push(board.board[coordinates[i][0]][coordinates[i][1]].ShapeType);
        }
        console.log("UP: ", ShapeTypes);

        matches.push(board);
        //SEND GAME STARTED FEEDBACK TO CLIENTS
        DataToClient.Type = "game-started-feedback";
        DataToClient.GameStartedFeedback = true;
        SendDataToClients(DataToClient, [ws, Opponent]);

        //SEND COORDINATES OF THE PLACED SHAPES TO CLIENTS
        DataToClient.Type = "new-shape-coordinates";
        DataToClient.NewShapeCoordinates = coordinates;
        DataToClient.NewShapeTypes = ShapeTypes;
        SendDataToClients(DataToClient, [ws, Opponent]);
        


        ListClients();
    }
    if(DataFromClient.Type == "home_spot_coords")
    {
        let username = DataFromClient.CurrentUsername;
        let board = FindClientsBoard(username);

        if(board.turn.Username != username){
          DataToClient.Type = "error-message";
          DataToClient.ErrorMessage = "this-is-not-your-turn";
          board.home = null;
          board.target = null;
          let clnts = [];
          if(board.player1.Username == username)
          {
            clnts.push(board.player1);
          } 
          else {
            clnts.push(board.player2);
          }
          SendDataToClients(DataToClient, clnts);
        } 
        else {
          let coords = DataFromClient.HomeSpotCoords;
          let decision = board.IsHomeSettable(coords[0], coords[1]);
          
          if(decision == false)
          {
            board.home = null;
            board.target = null;
          }
        DataToClient.Type = "home-spot-set-request-feedback";
        DataToClient.HomeSpotSetRequestFeedback = decision;
        let clnts = [];
        if(board.player1.Username == username)
        {
          clnts.push(board.player1);
        } 
        else {
          clnts.push(board.player2);
        }
        SendDataToClients(DataToClient, clnts);
        }
      }
    if(DataFromClient.Type == "target_spot_coords")
    {
      let username = DataFromClient.CurrentUsername;
      let board = FindClientsBoard(username);
      if(board.home != null){

        let coords = DataFromClient.TargetSpotCoords;
        let decision = board.IsTargetSettable(coords[0], coords[1]);
        if(decision == false){
          DataToClient.Type = "target-spot-set-request-feedback";
          DataToClient.TargetSpotSetRequestFeedback = decision;
          board.home = null;
          board.target = null;
          let clnts = [];
          if(board.player1.Username == username){
            clnts.push(board.player1);
          } else {
            clnts.push(board.player2);
          }
          SendDataToClients(DataToClient, clnts);
      } else
        {
          // SEND MOVE DATA
          DataToClient.Type = "shape-move-info";
          DataToClient.Path = board.PathAsIndices();
          DataToClient.Turn = board.turn.Username;
          SendDataToClients(DataToClient, [board.player1, board.player2]);

          // CHECK FOR POINTS
          board.CheckForPoints(DataToClient);
          if(board.IsGameEnd())
          {
            board.SendGameEndInfo(DataToClient);
          }

          board.ShowBoard();

        }
      }
      } 
      if(DataFromClient.Type == "place_new_shapes_request")
      {
        let username = DataFromClient.CurrentUsername;
        let board = FindClientsBoard(username);
        if(username == board.turn.Username){
          console.log(`${username} asked to place new shapes`);
          let coordinates = board.PlaceShapes(); //PLACE SHAPES FOR SERVER BOARD
          let ShapeTypes = [];
          for(let i = 0; i < 3; ++i){
            ShapeTypes.push(board.board[coordinates[i][0]][coordinates[i][1]].ShapeType);
          }
          console.log(ShapeTypes);
          DataToClient.Type = "new-shape-coordinates";
          DataToClient.NewShapeCoordinates = coordinates;
          DataToClient.NewShapeTypes = ShapeTypes;
          SendDataToClients(DataToClient, [board.player1, board.player2]);
          if(board.turn == board.player1){
            board.turn = board.player2;
          }
          else {
            board.turn = board.player1;
          }
          
        }

      }



}


const DisconnectClient = (ws) => {
  console.log(`Client is disconnected: ${ws.Username}\n`);
  clients = clients.filter((client) => client !== ws);
}



wss.on("connection", function (ws) {
  /*
    WHEN A CLIENT CONNECTS TO SERVER SCOPE STARTS
  */
  console.log("A client just connected!!!");
  
  ws.on("message", function (data) {
        /*
         WHEN A CLIENT SENDS MESSAGE TO SERVER SCOPE START
        */
        console.log("A client just sent a messagee!!!");
        HandleMessage(ws, data);
    
        /*
         WHEN A CLIENT SENDS MESSAGE TO SERVER SCOPE END
        */
  });


  ws.on("close", function () {
        DisconnectClient(ws);
  });


});

console.log(new Date() + " Server is listening on port " + PORT);
