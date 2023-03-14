import styled from "@emotion/styled";
import * as d3 from "d3";
import * as lodash from "lodash";
import * as moment from "moment";
import * as rxjs from "rxjs";
import * as three from "three";

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
      <Header>libraries</Header>
      {Object.entries({...d3,  ...lodash, ...moment, ...rxjs, ...three}).map(([key, value]) => (
        <div key={key}>{`${key}: ${typeof value}`}</div>
      ))}
    </Wrapper>
  );
}
