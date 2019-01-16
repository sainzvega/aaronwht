import axios from "axios";
import {
  BOOKS_FETCH,
  BOOKS_SORT,
  BOOK_FETCH,
  BOOK_CREATE,
  BOOK_UPDATE
} from "./types";

import { config } from "../config";

export function fetchBooks(page) {
  return (dispatch) => {
    axios.get(`${config.api()}books/${page}`).then(returnedData => {
      dispatch(booksFetch(returnedData.data));
    });
  };
}

export function fetchBook(id) {
  return (dispatch) => {
    axios.get(`${config.api()}book/${id}`).then(returnedData => {
      dispatch(bookFetch(returnedData.data));
    });
  };
}

export function sortBooks(books) {
  return (dispatch) => {
    axios.post(`${config.api()}admin/books/updateDisplayOrder`, books);
    dispatch(booksSort(books));
  };
}

export function createOrUpdateBook(
  id,
  authorId,
  title,
  author,
  purchaseUrl,
  rating,
  ordinal
) {
  return (dispatch) => {
    axios
      .post(`${config.api()}admin/book/createOrUpdate`, {
        id,
        authorId,
        title,
        author,
        purchaseUrl,
        rating,
        ordinal
      })
      .then(returnedData => {
        if (typeof id === "undefined") {
          let data = {};
          data._id = returnedData.data;
          data.authorId = authorId;
          data.title = title;
          data.author = author;
          data.purchaseUrl = purchaseUrl;
          data.rating = rating;
          data.ordinal = ordinal;

          dispatch(bookCreate(data));
        } else {
          const payload = {
            _id: returnedData.data,
            authorId: authorId,
            title: title,
            purchaseUrl: purchaseUrl,
            author: author,
            ordinal: ordinal
          };
          dispatch(bookUpdate(payload));
        }
      });
  };
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)
function bookFetch(book) {
  return {
    type: BOOK_FETCH,
    payload: book
  };
}

function booksFetch(book) {
  return {
    type: BOOKS_FETCH,
    payload: book
  };
}

function booksSort(books) {
  return {
    type: BOOKS_SORT,
    payload: books
  };
}

function bookCreate(book) {
  return {
    type: BOOK_CREATE,
    payload: book
  };
}

function bookUpdate(book) {
  return {
    type: BOOK_UPDATE,
    payload: book
  };
}
