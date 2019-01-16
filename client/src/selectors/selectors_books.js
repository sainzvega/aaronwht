import { createSelector } from "reselect";

const books = state => state.books;
export const getBooks = createSelector(books, books => books);
