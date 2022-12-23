import * as React from "react";

const App = () => {
  console.log("App renders");
  const stories = [
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
    {
      title: "Realololo",
      objectID: 2,
    },
  ];
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") || ""
  );

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  let filteredStories = stories.filter((story) => {
    return story.title.toLowerCase().match(searchTerm.toLowerCase());
  });

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>
      <hr />
      <Search search={searchTerm} onSearch={handleSearch} />
      <List list={filteredStories} />
    </div>
  );
};

const List = ({ list }) => {
  console.log("List renders");
  return (
    <ul>
      {list.map(({ objectID, ...item }) => {
        return <Item {...item} key={objectID} />;
      })}
    </ul>
  );
};

const Item = ({ title, url, author, num_comments, points }) => {
  // console.log("Item renders");
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </li>
  );
};

const Search = ({ search, onSearch }) => {
  console.log("Search renders");

  return (
    <>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        value={search}
        onChange={onSearch}
        autoComplete="off"
      ></input>
    </>
  );
};

export default App;
