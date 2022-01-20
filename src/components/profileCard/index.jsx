import React from "react";
import styled from "styled-components";

const ProfileCard = () => {
  return (
    <Wrap>
      <Name>Carlos</Name>
      <Name>Ben</Name>
    </Wrap>
  );
};

export default ProfileCard;

const Wrap = styled.div`
  margin-right: 20px;
`;

const Name = styled.div`
  color: #bababa;
  padding: 10px;
  background-color: #262421;
`;
