import React, { Component } from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../../actions/books";
import { Link } from "react-router-dom";
import SortableList from "./SortableList";
import { getBooks } from "../../selectors/selectors_books";
import { Breadcrumb, Container, Grid, Segment } from "semantic-ui-react";

class AdminBooks extends Component {
  constructor(props) {
    super(props);

    this.state = { currentPage: 1 };
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.props.fetchBooks(this.state.currentPage);
  }

  getPage(page) {
    this.fetchBooks(page);
  }

  fetchBooks(page) {
    this.setState({ currentPage: page });
    this.props.fetchBooks(page);
  }

  renderList() {
    return map(this.props.books, book => {
      return (
        <Grid.Column textAlign="center" verticalAlign="bottom" key={book._id}>
          <Link to={`/admin/book/${book._id}`}>
            {this.displayImage(book.thumbNail)}
            <br />
            {book.title}
            <br />
            by {book.author}
          </Link>
        </Grid.Column>
      );
    });
  }

  displayList() {
    if (this.props.totalBooksCount !== 0) {
      return (
        <Grid relaxed columns={3} stackable>
          {this.renderList()}
        </Grid>
      );
    }
  }

  render() {
    if (!this.props.booksFetched) return <div />;

    let items = [];
    Object.keys(this.props.books).forEach(key => {
      items.push(this.props.books[key]);
    });

    return (
      <Container fluid style={{ marginTop: "2em" }}>
        <Grid columns="equal">
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <Segment>
              <Breadcrumb>
                <Breadcrumb.Section>
                  <Link to="/">Home</Link>
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right angle" />
                <Breadcrumb.Section>
                  <Link to="/admin">Admin</Link>
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right angle" />
                <Breadcrumb.Section active>Books</Breadcrumb.Section>
              </Breadcrumb>
              <br />
              <br />

              <Link to={`/admin/book/0`}>Add Book</Link>
              <br />
              <br />
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
    books: getBooks(books),
    maxBooksReturned: books.maxBooksReturned,
    totalBooksCount: books.totalBooksCount,
    booksFetched: books.booksFetched
  };
}

export default connect(
  mapStateToProps,
  actions
)(AdminBooks);
