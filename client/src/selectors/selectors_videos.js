import { createSelector } from "reselect";

const videos = state => state.videos;
export const getVideos = createSelector(videos, videos => videos);
