import React from "react";
import { spy } from "sinon";
import { expect } from "chai";
import { shallow } from "enzyme";
import { BlogArticle } from "../../src/components/BlogArticle";

describe("Component <BlogArticle />", function() {
  let component,
    props,
    fetchBlogArticleByUrl = spy();

  beforeEach(function() {
    component = undefined;
    fetchBlogArticleByUrl.resetHistory();
    props = { fetchBlogArticleByUrl };
  });

  it("fetches blog article on mount", function() {
    component = shallow(<BlogArticle {...props} />);
    expect(fetchBlogArticleByUrl.calledOnce).to.be.true;
  });
});
