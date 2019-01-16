import {
  AUTHORS_FETCH,
  AUTHOR_CREATE,
  AUTHOR_UPDATE,
  AUTHOR_FETCH
} from "../actions/types";
import { mapKeys } from "lodash";

const initState = {
  authors: {},
  maxAuthorsReturned: 0,
  totalAuthorsCount: 0
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AUTHORS_FETCH: {
      return {
        ...state,
        authors: mapKeys(payload.authors, "_id"),
        maxAuthorsReturned: payload.maxRecordsReturned,
        totalAuthorsCount: payload.totalRecords
      };
    }
    case AUTHOR_CREATE: {
      let temp = state.authors;
      temp[payload._id] = {
        _id: payload._id,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        fullName: payload.fullName
      };
      return {
        ...state,
        authors: temp,
        totalAuthorsCount: state.totalAuthorsCount + 1
      };
    }
    case AUTHOR_UPDATE: {
      let temp = { ...state.authors };
      temp[payload._id] = {
        _id: payload._id,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        fullName: payload.fullName
      };
      return {
        ...state,
        authors: temp
      };
    }

    case AUTHOR_FETCH: {
      return { ...state, [action.payload._id]: action.payload };
    }
    default:
      return state;
  }
}
