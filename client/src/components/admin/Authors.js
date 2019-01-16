import React, { Component } from "react";
import Paging from "../utilities/Paging";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../../actions/authors";
import { Link } from "react-router-dom";
import { getAuthors } from "../../selectors/selectors_authors";
import { Breadcrumb, Container, Grid, Segment, Table } from "semantic-ui-react";
import { config } from "../../config";

class AdminAuthors extends Component {
  constructor(props) {
    super(props);

    this.state = { currentPage: 1 };
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.props.fetchAdminAuthors(this.state.currentPage);
  }

  getPage(page) {
    this.fetchAdminAuthors(page);
  }

  fetchAdminAuthors(page) {
    this.setState({ currentPage: page });
    this.props.fetchAdminAuthors(page);
  }

  displayImage(author) {
    if (author.thumbNail)
      return (
        <div>
          <img
            src={`${config.imageUrl() + author.thumbNail}`}
            height={author.thumbNailHeight}
            width={author.thumbNailWidth}
            alt="img"
          />
        </div>
      );
    else return "";
  }

  renderList() {
    return map(this.props.authors, author => {
      return (
        <Table.Row key={author._id}>
          <Table.Cell width={1}>
            <Link to={`/admin/author/${author._id}`}>
              {this.displayImage(author)}
            </Link>
          </Table.Cell>
          <Table.Cell width={15}>
            <Link to={`/admin/author/${author._id}`}>
              {author.firstName +
                " " +
                author.middleName +
                " " +
                author.lastName}
            </Link>
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  displayList() {
    if (this.props.totalAuthorsCount !== 0) {
      return (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2}>Author</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderList()}</Table.Body>

          <Paging
            getPage={this.getPage}
            label={"Authors"}
            totalRecords={this.props.totalAuthorsCount}
            maxRecordsReturned={this.props.maxAuthorsReturned}
            currentPage={this.state.currentPage}
          />
        </Table>
      );
    }
  }

  render() {
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
                <Breadcrumb.Section active>Authors</Breadcrumb.Section>
              </Breadcrumb>
              <br />
              <br />

              <Link to={`/admin/author/0`}>Add Author</Link>
              <br />
              {this.displayList()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps({ authors }) {
  return {
    authors: getAuthors(authors),
    maxAuthorsReturned: authors.maxAuthorsReturned,
    totalAuthorsCount: authors.totalAuthorsCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(AdminAuthors);
