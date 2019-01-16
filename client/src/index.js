import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { checkAuthentication } from "./actions";
import thunk from "redux-thunk";
import Homepage from "./components/Homepage";
import GA from "./components/utilities/GoogleAnalytics";
import Loadable from "react-loadable";
// import RequireAuth from './components/auth/require_auth';

import AboutMe from "./components/AboutMe";
import ContactMe from "./components/ContactMe";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Signin from "./components/auth/signin";
import Signout from "./components/auth/signout";
import Signup from "./components/auth/signup";

import Blog from "./components/Blog";
import Books from "./components/Books";
import BlogArticle from "./components/BlogArticle";
import Quotes from "./components/Quotes";
import Videos from "./components/Videos";
import PageNotFound from "./components/PageNotFound";

import reducers from "./reducers";

import "./static/semantic.min.css";
import "./static/default.css";
import "./static/custom.css";

const Loading = () => <div />;
const Admin = Loadable({
  loader: () => import("./components/admin/Admin"),
  loading: Loading
});
const AdminAuthors = Loadable({
  loader: () => import("./components/admin/Authors"),
  loading: Loading
});
const AdminAuthor = Loadable({
  loader: () => import("./components/admin/Author"),
  loading: Loading
});
const AdminBlog = Loadable({
  loader: () => import("./components/admin/Blog"),
  loading: Loading
});
const AdminBlogArticle = Loadable({
  loader: () => import("./components/admin/BlogArticle"),
  loading: Loading
});

const AdminBooks = Loadable({
  loader: () => import("./components/admin/Books"),
  loading: Loading
});
const AdminBook = Loadable({
  loader: () => import("./components/admin/Book"),
  loading: Loading
});

const AdminTest = Loadable({
  loader: () => import("./components/admin/Test"),
  loading: Loading
});

const AdminQuotes = Loadable({
  loader: () => import("./components/admin/Quotes"),
  loading: Loading
});
const AdminQuote = Loadable({
  loader: () => import("./components/admin/Quote"),
  loading: Loading
});
const AdminVideos = Loadable({
  loader: () => import("./components/admin/Videos"),
  loading: Loading
});
const AdminVideo = Loadable({
  loader: () => import("./components/admin/Video"),
  loading: Loading
});

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// const store = createStoreWithMiddleware(reducers);
const store = createStoreWithMiddleware(
  reducers,
  process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
);

const token = localStorage.getItem("token");
if (token) {
  store.dispatch(checkAuthentication());
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div className="template">
        {GA.init() && <GA.RouteTracker />}
        <Header />
        <Switch>
          <Route path="/blog/:id" component={BlogArticle} />
          <Route path="/blog" exact component={Blog} />
          <Route path="/contact-me" exact component={ContactMe} />
          <Route path="/about-me" exact component={AboutMe} />
          <Route path="/videos/:url?" component={Videos} />
          <Route path="/quotes" exact component={Quotes} />
          <Route path="/books" exact component={Books} />

          <Route path="/admin/blog/article/:id?" component={AdminBlogArticle} />
          <Route path="/admin/blog" exact component={AdminBlog} />

          <Route path="/admin/books/" exact component={AdminBooks} />
          <Route path="/admin/book/:id?" component={AdminBook} />
          <Route path="/admin/test" component={AdminTest} />

          <Route path="/admin/authors/" exact component={AdminAuthors} />
          <Route path="/admin/author/:id?" component={AdminAuthor} />

          <Route path="/admin/quotes/" exact component={AdminQuotes} />
          <Route path="/admin/quote/:id?" component={AdminQuote} />

          <Route path="/admin/videos/" exact component={AdminVideos} />
          <Route path="/admin/video/:id?" component={AdminVideo} />
          <Route path="/admin/" exact component={Admin} />

          <Route path="/signup" exact component={Signup} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signout" exact component={Signout} />

          <Route path="/" exact component={Homepage} />
          <Route path="/index.html" exact component={Homepage} />


          <Route component={PageNotFound} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
