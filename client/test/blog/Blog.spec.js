import React from "react";
import { spy } from "sinon";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Blog } from "../../src/components/Blog";

describe("Component <Blog />", function() {
  let component,
    props,
    fetchBlogArticles = spy();

  beforeEach(function() {
    component = undefined;
    fetchBlogArticles.resetHistory();
    props = { fetchBlogArticles };
  });

  it("fetches data on mount", function() {
    component = shallow(<Blog {...props} />);
    expect(fetchBlogArticles.calledOnce).to.be.true;
  });
});
