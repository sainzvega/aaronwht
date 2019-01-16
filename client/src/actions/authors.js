import axios from "axios";
import {
  AUTHOR_FETCH,
  AUTHORS_FETCH,
  AUTHOR_CREATE,
  AUTHOR_UPDATE
} from "./types";

import { config } from "../config";

export function fetchAdminAuthors(page) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/authors/${page}`).then(returnedData => {
      dispatch(authorsFetch(returnedData.data));
    });
  };
}

export function fetchAdminAuthor(id) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/author/${id}`).then(returnedData => {
      dispatch(authorFetch(returnedData.data));
    });
  };
}

export function createOrUpdateAuthor(id, firstName, middleName, lastName) {
  return (dispatch) => {
    axios
      .post(`${config.api()}admin/author/createOrUpdate`, {
        id,
        firstName,
        middleName,
        lastName
      })
      .then(returnedData => {
        if (typeof id === "undefined") {
          let data = {};
          data._id = returnedData.data;
          data.firstName = firstName;
          data.middleName = middleName;
          data.lastName = lastName;

          dispatch(authorCreate(data));
        } else {
          const payload = {
            _id: returnedData.data,
            firstName,
            middleName,
            lastName
          };

          dispatch(authorUpdate(payload));
        }
      });
  };
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)
function authorsFetch(authors) {
  return {
    type: AUTHORS_FETCH,
    payload: authors
  };
}

function authorFetch(author) {
  return {
    type: AUTHOR_FETCH,
    payload: author
  };
}

function authorCreate(author) {
  return {
    type: AUTHOR_CREATE,
    payload: author
  };
}

function authorUpdate(author) {
  return {
    type: AUTHOR_UPDATE,
    payload: author
  };
}
