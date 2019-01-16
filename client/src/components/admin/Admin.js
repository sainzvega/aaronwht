import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signoutUser } from "../../actions";
import { Breadcrumb, Grid, Segment, Container } from "semantic-ui-react";

class Admin extends Component {
  render() {
    if (this.props.authenticated) {
      return (
        <Container fluid>
          <Grid columns="equal">
            <Grid.Column width={2} />
            <Grid.Column width={12}>
              <Segment>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Admin</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />
                <Link to="/admin/authors">Authors</Link>
                <br />
                <Link to="/admin/blog">Blog</Link>
                <br />
                <Link to="/admin/books">Books</Link>
                <br />
                <Link to="/admin/quotes">Quotes</Link>
                <br />
                <Link to="/admin/videos">Videos</Link>
                <br />
                <br />
                <Link to="/signout">Sign Out</Link>
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>
      );
    } else {
      return (
        <Container fluid>
          <Grid columns="equal">
            <Grid.Column width={2} />
            <Grid.Column width={12}>
              <Segment>
                Not Authorized to access page<br />
                <Link to="/signin">Sign In</Link>
              </Segment>
            </Grid.Column>
            <Grid.Column width={2} />
          </Grid>
        </Container>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps, { signoutUser })(Admin);
