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

const getSumComments = (stories) => {
  console.log("getSumComments computation");
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

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

  // The list passed to the List component is the same, but the onRemoveItem callback handler isn't. If the App component re-renders, it always creates a new version of this callback handler as a new function.
  // Since the callback handler gets the id passed as an argument in its function signature, it doesn't have any dependencies and is declared only once when the App component initially renders. None of the props passed to the List component should change now.
  const handleRemoveStory = React.useCallback((id) => {
    dispatchStories({
      type: actions.removeStory,
      payload: id,
    });
  }, []);

  const handleSearchInput = React.useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchSubmit = React.useCallback((event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }, []);

  // example of a performance-intensive computation before component return
  // We can tell React to only run a function if one of its dependencies has changed. If no dependency changed, the result of the function stays the same. React's useMemo Hook helps us here:
  const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

  return (
    <div className="container">
      <h1 className="headline-primary">
        My Hacker Stories <FaReact /> with {sumComments} comments.
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

const SearchForm = React.memo(
  ({ searchTerm, onSearchInput, onSearchSubmit, buttonSizeClass }) => {
    console.log("SearchForm renders");
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
  }
);

// to make an equality check on the list, so it doesn't re-render every time App re-renders (when typing in search bar) if the list didn't change
// React's memo API checks whether the props of a component have changed. If not, it does not re-render even though its parent component re-rendered. See handleRemoveStory
const List = React.memo(({ list, onRemoveItem }) => {
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
});

const Item = React.memo(
  ({ title, objectID, url, author, num_comments, points, onRemoveItem }) => {
    console.log("Item renders");
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
  }
);

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
