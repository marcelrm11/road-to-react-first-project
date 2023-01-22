import * as React from "react";
import axios from "axios";
import "./App.css";

import { ReactComponent as Check } from "./check.svg";
import { ReactComponent as Search } from "./search.svg";
import { FaReact } from "react-icons/fa";

const actions = {
  storiesFetchInit: "STORIES_FETCH_INIT",
  storiesFetchSuccess: "STORIES_FETCH_SUCCESS",
  storiesFetchFailure: "STORIES_FETCH_FAILURE",
  removeStory: "REMOVE_STORY",
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case actions.storiesFetchInit:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case actions.storiesFetchSuccess:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case actions.storiesFetchFailure:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case actions.removeStory:
      return {
        ...state,
        data: state.data.filter((story) => story.objectID !== action.payload),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  // useRef not to run useStorage on first render
  const isMounted = React.useRef(false);
  const [value, setValue] = React.useState(
    localStorage.getItem(key) ?? initialState
  );
  React.useEffect(() => {
    if (!isMounted.current) {
      // first render
      isMounted.current = true;
    } else {
      // re-renders
      console.log("useStorage");
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  console.log("App renders");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  // ********** useReducer ********* //
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  }); // (reducer action, initial state) => (current state, state updater function)
  // ******************************* //

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: actions.storiesFetchInit }); // loading true
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: actions.storiesFetchSuccess,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: actions.storiesFetchFailure,
      });
    }
  }, [url]);
  React.useEffect(() => {
    console.log("How many times do I log?");
    handleFetchStories();
  }, [handleFetchStories]);

  function handleRemoveStory(id) {
    dispatchStories({
      type: actions.removeStory,
      payload: id,
    });
  }

  function handleSearchInput(event) {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="headline-primary">
        My Hacker Stories <FaReact />
      </h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        buttonSizeClass="button_large"
      />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>loading stories...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  buttonSizeClass,
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={onSearchInput}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <button
        type="submit"
        disabled={!searchTerm}
        className={`button ${buttonSizeClass}`}
      >
        <Search height="18px" width="18px" />
      </button>
    </form>
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
  return (
    <li className="item">
      <span style={{ width: "40%" }}>
        <a href={url}>{title}</a>
      </span>
      <span style={{ width: "30%" }}>{author}</span>
      <span style={{ width: "10%" }}>{num_comments}</span>
      <span style={{ width: "10%" }}>{points}</span>
      <span style={{ width: "10%" }}>
        <button
          type="button"
          onClick={() => onRemoveItem(objectID)}
          className="button button_small"
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
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
  // console.log("Search renders");

  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        autoComplete={autoComplete}
        autoFocus={isFocused}
        className="input"
      ></input>
    </>
  );
};

export default App;
