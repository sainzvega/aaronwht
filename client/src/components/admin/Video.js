import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/videos";
import { map } from "lodash";
import { Link } from "react-router-dom";
import {
  Button,
  Breadcrumb,
  Checkbox,
  Container,
  Form,
  Grid,
  Icon,
  Input,
  Segment,
  TextArea
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import "react-datepicker/dist/react-datepicker.css";

class AdminVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
      url: "",
      videoUrl: "",
      person: "",
      people: [],
      mainVideo: false,
      publishDate: moment().utc()
    };

    this.handleChange = this.handleChange.bind(this);
    this.onPublishDateChange = this.onPublishDateChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onPublishDateChange(date) {
    this.setState({ publishDate: date });
  }

  onChange(mainVideo) {
    if (mainVideo) this.setState({ mainVideo: false });
    else this.setState({ mainVideo: true });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ errorMessage: "" });
    this.props.createOrUpdateVideo(
      this.props.match.params.id,
      this.state.title,
      this.state.url,
      this.state.videoUrl,
      this.state.content,
      this.state.people,
      this.state.mainVideo,
      this.state.publishDate
    );

    this.props.history.push("/admin/videos");
  }

  componentWillMount() {
    if (
      typeof this.props.match.params.id !== "undefined" &&
      Number(this.props.match.params.id) !== 0
    ) {
      this.props.fetchAdminVideo(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videos) {
      const { videos } = nextProps;
      this.setState({
        title: videos.title,
        url: videos.url,
        videoUrl: videos.videoUrl ? videos.videoUrl : "",
        content: videos.content,
        people: videos.people,
        publishDate: videos.publishDate,
        mainVideo: videos.mainVideo
      });
    }
  }

  addPerson() {
    if (this.state.person === "") return;

    let personFound = false;
    let people = [];
    if (
      this.state.people !== null &&
      typeof this.state.people !== "undefined"
    ) {
      for (var i = 0; i < this.state.people.length; i++) {
        people.push(this.state.people[i]);

        if (this.state.people[i] === this.state.person) {
          personFound = true;
        }
      }
    }

    if (!personFound) {
      people.push(this.state.person);
      this.setState({
        people,
        person: ""
      });
    } else {
      this.setState({
        person: ""
      });
    }
  }

  deletePerson(person) {
    let people = [];
    if (
      this.state.people !== null &&
      typeof this.state.people !== "undefined"
    ) {
      for (let i = 0; i < this.state.people.length; i++) {
        people.push(this.state.people[i]);
      }
    }

    for (let i = 0; i < people.length; i++) {
      if (person === people[i]) {
        people.pop(i);
      }
    }

    this.setState({ people });
  }

  displayPeople() {
    return map(this.state.people, person => {
      return (
        <div key={`_person_${person}`}>
          <div style={{ float: "left", minWidth: 150 }}>{person}</div>
          <div>
            <Icon name="delete" onClick={() => this.deletePerson(person)} />
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <Container fluid style={{ marginTop: "2em" }}>
        <Grid columns="equal">
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <Segment>
              <Form onSubmit={this.onFormSubmit}>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section>
                    <Link to="/admin">Admin</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section>
                    <Link to="/admin/videos">Videos</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Video</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />
                <Form.Field width={10}>
                  <label>Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field width={10}>
                  <label>Url</label>
                  <Input
                    type="text"
                    name="url"
                    value={this.state.url}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field width={10}>
                  <label>Video Url</label>
                  <Input
                    type="text"
                    name="videoUrl"
                    value={this.state.videoUrl}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field width={10}>
                  <label>Content</label>
                  <TextArea
                    name="content"
                    value={this.state.content}
                    onChange={this.handleChange}
                    rows={7}
                  />
                </Form.Field>
                <Form.Field width={5}>
                  <div style={{ float: "left", width: 200 }}>
                    <label>People in Video</label>
                    <Input
                      type="text"
                      name="person"
                      value={this.state.person}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div style={{ float: "left", paddingTop: 25 }}>
                    &#160;<span onClick={() => this.addPerson()}>
                      Add Person
                    </span>
                  </div>
                  <div style={{ clear: "both" }} />
                  <br />
                  <Container>{this.displayPeople()}</Container>
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    toggle
                    label="Main Video"
                    checked={this.state.mainVideo ? true : false}
                    onChange={() => this.onChange(this.state.mainVideo)}
                  />
                </Form.Field>
                <Form.Field>
                  <DatePicker
                    selected={moment(this.state.publishDate).utc()}
                    onChange={this.onPublishDateChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Button action="submit" primary>
                    Submit
                  </Button>
                </Form.Field>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps({ videos }, ownProps) {
  return { videos: videos[ownProps.match.params.id] };
}

export default connect(
  mapStateToProps,
  actions
)(AdminVideo);
