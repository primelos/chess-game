import React, { useState } from "react";
import styled from "styled-components";

const MovesHistory = ({ chessBoard, setPosition }) => {
  // console.log("chessBoard", chessBoard.history());
  const [undoMovesHistory, setUndoMovesHistory] = useState([]);
  const numberMovesColumn = (moves) => {
    try {
      const plysToCountMove =
        moves.length % 2 === 0 ? moves.length / 2 : Math.ceil(moves.length / 2);
      console.log("plysToCountMove", plysToCountMove);

      const turnCount = Array.from(Array(plysToCountMove).keys())(
        (num) => num + 1
      );
      console.log("turnCount", turnCount);

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

  const undoStep = () => {
    const lastMove = chessBoard.undo();

    if (lastMove === null) return;
    setUndoMovesHistory([...undoMovesHistory, lastMove]);
    setPosition(chessBoard.fen());
  };

  const redoStep = () => {
    const tempUndoMoveHistory = [...undoMovesHistory];
    if (tempUndoMoveHistory.length === 0) return;

    const { flags, from, to } = tempUndoMoveHistory.pop();

    chessBoard.move({ from, to });
    setPosition(chessBoard.fen());
    setUndoMovesHistory(tempUndoMoveHistory);
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
          {numberMovesColumn(chessBoard.history())}
        </div>

        <div
          style={{
            flex: 2,
            marginLeft: 10,
          }}
        >
          {evenMovesColumn(chessBoard.history())}
        </div>

        <div style={{ flex: 2 }}>{oddMovesColumn(chessBoard.history())}</div>
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
