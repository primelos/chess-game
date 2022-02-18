import React, { useState } from "react";
import styled from "styled-components";
import useSound from "use-sound";
import chessMovesSfx from "../../sounds/chessMove.mp3";
import chessCaptureSfx from "../../sounds/chessCapture.mp3";

import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import * as Chess from "chess.js";

const MovesHistory = ({ chessBoard, setPosition, movesHistory }) => {
  const [undoMovesHistory, setUndoMovesHistory] = useState([]);

  const [chessMoveSound] = useSound(chessMovesSfx);
  const [chessCaptureSound] = useSound(chessCaptureSfx);

  const gameRef = doc(db, "games", "gameDoc");

  const numberMovesColumn = (moves) => {
    try {
      const plysToCountMove =
        moves.length % 2 === 0 ? moves.length / 2 : Math.ceil(moves.length / 2);

      const turnCount = Array.from(Array(plysToCountMove).keys())(
        (num) => num + 1
      );

      return turnCount.map((turn, i) => (
        <p key={i} style={{ color: "#bababa", fontSize: 20 }}>
          {turn}
        </p>
      ));
    } catch (error) {
      console.log("hmmmm", error);
    }
  };

  const evenMovesColumn = (moves) => {
    return moves
      .filter((square, i) => i % 2 === 0)
      .map((move, i) => (
        <p key={i} style={{ color: "#bababa", fontSize: 20 }}>
          {move}
        </p>
      ));
  };

  const oddMovesColumn = (moves) => {
    let oddMove = moves
      .filter((square, i) => i % 2 === 1)
      .map((move, i) => (
        <p key={i} style={{ color: "#bababa", fontSize: 20 }}>
          {move}
        </p>
      ));

    return oddMove;
  };

  const undoStep = async () => {
    const gameSnap = await getDoc(gameRef);
    const interChessBoard = new Chess();
    interChessBoard.load_pgn(gameSnap.data().pgn);

    const lastMove = interChessBoard.undo();
    if (lastMove === null) return;

    await updateDoc(gameRef, {
      undoMovesHistory: [...gameSnap.data().undoMovesHistory, lastMove],
      currentPosition: interChessBoard.fen(),
      pgn: interChessBoard.pgn(),
      gameHistory: interChessBoard.history(),
    });

    lastMove.flags === "c" || lastMove.flags === "e"
      ? chessCaptureSound()
      : chessMoveSound();
  };

  const redoStep = async () => {
    const gameSnap = await getDoc(gameRef);
    const interChessBoard = new Chess();
    interChessBoard.load_pgn(gameSnap.data().pgn);
    const tempUndoMoveHistory = [...gameSnap.data().undoMovesHistory];
    if (tempUndoMoveHistory.length === 0) return;
    const { flags, from, to } = tempUndoMoveHistory.pop();
    interChessBoard.move({ from, to });
    flags === "c" || flags === "e" ? chessCaptureSound() : chessMoveSound();

    await updateDoc(gameRef, {
      undoMovesHistory: tempUndoMoveHistory,
      currentPosition: interChessBoard.fen(),
      pgn: interChessBoard.pgn(),
      gameHistory: interChessBoard.history(),
    });
  };

  return (
    <Wrapper>
      <MovesContainer>
        <div
          style={{
            flex: 1,
            backgroundColor: "#302e2c",
            textAlign: "center",
            height: "100",
          }}
        >
          {numberMovesColumn(movesHistory)}
        </div>

        <div
          style={{
            flex: 2,
            marginLeft: 10,
          }}
        >
          {evenMovesColumn(movesHistory)}
        </div>

        <div style={{ flex: 2 }}>{oddMovesColumn(movesHistory)}</div>
      </MovesContainer>
      <ActionButtonsContainer>
        <ActionButton onClick={() => undoStep()}>👈</ActionButton>
        <ActionButton onClick={() => redoStep()}>👉</ActionButton>
      </ActionButtonsContainer>
    </Wrapper>
  );
};

export default MovesHistory;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 70px;
`;

const MovesContainer = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  background-color: #262421;
  height: 62vh;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  outline: none;
  font-size: 50px;
  &:hover {
    cursor: pointer;
  }
`;
