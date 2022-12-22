import * as React from "react";

const welcome = {
  title: "React",
  greeting: "Hey",
};
const football = {
  players: [
    "Messi",
    "Cruyff",
    "Maradona",
    "Pelé",
    "Ronaldinho",
    "Rivaldo",
    "Ronaldo",
    "Xavi",
    "Iniesta",
  ],
};

function App() {
  return (
    <div className="App">
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>
      <h2>Football Players</h2>
      <ul>
        {football.players.map((player) => (
          <li>{player}</li>
        ))}
      </ul>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text"></input>
    </div>
  );
}

export default App;
