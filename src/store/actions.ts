import { AnyFunction } from "types";
import { AppEvents } from "./events";
import { Dispatch } from "redux";
import { search as apiSearch, ISearchResult } from "api/search";

type ActionUnion<A extends Record<string, AnyFunction>> = ReturnType<
  A[keyof A]
>;

type ActionCreator<T, P> = (payload: P) => { type: T; payload: P };
type ActionCreatorWithoutPayload<T> = () => { type: T };

export function makeAction<T extends AppEvents>(
  type: T
): ActionCreatorWithoutPayload<T>;
export function makeAction<T extends AppEvents, P>(
  type: T
): ActionCreator<T, P>;
export function makeAction<T extends AppEvents, P>(type: T) {
  return function (payload?: P) {
    return { type, payload };
  };
}

export const setSearchQuery = makeAction<AppEvents.SET_SEARCH_QUERY, string>(
  AppEvents.SET_SEARCH_QUERY
);

export const setSearchResults = makeAction<
  AppEvents.SET_SEARCH_RESULTS,
  ISearchResult[]
>(AppEvents.SET_SEARCH_RESULTS);

export const clearSearch = makeAction(AppEvents.CLEAR_SEARCH);

const actions = {
  setSearchQuery,
  setSearchResults,
  clearSearch,
};

export type SearchActions = ActionUnion<typeof actions>;

// async actions
export const searchByQuery = (query: string) => {
  return async (dispatch: Dispatch<SearchActions>) => {
    try {
      const result = await apiSearch(query);
      dispatch(setSearchResults(result));
    } catch (e) {
      console.error(e);
    }
  };
};
