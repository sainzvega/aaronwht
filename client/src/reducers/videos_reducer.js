import {
  VIDEOS_FETCH,
  VIDEO_CREATE,
  VIDEO_UPDATE,
  VIDEO_FETCH
} from "../actions/types";
import { mapKeys } from "lodash";

const initState = {
  videos: {},
  maxVideosReturned: 0,
  totalVideosCount: 0
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case VIDEOS_FETCH: {
      return {
        ...state,
        videos: mapKeys(payload.videos, "_id"),
        maxVideosReturned: payload.maxRecordsReturned,
        totalVideosCount: payload.totalRecords
      };
    }
    case VIDEO_CREATE: {
      let temp = state.videos;
      temp[payload._id] = { _id: payload._id, content: payload.content };
      return {
        ...state,
        videos: temp,
        totalVideosCount: state.totalVideosCount + 1
      };
    }
    case VIDEO_UPDATE: {
      let temp = { ...state.videos };
      temp[payload._id] = {
        _id: payload._id,
        title: payload.title,
        url: payload.url,
        publishDate: payload.publishDate
      };
      return {
        ...state,
        videos: temp
      };
    }

    case VIDEO_FETCH: {
      return { ...state, [action.payload._id]: action.payload };
    }
    default:
      return state;
  }
}
