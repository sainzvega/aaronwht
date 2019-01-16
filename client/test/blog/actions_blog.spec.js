import { mockstore } from "../setup";
import { expect } from "chai";
import axios from "axios";
import moxios from "moxios";
import * as types from "../../src/actions/types";
import * as actions from "../../src/actions/index";

describe("Actions BlogArticles ", function() {
  let store = mockstore({});

  beforeEach(function() {
    moxios.install(axios);
  });

  afterEach(function() {
    moxios.uninstall(axios);
    store.clearActions();
  });

  it("should fetch Blog successfully", function(done) {
    const mockBlog = {
      blogArticles: [
        {
          _id: 1,
          title: "Test Article 1",
          publishDate: "2018-04-21T07:00:00.000Z",
          url: "test-article-1"
        },
        {
          _id: 2,
          title: "Test Article 2",
          publishDate: "2018-04-21T07:00:00.000Z",
          url: "test-article-2"
        }
      ],
      maxRecordsReturned: 10,
      totalRecords: 2
    };
    let expectedActions = [
      { type: types.BLOG_ARTICLES_FETCH, payload: mockBlog }
    ];

    store.dispatch(actions.fetchBlogArticles());

    moxios.wait(function() {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: mockBlog
        })
        .then(function() {
          expect(store.getActions()).to.deep.equal(expectedActions);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });
});
