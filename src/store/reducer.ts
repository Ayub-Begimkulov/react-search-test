import { SearchActions } from "./actions";
import { AppEvents } from "./events";
import { ISearchResult } from "api/search";

interface ISearchState {
  query: string;
  results: ISearchResult[];
}

const initialState: ISearchState = {
  query: "",
  results: [],
};

export function searchReducer(
  state = initialState,
  action: SearchActions
): ISearchState {
  switch (action.type) {
    case AppEvents.SET_SEARCH_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case AppEvents.SET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    case AppEvents.CLEAR_SEARCH:
      return { ...state, query: "", results: [] };
    default:
      return state;
  }
}
