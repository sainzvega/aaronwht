import { createSelector } from "reselect";

const blogArticles = state => state.blogArticles;
export const getBlogArticles = createSelector(
  blogArticles,
  blogArticles => blogArticles
);
