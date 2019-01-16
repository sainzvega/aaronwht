import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signoutUser } from "../actions";
import { Container, Menu } from "semantic-ui-react";

class Header extends Component {
  render() {
    // console.log(this.props.location.pathname);
    // console.log(this.props);
    return (
      <div style={{ paddingBottom: "40px" }}>
        <Menu
          fixed="top"
          borderless
          inverted={true}
          pointing={true}
          color="blue"
        >
          <Container>
            <Link key="header_home" to="/" className="item">
              Home
            </Link>
            <Link to="/blog" key="header_blog" className="item">
              Blog
            </Link>
            <Link to="/books" key="header_books" className="item">
              Books
            </Link>
            <Link to="/quotes" key="header_quotes" className="item">
              Quotes
            </Link>
            <Link to="/videos" key="header_videos" className="item">
              Videos
            </Link>
            <Link to="/about-me" key="header_about" className="item">
              About Me
            </Link>
          </Container>
        </Menu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(
  mapStateToProps,
  { signoutUser }
)(Header);
