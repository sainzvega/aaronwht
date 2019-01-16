import {
  BLOG_ARTICLES_FETCH,
  BLOG_ARTICLE_FETCH_BY_URL,
  BLOG_ARTICLE_FETCH,
  BLOG_ARTICLE_CREATE,
  BLOG_ARTICLE_UPDATE
} from "../actions/types";
import { mapKeys } from "lodash";
import moment from "moment";
import _ from "lodash";

const initState = {
  blogArticles: {},
  maxBlogArticlesReturned: 0,
  totalBlogArticlesCount: 0
};

function sortObjectListByDate(obj) {
  let list = [];
  let returnedObjects = {};

  Object.keys(obj).forEach(key => {
    list.push(obj[key]);
  });

  let updatedList = _
    .sortBy(list, (item) => {
      return moment(item.publishDate)
        .utc()
        .format("YYYYMMDD");
    })
    .reverse();

  updatedList.forEach(item => {
    returnedObjects[item._id] = item;
  });

  return returnedObjects;
}

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case BLOG_ARTICLES_FETCH: {
      return {
        ...state,
        blogArticles: mapKeys(payload.blogArticles, "_id"),
        maxBlogArticlesReturned: payload.maxRecordsReturned,
        totalBlogArticlesCount: payload.totalRecords,
        blogArticlesFetched: true
      };
    }
    case BLOG_ARTICLE_CREATE: {
      let temp = state.blogArticles;
      temp[payload._id] = {
        _id: payload._id,
        title: payload.title,
        publishDate: payload.publishDate,
        url: payload.url,
        isActive: payload.isActive
      };
      return {
        ...state,
        blogArticles: temp,
        totalBlogArticlesCount: state.totalRecords + 1
      };
    }
    case BLOG_ARTICLE_UPDATE: {
      let temp = { ...state.blogArticles };

      temp[payload._id] = {
        _id: payload._id,
        title: payload.title,
        publishDate: payload.publishDate,
        url: payload.url,
        isActive: payload.isActive
      };

      let sortedBlogArticles = sortObjectListByDate(temp);

      return {
        ...state,
        blogArticles: sortedBlogArticles
      };
    }
    case BLOG_ARTICLE_FETCH_BY_URL: {
      return { ...state, [action.payload.url]: action.payload };
    }
    case BLOG_ARTICLE_FETCH: {
      return { ...state, [action.payload._id]: action.payload };
    }
    default:
      return state;
  }
}
