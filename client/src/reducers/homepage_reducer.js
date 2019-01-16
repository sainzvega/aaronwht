import { HOMEPAGE_FETCH } from "../actions/types";

const initState = {
  blogArticles: {},
  featuredBlogArticle: {},
  homepageFetched: false
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case HOMEPAGE_FETCH: {
      return {
        ...state,
        featuredBlogArticle: payload.featuredBlogArticle,
        blogArticles: payload.blogArticles,
        quote: payload.quote,
        homepageFetched: true
      };
    }
    default:
      return state;
  }
}
