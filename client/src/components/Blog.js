import React, { Component } from "react";
import { map, debounce } from "lodash";
import Paging from "./utilities/Paging";
import { connect } from "react-redux";
import * as actions from "../actions/blog";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Container,
  Form,
  Grid,
  Header,
  Input,
  Icon,
  Table
} from "semantic-ui-react";
import moment from "moment";
import DocumentTitle from "react-document-title";

export class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1, title: "" };
    this.onTitleSearchChange = this.onTitleSearchChange.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.updateResults = debounce(this.updateResults, 300);
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.getPage(1);
  }

  getPage(currentPage) {
    if (currentPage !== this.state.currentPage) this.setState({ currentPage });
    this.props.fetchBlogArticles(currentPage);
  }

  //fetchBlogArticles(page) {
  //  this.props.fetchBlogArticles(page);
  //  this.setState({ currentPage: page });
  //}

  onTitleSearchChange(event) {
    this.setState({ title: event.target.value });
    this.updateResults();
  }

  updateResults() {
    if (this.state.title !== "") this.props.searchBlogByTitle(this.state.title);
    else this.getPage(1);
  }

  renderList() {
    if (typeof this.props.blogArticlesFetched !== "undefined") {
      if (Object.keys(this.props.blogArticles).length !== 0) {
        return map(this.props.blogArticles, blogArticle => {
          return (
            <Table.Row key={blogArticle._id}>
              <Table.Cell>
                <Link to={`/blog/${blogArticle.url}`}>{blogArticle.title}</Link>
              </Table.Cell>
              <Table.Cell>
                <Link to={`/blog/${blogArticle.url}`}>
                  {moment(blogArticle.publishDate)
                    .utc()
                    .format("M/DD/YYYY")}
                </Link>
              </Table.Cell>
            </Table.Row>
          );
        });
      } else {
        return (
          <Table.Row key={0}>
            <Table.Cell>No Blog Articles found</Table.Cell>
          </Table.Row>
        );
      }
    } else {
      return (
        <Table.Row key={0}>
          <Table.Cell>
            Loading Blog Articles <Icon loading size="large" name="spinner" />
          </Table.Cell>
        </Table.Row>
      );
    }
  }

  render() {
    return (
      <DocumentTitle title={`${process.env.REACT_APP_WEBSITE_OWNER}\'s Blog`}>
        <Container fluid className="page-header">
          <Header as="h1" sub textAlign="center">
            {`${process.env.REACT_APP_WEBSITE_OWNER}\'s Blog`}
          </Header>
          <Grid container>
            <Grid.Row className="article">
              <Grid.Column>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Blog</Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="article">
              <Grid.Column>
                {/*
                <Form>
                  <Form.Field width={6}>
                    <Input
                      type="text"
                      value={this.state.title}
                      placeholder="Search Blog Articles"
                      onChange={this.onTitleSearchChange}
                    />
                  </Form.Field>
                </Form>
               */}
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Published Date</Table.HeaderCell>
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
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </DocumentTitle>
    );
  }
}

function mapStateToProps({ blogArticles }) {
  return {
    blogArticles: blogArticles.blogArticles,
    maxBlogArticlesReturned: blogArticles.maxBlogArticlesReturned,
    totalBlogArticlesCount: blogArticles.totalBlogArticlesCount,
    blogArticlesFetched: blogArticles.blogArticlesFetched
  };
}

export default connect(
  mapStateToProps,
  actions
)(Blog);
