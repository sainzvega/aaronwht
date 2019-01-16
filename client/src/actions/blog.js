import axios from "axios";
import {
  BLOG_ARTICLES_FETCH,
  BLOG_ARTICLE_FETCH,
  BLOG_ARTICLE_FETCH_BY_URL,
  BLOG_ARTICLE_CREATE,
  BLOG_ARTICLE_UPDATE
} from "./types";

import { mapKeys } from "lodash";
import { config } from "../config";

export function fetchBlogArticles(page) {
  return (dispatch) => {
    axios.get(`${config.api()}blog/${page}`).then(returnedData => {
      dispatch(blogArticlesFetch(returnedData.data));
    });
  };
}

export function fetchAdminBlogArticles(page) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/blog/${page}`).then(returnedData => {
      let blogArticles = {};
      blogArticles.blogArticles = mapKeys(
        returnedData.data.blogArticles,
        "_id"
      );
      blogArticles.maxBlogArticlesReturned =
        returnedData.data.maxRecordsReturned;
      blogArticles.totalRecords = returnedData.data.totalRecords;
      dispatch(blogArticlesFetch(blogArticles));
    });
  };
}

export function searchAdminBlogByTitle(title) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/blog/find/${title}`).then(returnedData => {
      dispatch(blogArticlesFetch(returnedData.data));
    });
  };
}

export function searchBlogByTitle(title) {
  return (dispatch) => {
    axios.get(`${config.api()}blog/find/${title}`).then(returnedData => {
      dispatch(blogArticlesFetch(returnedData.data));
    });
  };
}

export function fetchBlogArticleByUrl(url) {
  return (dispatch) => {
    axios.get(`${config.api()}blog/article/${url}`).then(returnedData => {
      dispatch(blogArticleFetchByUrl(returnedData.data));
    });
  };
}

export function fetchAdminBlogArticle(id) {
  return (dispatch) => {
    axios.get(`${config.api()}admin/blog/article/${id}`).then(returnedData => {
      dispatch(blogArticleFetch(returnedData.data));
    });
  };
}

export function createOrUpdateBlogArticle(
  id,
  title,
  content,
  url,
  isActive,
  publishDate
) {
  return (dispatch) => {
    axios
      .post(`${config.api()}admin/blog/article/createOrUpdate`, {
        id,
        title,
        content,
        url,
        isActive,
        publishDate
      })
      .then(returnedData => {
        if (typeof id === "undefined") {
          let data = {};
          data._id = returnedData.data;
          data.title = title;
          data.publishDate = publishDate;
          data.url = url;
          data.isActive = isActive;

          dispatch(blogArticleCreate(data));
        } else {
          const payload = {
            _id: returnedData.data,
            title: title,
            url: url,
            isActive: isActive,
            publishDate: publishDate
          };
          dispatch(blogArticleUpdate(payload));
        }
      });
  };
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)
function blogArticlesFetch(blogArticles) {
  return {
    type: BLOG_ARTICLES_FETCH,
    payload: blogArticles
  };
}

function blogArticleFetch(blogArticle) {
  return {
    type: BLOG_ARTICLE_FETCH,
    payload: blogArticle
  };
}

function blogArticleFetchByUrl(blogArticle) {
  return {
    type: BLOG_ARTICLE_FETCH_BY_URL,
    payload: blogArticle
  };
}

function blogArticleCreate(blogArticle) {
  return {
    type: BLOG_ARTICLE_CREATE,
    payload: blogArticle
  };
}

function blogArticleUpdate(blogArticle) {
  return {
    type: BLOG_ARTICLE_UPDATE,
    payload: blogArticle
  };
}
