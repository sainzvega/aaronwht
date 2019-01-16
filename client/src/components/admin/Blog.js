import React, { Component } from "react";
import Paging from "../utilities/Paging";
import { map, debounce } from "lodash";
import { connect } from "react-redux";
import * as actions from "../../actions/blog";
import { Link } from "react-router-dom";
import { getBlogArticles } from "../../selectors/selectors_blog";
import moment from "moment";
import {
  Breadcrumb,
  Container,
  Grid,
  Segment,
  Input,
  Table
} from "semantic-ui-react";

class AdminBlog extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1, title: "" };
    this.onTitleSearchChange = this.onTitleSearchChange.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.updateResults = debounce(this.updateResults, 300);
    this.fetchAdminBlogArticles = this.fetchAdminBlogArticles.bind(this);
    this.getPage = this.getPage.bind(this);
  }

  getPage(page) {
    this.setState({ currentPage: page });
    this.fetchAdminBlogArticles(page);
  }

  onTitleSearchChange(event) {
    this.setState({ title: event.target.value });
    this.updateResults();
  }

  updateResults() {
    if (this.state.title !== "")
      this.props.searchAdminBlogByTitle(this.state.title);
    else this.props.fetchAdminBlogArticles(1);
  }

  componentWillMount() {
    if (this.props.totalBlogArticlesCount === 0)
      this.fetchAdminBlogArticles(this.state.currentPage);
  }

  fetchAdminBlogArticles(page) {
    this.setState({ currentPage: page });
    this.props.fetchAdminBlogArticles(page);
  }

  renderList() {
    return map(this.props.blogArticles, blogArticle => {
      return (
        <Table.Row key={blogArticle._id}>
          <Table.Cell>
            <Link to={`/admin/blog/article/${blogArticle._id}`}>
              {blogArticle.title}
            </Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/admin/blog/article/${blogArticle._id}`}>
              {moment(blogArticle.publishDate)
                .utc()
                .format("ddd MMM DD, YYYY")}
            </Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/admin/blog/article/${blogArticle._id}`}>
              {blogArticle.isActive ? "Yes" : "No"}
            </Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/blog/${blogArticle.url}`} target="_blank">
              View
            </Link>
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  displayList() {
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Publish Date</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell>View</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderList()}</Table.Body>

          <Paging
            getPage={this.getPage}
            label={"Blog Posts"}
            totalRecords={this.props.totalBlogArticlesCount}
            maxRecordsReturned={this.props.maxBlogArticlesReturned}
            currentPage={this.state.currentPage}
          />
        </Table>
      </div>
    );
  }

  render() {
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
                <Breadcrumb.Section>
                  <Link to="/admin">Admin</Link>
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right angle" />
                <Breadcrumb.Section active>Blog</Breadcrumb.Section>
              </Breadcrumb>
              <br />
              <br />

              <Link to={`/admin/blog/article/`}>Add Blog Article</Link>
              <br />
              <Input
                width={3}
                type="text"
                value={this.state.title}
                placeholder="Search Blog Articles"
                onChange={this.onTitleSearchChange}
              />
              {this.displayList()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps({ blogArticles }) {
  return {
    blogArticles: getBlogArticles(blogArticles),
    maxBlogArticlesReturned: blogArticles.maxBlogArticlesReturned,
    totalBlogArticlesCount: blogArticles.totalBlogArticlesCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(AdminBlog);
