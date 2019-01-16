import React, { Component } from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../actions/books";
import { Link } from "react-router-dom";
import { getBooks } from "../selectors/selectors_books";
import { Breadcrumb, Container, Grid, Header, Icon } from "semantic-ui-react";
import DocumentTitle from "react-document-title";
import { config } from "../config";

class Books extends Component {
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

  displayImage(thumbNail) {
    if (thumbNail)
      return <img src={`${config.imageUrl() + thumbNail}`} alt="img" />;
    else return "";
  }

  displayRating(id, rating) {
    if (typeof rating === "undefined" || rating === 0) return;
    let ratings = [];
    for (let i = 1; i <= rating; i++)
      ratings.push(<Icon key={id + i} name="star" />);

    return ratings;
  }

  renderList() {
    return map(this.props.books, book => {
      if (book.purchaseUrl) {
        return (
          <Grid.Column textAlign="center" verticalAlign="bottom" key={book._id}>
            <a href={book.purchaseUrl}>
              {this.displayImage(book.thumbNail)}
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
              {this.displayRating(book._id, book.rating)}
            </a>
          </Grid.Column>
        );
      } else {
        return (
          <Grid.Column textAlign="center" verticalAlign="bottom" key={book._id}>
            {this.displayImage(book.thumbNail)}
            <div className="book-title">{book.title}</div>
            <div className="book-author">{book.author}</div>
            {this.displayRating(book._id, book.rating)}
          </Grid.Column>
        );
      }
    });
  }

  displayList() {
    if (this.props.totalBooksCount !== 0) {
      return (
        <Grid relaxed columns={4} stackable>
          {this.renderList()}
        </Grid>
      );
    }
  }

  render() {
    return (
      <DocumentTitle title={`Recomended Books - ${process.env.REACT_APP_WEBSITE_OWNER}`}>
        <Container fluid className="page-header">
          <Header as="h1" sub textAlign="center">
            Recommended Books
          </Header>
          <Grid container>
            <Grid.Row className="article">
              <Grid.Column>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Books</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />
                <div>
                  Below are many of the books I recommend reading.<br />
                  <br />
                  <div style={{ fontSize: ".85em", color: "#004080" }}>
                    Not all readers are leaders, but all leaders are readers. -
                    Harry S Truman<br />
                    In my whole life, I have known no wise people (over a broad
                    subject matter area) who didn`t read all the time -- none,
                    zero. - Charlie Munger
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>{this.displayList()}</Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </ DocumentTitle>
    );
  }
}

function mapStateToProps({ books }) {
  return {
    books: getBooks(books),
    maxBooksReturned: books.maxBooksReturned,
    totalBooksCount: books.totalBooksCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(Books);
