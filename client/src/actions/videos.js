import axios from "axios";
import { VIDEO_FETCH, VIDEOS_FETCH, VIDEO_CREATE, VIDEO_UPDATE } from "./types";
import { config } from "../config";

export function fetchAdminVideos(page) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/videos/${page}`).then(returnedData => {
      dispatch(videosFetch(returnedData.data));
    });
  };
}

export function fetchAdminVideo(id) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/video/${id}`).then(returnedData => {
      dispatch(videoFetch(returnedData.data));
    });
  };
}

export function fetchVideos(page) {
  return (dispatch) => {
    axios.get(`${config.api()}videos/${page}`).then(returnedData => {
      dispatch(videosFetch(returnedData.data));
    });
  };
}

export function createOrUpdateVideo(
  id,
  title,
  url,
  videoUrl,
  content,
  people,
  mainVideo,
  publishDate
) {
  return (dispatch) => {
    axios
      .post(`${config.api()}admin/video/createOrUpdate`, {
        id,
        title,
        url,
        videoUrl,
        content,
        people,
        mainVideo,
        publishDate
      })
      .then(returnedData => {
        if (typeof id === "undefined") {
          let data = {};
          data._id = returnedData.data;
          data.title = title;
          data.url = url;
          data.videoUrl = videoUrl;
          data.content = content;
          data.people = people;
          data.mainVideo = mainVideo;
          data.publishDate = publishDate;
          dispatch(videoCreate(data));
        } else {
          const payload = {
            _id: returnedData.data,
            title: title,
            url: url,
            videoUrl: videoUrl,
            content: content,
            people: people,
            mainVideo: mainVideo,
            publishDate: publishDate
          };

          dispatch(videoUpdate(payload));
        }
      });
  };
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)

function videosFetch(videos) {
  return {
    type: VIDEOS_FETCH,
    payload: videos
  };
}

function videoFetch(quote) {
  return {
    type: VIDEO_FETCH,
    payload: quote
  };
}

function videoCreate(video) {
  return {
    type: VIDEO_CREATE,
    payload: video
  };
}

function videoUpdate(video) {
  return {
    type: VIDEO_UPDATE,
    payload: video
  };
}
