import React from "react";
import SortableList from "./SortableList";
import * as actions from "../../actions/books";
import { connect } from "react-redux";
import { Segment, Container, Grid } from "semantic-ui-react";

class AdminTest extends React.Component {
  componentWillMount() {
    this.props.fetchBooks(1);
  }

  render() {
    if (!this.props.booksFetched) return <div />;

    let items = [];
    Object.keys(this.props.books.books).forEach(key => {
      items.push(this.props.books.books[key]);
    });

    return (
      <Container fluid style={{ marginTop: "2em" }}>
        <Grid columns="equal">
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <Segment>
              <SortableList items={items} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps({ books }) {
  return {
    books: books,
    booksFetched: books.booksFetched
  };
}

export default connect(
  mapStateToProps,
  actions
)(AdminTest);
