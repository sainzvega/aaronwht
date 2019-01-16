import React, { Component } from "react";
import Paging from "../utilities/Paging";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../../actions/videos";
import { Link } from "react-router-dom";
import { getVideos } from "../../selectors/selectors_videos";
import { Breadcrumb, Container, Grid, Segment, Table } from "semantic-ui-react";
import moment from "moment";

class AdminVideos extends Component {
  constructor(props) {
    super(props);

    this.state = { currentPage: 1 };
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.props.fetchAdminVideos(this.state.currentPage);
  }

  getPage(page) {
    this.fetchAdminVideos(page);
  }

  fetchAdminVideos(page) {
    this.setState({ currentPage: page });
    this.props.fetchAdminVideos(page);
  }

  renderList() {
    return map(this.props.videos, video => {
      return (
        <Table.Row key={video._id}>
          <Table.Cell>
            <Link to={`/admin/video/${video._id}`}>{video.title}</Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/admin/video/${video._id}`}>{video.videoUrl}</Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/admin/video/${video._id}`}>
              {moment(video.publishDate)
                .utc()
                .format("M/DD/YYYY")}
            </Link>
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  displayList() {
    if (this.props.totalVideosCount !== 0) {
      return (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Video</Table.HeaderCell>
              <Table.HeaderCell>Url</Table.HeaderCell>
              <Table.HeaderCell>Published</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderList()}</Table.Body>

          <Paging
            getPage={this.getPage}
            label={"Videos"}
            totalRecords={this.props.totalVideosCount}
            maxRecordsReturned={this.props.maxVideosReturned}
            currentPage={this.state.currentPage}
          />
        </Table>
      );
    }
  }

  render() {
    return (
      <div>
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
                  <Breadcrumb.Section active>Videos</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />

                <Link to={`/admin/video/0`}>Add Video</Link>
                <br />
                {this.displayList()}
              </Segment>
            </Grid.Column>
            <Grid.Column width={2} />
          </Grid>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ videos }) {
  return {
    videos: getVideos(videos),
    maxVideosReturned: videos.maxVideosReturned,
    totalVideosCount: videos.totalVideosCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(AdminVideos);
