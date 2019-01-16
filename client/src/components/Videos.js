import React, { Component } from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../actions/videos";
import { Link } from "react-router-dom";
import { Breadcrumb, Container, Divider, Embed, Header, Grid, Segment } from "semantic-ui-react";
import DocumentTitle from "react-document-title";

class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentVideo: {},
      videos: {},
      attemptedToFindVideo: false
    };
    this.fetchVideos = this.fetchVideos.bind(this);
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.fetchVideos(this.state.currentPage);
  }

  componentDidUpdate() {
    if (typeof this.props.match.params.url !== "undefined" && this.state.currentVideo.url !== this.props.match.params.url) {
      this.updateVideo();
    } else if (typeof this.state.currentVideo.url === "undefined") {
      this.updateVideo();
    }
  }

  updateVideo() {
    if (this.state.attemptedToFindVideo) return;

    let currentVideo = {};
    if (this.props.match.params.url) {
      map(this.state.videos, video => {
        if (
          this.props.match.params.url &&
          video.url === this.props.match.params.url &&
          video.url !== this.state.currentVideo.url
        ) {
          currentVideo.url = video.url;
          currentVideo.videoUrl = video.videoUrl;
          currentVideo.title = video.title;
          currentVideo.content = video.content;
          currentVideo.people = video.people;
          currentVideo.publishDate = video.publishDate;
        }
      });

      if (typeof currentVideo.url !== "undefined") {
        this.setState({
          currentVideo: currentVideo,
          attemptedToFindVideo: true
        });
      } else if (typeof currentVideo.url === "undefined") {
        this.setState({
          attemptedToFindVideo: true,
          currentVideo: { title: "Video Not Found" }
        });
        return;
      }
    } else {
      map(this.state.videos.videos, video => {
        if (video.mainVideo) {
          currentVideo.url = video.url;
          currentVideo.videoUrl = video.videoUrl;
          currentVideo.title = video.title;
          currentVideo.content = video.content;
          currentVideo.people = video.people;
          currentVideo.publishDate = video.publishDate;
        }
      });
    }

    if (typeof currentVideo.url === "undefined") {
      map(this.state.videos, video => {
        if (typeof currentVideo.url === "undefined") {
          currentVideo.url = video.url;
          currentVideo.videoUrl = video.videoUrl;
          currentVideo.title = video.title;
          currentVideo.content = video.content;
          currentVideo.people = video.people;
          currentVideo.publishDate = video.publishDate;
        }
      });
    }

    this.setState({ currentVideo: currentVideo, attemptedToFindVideo: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videos) {
      this.setState({
        videos: nextProps.videos,
        currentVideo: {},
        attemptedToFindVideo: false
      });
    }
  }

  getPage(page) {
    this.fetchVideos(page);
  }

  fetchVideos(page) {
    this.props.fetchVideos(page);
    this.setState({ currentPage: page });
  }

  displayVideo() {
    if (typeof this.state.currentVideo.url !== "undefined") {
      return (
        <React.Fragment>
          <Embed
            source="youtube"
            id={this.state.currentVideo.videoUrl}
            autoplay={true}
            active={true}
          />
          <Container
            fluid
            text
            style={{
              paddingTop: 15,
              paddingBottom: 15,
              fontSize: "1.15em",
              margin: 0
            }}
          >
            {this.state.currentVideo.content}
          </Container>
        </React.Fragment>
      );
    } else {
      if (this.state.attemptedToFindVideo) {
        return (
          <Container text>
            <br />
            We`re sorry! The video you requested wasn`t found or no longer
            exists.
          </Container>
        );
      }
    }
  }

  renderVideos() {
    return map(this.props.videos, video => {
      if (video.url === this.state.currentVideo.url) {
        return (
          <div key={video.title} className="selected-video">
            {video.title}
          </div>
        );
      } else {
        return (
          <div key={video.title}>
            <Link to={`/videos/${video.url}`} className="video">
              {video.title}
            </Link>
          </div>
        );
      }
    });
  }

  displayBreadcrumb() {
    if (this.props.match.params.url) {
      return (
        <Breadcrumb>
          <Breadcrumb.Section>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section>
            <Link to="/videos">Videos</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section active>
            {this.state.currentVideo.title}
          </Breadcrumb.Section>
        </Breadcrumb>
      );
    } else {
      return (
        <Breadcrumb>
          <Breadcrumb.Section>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section active>Videos</Breadcrumb.Section>
        </Breadcrumb>
      );
    }
  }

  render() {
    return (
      <DocumentTitle
        title={
          this.props.match.params.url
            ? `${this.state.currentVideo.title} - ${process.env.REACT_APP_WEBSITE_OWNER}`
            : `Videos - ${process.env.REACT_APP_WEBSITE_OWNER}`
        }
      >
        <Container fluid className="page-header">
          <Grid columns={16} container>
            <Grid.Row className="article">
              <Grid.Column width={16}>
                <Segment basic>
                  <Header as="h1" sub>
                    {this.state.currentVideo.title}
                  </Header>
                  {this.displayBreadcrumb()}
                  <Divider hidden />
                  <Grid columns={16} stackable>
                    <Grid.Row>
                      <Grid.Column mobile={16} tablet={10} computer={10}>
                        {this.displayVideo()}
                      </Grid.Column>
                      <Grid.Column mobile={16} tablet={6} computer={5}>
                        <strong>More Videos:</strong>
                        <br />
                        {this.renderVideos()}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </DocumentTitle>
    );
  }
}

function mapStateToProps({ videos }) {
  return {
    videos: videos.videos,
    maxVideosReturned: videos.maxVideosReturned,
    totalVideosCount: videos.totalVideosCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(Videos);
