import * as React from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) ?? initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  console.log("App renders");
  // const initialStories = [
  //   {
  //     title: "React",
  //     url: "https://reactjs.org/",
  //     author: "Jordan Walke",
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },
  //   {
  //     title: "Redux",
  //     url: "https://redux.js.org/",
  //     author: "Dan Abramov, Andrew Clark",
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  //   },
  //   {
  //     title: "Realololo",
  //     objectID: 2,
  //   },
  // ];

  const actions = {
    storiesFetchInit: "STORIES_FETCH_INIT",
    storiesFetchSuccess: "STORIES_FETCH_SUCCESS",
    storiesFetchFailure: "STORIES_FETCH_FAILURE",
    removeStory: "REMOVE_STORY",
  };

  // const getAsyncStories = () => {
  // return new Promise((resolve) =>
  //   setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  // );
  // };
  // const getAsyncStories = () =>
  //   new Promise((resolve, reject) => setTimeout(reject, 2000));

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

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  // ********** useState *********** //
  // const [stories, setStories] = React.useState([]);
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false);
  // ******************************* //

  // ********** useReducer ********* //
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  }); // (reducer action, initial state) => (current state, state updater function)
  // ******************************* //

  React.useEffect(() => {
    if (!searchTerm) return;
    // setIsLoading(true);
    dispatchStories({ type: actions.storiesFetchInit });
    // getAsyncStories()
    //   .then((result) => {
    //     // setStories(result.data.stories);
    //     dispatchStories({
    //       type: "STORIES_FETCH_SUCCESS",
    //       payload: result.data.stories,
    //     });
    //     // setIsLoading(false);
    //   })
    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: actions.storiesFetchSuccess,
          payload: result.hits,
        });
      })
      .catch((error) => {
        // setIsError(true);
        dispatchStories({
          type: actions.storiesFetchFailure,
        });
        console.log(error);
      });
  }, [searchTerm]);

  function handleRemoveStory(id) {
    // setStories(stories.filter((story) => story.objectID !== id));
    dispatchStories({
      type: actions.removeStory,
      payload: id,
    });
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  // let searchedStories = stories.data.filter((story) => {
  //   return story.title.toLowerCase().match(searchTerm.toLowerCase());
  // });

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
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>loading stories...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
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
