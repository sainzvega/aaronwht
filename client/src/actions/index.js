import axios from "axios";
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, HOMEPAGE_FETCH } from "./types";
import { mapKeys } from "lodash";
import { config } from "../config";

export function signinUser(email, password, history) {
  return (dispatch) => {
    axios
      .post(`${config.api()}signin`, { email, password })
      .then(response => {
        dispatch(authUser());

        localStorage.setItem("token", response.data.token);
        if (history) history.push("/");
      })
      .catch(error => {
        dispatch(authError(error.response.data.error));
      });
  };
}

export function checkAuthentication() {
  return (dispatch) => {
    dispatch(authUser());
  };
}

export function signupUser(email, password, history) {
  return (dispatch) => {
    axios
      .post(`${config.api()}signup`, { email, password })
      .then(response => {
        dispatch(authUser());
        localStorage.setItem("token", response.data.token);
        if (history) history.push("/");
      })
      .catch(error => {
        dispatch(authError(error.response.data.error));
      });
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser(history) {
  localStorage.removeItem("token");
  return (dispatch) => {
    dispatch(unAuthUser());
    if (history) history.push("/");
  };
}

export function fetchHomepage() {
  return (dispatch) => {
    axios.get(`${config.api()}homepage`).then(returnedData => {
      let homepage = {};
      homepage.featuredBlogArticle = returnedData.data.featuredBlogArticle;
      homepage.blogArticles = mapKeys(returnedData.data.blogArticles, "_id");
      homepage.quote = returnedData.data.quote;
      dispatch(homepageFetch(homepage));
    });
  };
}
// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)

function homepageFetch(homepage) {
  return {
    type: HOMEPAGE_FETCH,
    payload: homepage
  };
}

function authUser() {
  return {
    type: AUTH_USER
  };
}

function unAuthUser() {
  return {
    type: UNAUTH_USER
  };
}
