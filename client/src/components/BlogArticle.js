import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions/blog";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Container,
  Divider,
  Grid,
  Header,
  Icon
} from "semantic-ui-react";

import DocumentTitle from "react-document-title";
import { config } from "../config";

export class BlogArticle extends Component {
  componentDidMount() {
    let url = "";
    if (this.props !== null && typeof this.props !== "undefined" && this.props.location !== null && typeof this.props.location !== "undefined" &&
      this.props.location.pathname !== null && typeof this.props.location.pathname !== "undefined") {
      url = this.props.location.pathname;
      if (url.substring(0, 6) === "/blog/") url = url.substring(6, url.length);
    }

    this.props.fetchBlogArticleByUrl(url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.blogArticle) {
      const { blogArticle } = nextProps;

      this.setState({
        thumbNail: blogArticle.thumbNail,
        image: blogArticle.image,
        title: blogArticle.title,
        content: blogArticle.content,
        url: blogArticle.url,
        publishDate: moment(blogArticle.publishDate)
          .utc()
          .format("MMM D, YYYY")
      });
    }
  }

  displayThumbNail() {
    if (this.props.blogArticle.thumbNail) {
      return (
        <a href={`${config.imageUrl() + this.props.blogArticle.image}`}>
          <img
            src={`${config.imageUrl() + this.props.blogArticle.thumbNail}`}
            alt="img"
          />
        </a>
      );
    }
  }

  render() {
    if (!this.props.blogArticle) {
      return <div />;
    }

    return (
      <DocumentTitle title={`${this.props.blogArticle.title} ${process.env.REACT_APP_WEBSITE_OWNER}`}>
        <Container fluid className="page-header">
          <Header as="h1" sub textAlign="center">
            {this.props.blogArticle.title}
          </Header>
          <Grid container>
            <Grid.Row className="article">
              <Grid.Column>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section>
                    <Link to="/blog">Blog</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>
                    {this.props.blogArticle.title}
                  </Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="article">
              <Grid.Column>
                <span>
                  {this.props.blogArticle.publishDate
                    ? `Published: ${moment(this.props.blogArticle.publishDate).utc().format('MMM D, YYYY')}`
                    : ""}
                </span>
                <Divider hidden />
                {this.displayThumbNail()}
                <article style={{ minHeight: "350px" }}>
                  <p
                    dangerouslySetInnerHTML={{ __html: this.props.blogArticle.content }}
                    style={{ whiteSpace: "pre-line" }}
                  />
                  <a
                    href={`http://www.linkedin.com/shareArticle?mini=true&url=${process.env.REACT_APP_WEBSITE}blog/${this.props.blogArticle.url}&title=${encodeURI(this.props.blogArticle.title)}&source=${process.env.REACT_APP_WEBSITE}`}
                    target="_blank">
                    <Icon
                      name="linkedin square"
                      size="big"
                      style={{ marginLeft: 0 }}
                    />
                  </a>
                  &#160;
                  <a
                    href={`http://www.facebook.com/sharer/sharer.php?u=${process.env.REACT_APP_WEBSITE}blog/${this.props.blogArticle.url}&title=${encodeURI(this.props.blogArticle.title)}`}
                    target="_blank"
                  >
                    <Icon
                      name="facebook"
                      size="big"
                      style={{ marginLeft: 0 }}
                    />
                  </a>
                  &#160;
                  <a
                    href={`http://twitter.com/intent/tweet?status=${encodeURI(this.props.blogArticle.title)}+${process.env.REACT_APP_WEBSITE}${this.props.blogArticle.url}`}
                    target="_blank"
                  >
                    <Icon
                      name="twitter square"
                      size="big"
                      style={{ marginLeft: 0 }}
                    />
                  </a>
                </article>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </DocumentTitle >
    );
  }
}

function mapStateToProps({ blogArticles }, ownProps) {
  let url = ownProps.location.pathname;
  if (url.substring(0, 6) === "/blog/") url = url.substring(6, url.length);

  if (typeof blogArticles[url] !== "undefined") {
    return { blogArticle: blogArticles[url] };
  } else {
    const blogArticle = {};
    blogArticle.title = "";
    blogArticle.content = "";
    return {
      blogArticle
    };
  }
}

export default connect(
  mapStateToProps,
  actions
)(BlogArticle);
