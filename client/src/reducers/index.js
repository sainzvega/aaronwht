import { combineReducers } from "redux";
// import { reducer as form } from 'redux-form';
import Authors from "./authors_reducer";
import authReducer from "./auth_reducer";
import BlogArticles from "./blog_articles_reducer";
import Books from "./books_reducer";
import Quotes from "./quotes_reducer";
import Videos from "./videos_reducer";
import Homepage from "./homepage_reducer";

const rootReducer = combineReducers({
  authors: Authors,
  blogArticles: BlogArticles,
  books: Books,
  quotes: Quotes,
  videos: Videos,
  homepage: Homepage,
  auth: authReducer
});

export default rootReducer;
