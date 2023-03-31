import styled from "@emotion/styled";
import * as components from "./components"

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
      <Header>synthetic</Header>
      {Object.entries(components).map(([key, value]) => (
        <div key={key}>{`${key}: ${typeof value}`}</div>
      ))}
    </Wrapper>
  );
}
