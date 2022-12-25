import * as React from "react";
import MyDropdown from "./reusable components/MyDropdown.jsx";
import { MyRadioGroup } from "./reusable components/MyRadio.jsx";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) ?? initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};
const App = () => {
  console.log("App renders");
  const initialStories = [
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
  const drones = ["huey", "dewey", "louie"];
  const pets = ["dog", "cat", "hamster", "parrot", "spider", "goldfish"];

  const getAsyncStories = () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );
  };

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    getAsyncStories().then((result) => {
      setStories(result.data.stories);
    });
  }, []);

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }
  function handleRemoveStory(id) {
    setStories(stories.filter((story) => story.objectID !== id));
  }

  let filteredStories = stories.filter((story) => {
    return story.title.toLowerCase().match(searchTerm.toLowerCase());
  });

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>
      <hr />
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <List list={filteredStories} onRemoveItem={handleRemoveStory} />
      <MyRadioGroup name="drone" options={drones}>
        <strong>Select a maintenance drone:</strong>
      </MyRadioGroup>
      <MyDropdown id="pet-select" options={pets}>
        <strong>Choose a pet: </strong>
      </MyDropdown>
    </div>
  );
};

const List = ({ list, onRemoveItem }) => {
  console.log("List renders");
  return (
    <ul>
      {list.map((item) => {
        return (
          <Item {...item} key={item.objectID} onRemoveItem={onRemoveItem} />
        );
      })}
    </ul>
  );
};

const Item = ({
  title,
  objectID,
  url,
  author,
  num_comments,
  points,
  onRemoveItem,
}) => {
  // console.log("Item renders");
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
      <button onClick={() => onRemoveItem(objectID)}>Remove</button>
    </li>
  );
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  autoComplete = "off",
  onInputChange,
  children,
  isFocused,
}) => {
  console.log("Search renders");

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        autoComplete={autoComplete}
        autoFocus={isFocused}
      ></input>
    </>
  );
};

export default App;
