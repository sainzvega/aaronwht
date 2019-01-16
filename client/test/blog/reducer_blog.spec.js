import { expect } from "chai";
import * as types from "../../src/actions/types";
import reducer, { initState } from "../../src/reducers/blog_articles_reducer";
import { mapKeys } from "lodash";

describe("Reducer Blog", function() {
  let blogArticles;

  beforeEach(function() {
    blogArticles = [{ _id: 1 }, { _id: 2 }];
  });

  it("should handle BLOG_ARTICLES_FETCH", function() {
    const mockAction = {
      type: types.BLOG_ARTICLES_FETCH,
      payload: {
        blogArticles,
        maxRecordsReturned: 10,
        totalRecords: 2,
        blogArticlesFetched: true
      }
    };
    const expectedState = {
      blogArticles: mapKeys(blogArticles, "_id"),
      maxBlogArticlesReturned: 10,
      totalBlogArticlesCount: 2,
      blogArticlesFetched: true
    };
    expect(reducer(initState, mockAction)).to.deep.equal(expectedState);
  });
});
