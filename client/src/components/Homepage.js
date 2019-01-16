import React, { Component } from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../actions";
import { Link } from "react-router-dom";
import { Divider, Grid, Header, Image, Segment } from "semantic-ui-react";
import moment from "moment";
import DocumentTitle from "react-document-title";
import { config } from "../config";

class Homepage extends Component {
  componentWillMount() {
    this.props.fetchHomepage();
  }

  renderBlogArticles() {
    return map(this.props.blogArticles, blogArticle => {
      return (
        <div key={blogArticle._id}>
          <Link to={`/blog/${blogArticle.url}`}>
            {`${blogArticle.title} - ${moment(blogArticle.publishDate)
              .utc()
              .format("MMM D, YYYY")}`}
          </Link>
        </div>
      );
    });
  }

  displayQuoteImage() {
    if (this.props.quote.thumbNail)
      return (
        <Image
          src={`${config.imageUrl() + this.props.quote.thumbNail}`}
          alt=""
          height={this.props.quote.thumbNailHeight}
          width={this.props.quote.thumbNailWidth}
          circular
          centered
        />
      );
  }

  renderQuote() {
    if (!this.props.quote || !this.props.quote.author) return <div />

    return (
      <Segment>
        {this.displayQuoteImage()}
        <Header
          as="h3"
          style={{
            textAlign: "center",
            paddingTop: 0,
            marginTop: 0
          }}
        >
          {this.props.quote.author}
        </Header>
        <p>{this.props.quote.content}</p>
        <Link to="/quotes">View More Quotes</Link>
        <br />
        <br />
        Seth Godin`s Blog:
        <br />
        <a href="https://seths.blog/2011/07/defining-quality/">
          Defining quality
        </a>
        <br />
        <a href="https://seths.blog/2016/08/the-lottery-winners-a-secret-of-unhappiness/">
          The lottery winners
        </a>
      </Segment>
    );
  }

  renderFeaturedBlogArticle() {
    if (!this.props.featuredBlogArticle) return <div />
    return (
      <div className="page-header">
        <Link to={`/blog/${this.props.featuredBlogArticle.url}`}>
          <Header as="h1" sub>
            {this.props.featuredBlogArticle.title}
          </Header>
        </Link>
        <span>
          {this.props.featuredBlogArticle.publishDate
            ? `Published: ${moment(this.props.featuredBlogArticle.publishDate)
              .utc()
              .format("MMM D, YYYY")}`
            : ""}
        </span>
        <Divider hidden />
        <article>
          <p
            dangerouslySetInnerHTML={{
              __html: this.props.featuredBlogArticle.content
            }}
            style={{ whiteSpace: "pre-line" }}
          />
        </article>
        <br />
        {this.renderBlogArticles()}
      </div>
    );
  }

  render() {
    return (
      <DocumentTitle title={`${process.env.REACT_APP_WEBSITE_OWNER} - Software Developer and Manager`}>
        <React.Fragment>
          <Grid container centered>
            <Grid.Row columns={1} centered={true} className="page-header">
              <Grid.Column width={16} textAlign="center">
                <Header as="h1" sub textAlign="center">
                  {`${process.env.REACT_APP_WEBSITE_OWNER}`}
                </Header>
                <Image
                  src="/public-speaking.jpg"
                  size="massive"
                  centered={true}
                />
                <Divider hidden />
                <span>
                  I`ve been writing software professionally for two decades and
                  managing teams for more than a decade.
                  <br />I write about work and life-related experiences with the
                  intention of helping others - especially first-time managers.
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid stackable container className="article">
            <Grid columns={2}>
              <Grid.Column width={11}>
                {this.props.homepageFetched
                  ? this.renderFeaturedBlogArticle()
                  : ""}
              </Grid.Column>
              <Grid.Column width={5}>
                {this.props.homepageFetched ? this.renderQuote() : ""}
              </Grid.Column>
            </Grid>
          </Grid>
        </React.Fragment>
      </DocumentTitle>
    );
  }
}

function mapStateToProps({ homepage }) {
  return {
    blogArticles: homepage.blogArticles,
    featuredBlogArticle: homepage.featuredBlogArticle,
    quote: homepage.quote,
    homepageFetched: homepage.homepageFetched
  };
}

export default connect(
  mapStateToProps,
  actions
)(Homepage);
