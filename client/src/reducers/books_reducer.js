import {
  BOOKS_FETCH,
  BOOKS_SORT,
  BOOK_CREATE,
  BOOK_UPDATE,
  BOOK_FETCH
} from "../actions/types";
import { mapKeys } from "lodash";

const initState = {
  books: {},
  maxBooksReturned: 0,
  totalBooksCount: 0
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case BOOKS_FETCH: {
      return {
        ...state,
        books: mapKeys(payload.books, "_id"),
        maxBooksReturned: payload.maxRecordsReturned,
        totalBooksCount: payload.totalRecords,
        booksFetched: true
      };
    }
    case BOOKS_SORT: {
      return {
        ...state,
        books: payload
      };
    }
    case BOOK_CREATE: {
      let temp = state.books;
      temp[payload._id] = {
        _id: payload._id,
        title: payload.title,
        author: payload.author,
        rating: payload.rating,
        ordinal: 9999
      };
      return {
        ...state,
        books: temp,
        totalBooksCount: state.totalBooksCount + 1
      };
    }
    case BOOK_UPDATE: {
      let temp = state.books;
      temp[payload._id] = {
        _id: payload._id,
        title: payload.title,
        thumbNail: payload.thumbNail,
        author: payload.author,
        rating: payload.rating,
        ordinal: payload.ordinal
      };

      return {
        ...state,
        books: temp
      };
    }

    case BOOK_FETCH: {
      return { ...state, [action.payload._id]: action.payload };
    }
    default:
      return state;
  }
}
