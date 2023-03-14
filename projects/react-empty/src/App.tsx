import styled from "@emotion/styled";

const Wrapper = styled.div`
  font-family: sans-serif;
  width: 800px;
  margin: 2em;
`;

const Header = styled.h1`
  font-size: 1.5em;
  color: #333;
`;

export function App() {
  return (
    <Wrapper>
      <Header>empty</Header>
    </Wrapper>
  );
}
