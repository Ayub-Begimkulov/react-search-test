import { isArray, isObject, isNumber, isString } from "utils";

export interface ISearchResult {
  id: number;
  name: string;
}

export const search = async (q: string) => {
  const response = await fetch(
    `https://api.savetime.net/v1/client/suggest/item?q=${encodeURIComponent(
      q
    )}&shopId=1184`
  );
  const data = await response.json();
  return searchResultAdapter(data);
};

// using adapter here to make sure that if something changes
// on the backend our app won't crash
const searchResultAdapter = (data: unknown): ISearchResult[] => {
  if (isObject(data) && isArray(data.items)) {
    return data.items
      .slice(0, 10) // reduce number of results, because `limit` params doesn't seem to work
      .filter(isObject)
      .map(val => ({
        id: isNumber(val.id) ? val.id : Math.random(),
        name: isString(val.name) ? val.name : "",
      }));
  }
  return [];
};
