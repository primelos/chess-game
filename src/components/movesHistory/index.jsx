import React, { useState } from "react";
import styled from "styled-components";

const MovesHistory = ({ chessBoard }) => {
  console.log("chessBoard", chessBoard.history());

  const numberMovesColumn = (moves) => {
    try {
      const plysToCountMove =
        moves.length % 2 === 0 ? moves.length / 2 : Math.ceil(moves.length / 2);

      const turnCount = Array.from(Array(plysToCountMove).keys())(
        (num) => num + 1
      );
      return turnCount.map((turn) => (
        <p style={{ color: "#bababa", fontSize: 20 }}>{turn}</p>
      ));
    } catch (error) {
      console.log("hmmmm", error);
    }
  };

  const evenMovesColumn = (moves) => {
    return moves
      .filter((square, index) => index % 2 === 0)
      .map((move) => <p style={{ color: "#bababa", fontSize: 20 }}>{move}</p>);
  };

  const oddMovesColumn = (moves) => {
    return moves
      .filter((square, index) => index % 2 === 1)
      .map((move) => <p style={{ color: "#bababa", fontSize: 20 }}>{move}</p>);
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
    </Wrapper>
  );
};

export default MovesHistory;

const Wrapper = styled.div``;

const MovesContainer = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  background-color: #262421;
  height: 62vh;
`;
