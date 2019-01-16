/* global localStorage */
import "babel-polyfill"; // required for async/await compilation to NODEenv
import "mock-local-storage";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });
// Tell mocha to ignore image and css module imports
function noop() {
  return null;
}
require.extensions[".css"] = noop;
require.extensions[".png"] = noop;

// rendering helper funcs
const middlewares = [thunk];
export const mockstore = configureStore(middlewares);

// JSDOM setup
const { JSDOM } = require("jsdom");
const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

window.localStorage = global.localStorage;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js"
};
// TEMP FIX: https://github.com/chaijs/type-detect/issues/98
global.HTMLElement = window.HTMLElement;
copyProps(window, global);
