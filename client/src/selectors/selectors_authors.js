import { createSelector } from "reselect";

const authors = state => state.authors;
export const getAuthors = createSelector(authors, authors => authors);
