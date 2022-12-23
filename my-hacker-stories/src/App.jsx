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

const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const App = () => {
  return (
    <div className="App">
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>
      <Search />
      <hr />
      <h2>Football Players</h2>
      <ul>
        {football.players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      <hr />
      <h2>My Hacker Stories</h2>
      <List />
    </div>
  );
};

const List = () => (
  <ul>
    {list.map((item) => {
      return <Item {...item} key={item.objectID} />;
    })}
  </ul>
);

const Item = (item) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

const Search = () => {
  const handleChange = (event) => {
    console.log(event);
    console.log(event.target.value);
  };
  const handleBlur = (event) => {
    console.log("blurred");
  };
  return (
    <>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
      ></input>
    </>
  );
};

export default App;
