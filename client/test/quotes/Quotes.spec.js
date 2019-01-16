import React from "react";
import { spy } from "sinon";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Quotes } from "../../src/components/Quotes";

describe("Component <Quotes />", function() {
  let component,
    props,
    fetchQuotes = spy();

  beforeEach(function() {
    component = undefined;
    fetchQuotes.resetHistory();
    props = { fetchQuotes };
  });

  it("fetches data on mount", function() {
    component = shallow(<Quotes {...props} />);
    expect(fetchQuotes.calledOnce).to.be.true;
  });
});
