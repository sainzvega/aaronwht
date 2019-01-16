import axios from 'axios';
import { QUOTE_FETCH, QUOTES_FETCH, QUOTE_CREATE, QUOTE_UPDATE } from './types';
import { config } from '../config';

export function fetchAdminQuote(id) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/quote/${id}`).then(returnedData => {
      dispatch(quoteFetch(returnedData.data))
    })
  };
}

export function fetchQuotes(page) {
  return (dispatch) => {
    axios.get(`${config.api()}quotes/${page}`).then(returnedData => {
      dispatch(quotesFetch(returnedData.data))
    })
  };
}

export function createOrUpdateQuote(id, authorId, author, content) {
  return (dispatch) => {
    axios
      .post(`${config.api()}admin/quote/createOrUpdate`, {
        id,
        authorId,
        author,
        content
      })
      .then(returnedData => {
        if (typeof id === 'undefined') {
          let data = {}
          data._id = returnedData.data
          data.authorId = authorId
          data.author = author
          data.content = content

          dispatch(quoteCreate(data))
        } else {
          const payload = {
            _id: returnedData.data,
            authorId: authorId,
            author: author,
            content: content
          }

          dispatch(quoteUpdate(payload))
        }
      })
  };
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)

function quotesFetch(quotes) {
  return {
    type: QUOTES_FETCH,
    payload: quotes
  }
}

function quoteFetch(quote) {
  return {
    type: QUOTE_FETCH,
    payload: quote
  }
}

function quoteCreate(quote) {
  return {
    type: QUOTE_CREATE,
    payload: quote
  }
}

function quoteUpdate(quote) {
  return {
    type: QUOTE_UPDATE,
    payload: quote
  }
}
