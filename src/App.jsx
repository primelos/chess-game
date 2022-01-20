import { useState } from "react";
import styled from "styled-components";
import Chessboard from "chessboardjsx";
import * as Chess from "chess.js";
import ProfileCard from "./components/profileCard";
import MovesHistory from "./components/movesHistory";

const startingPosition =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function App() {
  const [position, setPosition] = useState(startingPosition);

  const [chessBoard] = useState(new Chess());

  console.log(position);

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
      <MovesHistory chessBoard={chessBoard} />
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
