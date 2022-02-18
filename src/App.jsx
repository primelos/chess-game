import { useEffect, useState } from "react";
import styled from "styled-components";
import Chessboard from "chessboardjsx";
import * as Chess from "chess.js";
import ProfileCard from "./components/profileCard";
import MovesHistory from "./components/movesHistory";
import useSound from "use-sound";
import chessMovesSfx from "./sounds/chessMove.mp3";
import chessCaptureSfx from "./sounds/chessCapture.mp3";
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
  const [chessBoard, setChessBoard] = useState(new Chess());

  const [movesHistory, setMovesHistory] = useState([]);

  const [chessMoveSound] = useSound(chessMovesSfx);
  const [chessCaptureSound] = useSound(chessCaptureSfx);

  const gameRef = doc(db, "games", "gameDoc");

  // console.log(gameRef);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      setPosition(snapshot.data().currentPosition);
      setMovesHistory(snapshot.data().gameHistory);
      chessBoard.load_pgn(snapshot.data().pgn);
    });
    return () => unsubscribe();
  }, []);

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

  const resetGame = async () => {
    await updateDoc(gameRef, {
      currentPosition: startingPosition,
      pgn: "",
      gameHistory: [],
      undoMovesHistory: [],
    });
  };

  return (
    <Wrapper>
      <Main>
        <ProfileCard />
        <Chessboard
          position={position}
          onDrop={(drop) => {
            updateChessBoardOnMove(drop.sourceSquare, drop.targetSquare);
            const moveInfo = chessBoard.move({
              from: drop.sourceSquare,
              to: drop.targetSquare,
            });
            if (moveInfo) {
              moveInfo.flags === "c" || moveInfo.flags === "e"
                ? chessCaptureSound()
                : chessMoveSound();
              setPosition(chessBoard.fen());
            }
          }}
        />
        <MovesHistory
          chessBoard={chessBoard}
          setPosition={setPosition}
          movesHistory={movesHistory}
        />
      </Main>
      <ResetButton onClick={resetGame}>Reset Game</ResetButton>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  background-color: #282c34;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ResetButton = styled.button``;
