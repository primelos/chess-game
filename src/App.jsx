import { useState } from "react";
import styled from "styled-components";
import Chessboard from "chessboardjsx";
import * as Chess from "chess.js";
import ProfileCard from "./components/profileCard";
import MovesHistory from "./components/movesHistory";
// import useSound from "use-sound";
// import chessMovesSfx from "./sounds/chessMove.mp3";
// import chessCaptureSfx from "./sounds/chessCapture.mp3";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const startingPosition =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function App() {
  const [position, setPosition] = useState(startingPosition);
  const [chessBoard] = useState(new Chess());

  const gameRef = doc(db, "games", "gameDoc");

  // console.log(position);

  const updateChessBoardOnMove = async (sourceSquare, targetSquare) => {
    const interChessBoard = new Chess();
    const gameSnap = await getDoc(gameRef);
    interChessBoard.load_pgn(gameSnap.data().pgn);
    interChessBoard.move({ from: sourceSquare, to: targetSquare });

    updateDoc(gameRef, {
      currentPosition: interChessBoard.fen(),
      pgn: interChessBoard.pgn(),
      gameHistory: interChessBoard.history(),
    });
  };

  return (
    <Wrapper>
      <ProfileCard />
      <Chessboard
        position={position}
        onDrop={(drop) => {
          chessBoard.move({ from: drop.sourceSquare, to: drop.targetSquare });
          setPosition(chessBoard.fen());
        }}
      />
      <MovesHistory chessBoard={chessBoard} setPosition={setPosition} />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  background-color: #282c34;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
