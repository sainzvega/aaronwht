import {
  QUOTES_FETCH,
  QUOTE_CREATE,
  QUOTE_UPDATE,
  QUOTE_FETCH
} from "../actions/types";
import { mapKeys } from "lodash";

const initState = {
  quotes: {},
  maxQuotesReturned: 0,
  totalQuotesCount: 0
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case QUOTES_FETCH: {
      return {
        ...state,
        quotes: mapKeys(payload.quotes, "_id"),
        maxQuotesReturned: payload.maxRecordsReturned,
        totalQuotesCount: payload.totalRecords
      };
    }
    case QUOTE_CREATE: {
      let temp = state.quotes;
      temp[payload._id] = { _id: payload._id, content: payload.content };
      return {
        ...state,
        quotes: temp,
        totalQuotesCount: state.totalQuotesCount + 1
      };
    }
    case QUOTE_UPDATE: {
      let temp = { ...state.quotes };
      temp[payload._id] = {
        _id: payload._id,
        content: payload.content,
        author: payload.author
      };
      return {
        ...state,
        quotes: temp
      };
    }

    case QUOTE_FETCH: {
      return { ...state, [action.payload._id]: action.payload };
    }
    default:
      return state;
  }
}
