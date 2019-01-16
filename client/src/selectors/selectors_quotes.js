import { createSelector } from "reselect";

const quotes = state => state.quotes;
export const getQuotes = createSelector(quotes, quotes => quotes);
