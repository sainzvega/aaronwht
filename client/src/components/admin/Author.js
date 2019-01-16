import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/authors";
import { Link } from "react-router-dom";
import {
  Button,
  Breadcrumb,
  Container,
  Form,
  Grid,
  Input,
  Segment
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import { config } from "../../config";

class AdminAuthor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      imageHeight: 100,
      imageWidth: 100,
      thumbNail: "",
      thumbNailHeight: 100,
      thumbNailWidth: 100,
      firstName: "",
      middleName: "",
      lastName: ""
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    if (!this.props.match.params.id) return;

    const data = new FormData();
    data.append("id", this.props.match.params.id);
    data.append("file", this.fileName.files[0]);
    data.append("fileName", this.fileName.value);

    fetch(`${config.api()}admin/author/authorUpload`, {
      method: "POST",
      body: data
    }).then(response => {
      response.json().then(body => {
        this.setState({
          image: body[0].name,
          imageHeight: body[0].height,
          imageWidth: body[0].width,
          thumbNail: body[1].name,
          thumbNailHeight: body[1].height,
          thumbNailWidth: body[1].width
        });
      });
    });
  }

  handleImageDelete() {
    const data = new FormData();
    data.append("id", this.props.match.params.id);
    data.append("image", this.state.image);
    data.append("thumbNail", this.state.thumbNail);

    fetch(`${config.api()}admin/author/authorImageDelete`, {
      method: "POST",
      body: data
    });

    this.setState({ image: "", thumbNail: "" });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ errorMessage: "" });
    this.props.createOrUpdateAuthor(
      this.props.match.params.id,
      this.state.firstName,
      this.state.middleName,
      this.state.lastName
    );

    this.props.history.push("/admin/authors");
  }

  componentWillMount() {
    if (typeof this.props.match.params.id !== "undefined")
      this.props.fetchAdminAuthor(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authors) {
      const { authors } = nextProps;
      let firstName = "";
      let middleName = "";
      let lastName = "";

      if (
        authors.firstName !== null &&
        typeof authors.firstName !== "undefined"
      )
        firstName = authors.firstName;

      if (
        authors.middleName !== null &&
        typeof authors.middleName !== "undefined"
      )
        middleName = authors.middleName;

      if (authors.lastName !== null && typeof authors.lastName !== "undefined")
        lastName = authors.lastName;

      this.setState({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        image: authors.image,
        imageHeight: authors.imageHeight,
        imageWidth: authors.imageWidth,
        thumbNail: authors.thumbNail,
        thumbNailHeight: authors.thumbNailHeight,
        thumbNailWidth: authors.thumbNailWidth
      });
    }
  }

  uploadImage() {
    if (!this.props.match.params.id || this.state.thumbNail) {
      return "";
    } else {
      return (
        <input
          ref={ref => {
            this.fileName = ref;
          }}
          type="file"
          onChange={this.handleUploadImage}
        />
      );
    }
  }

  displayImage() {
    if (this.state.thumbNail)
      return (
        <div>
          <img
            src={`${config.imageUrl() + this.state.thumbNail}`}
            height={this.state.thumbNailHeight}
            width={this.state.thumbNailWidth}
            alt="img"
          />
          <br />
          <a onClick={() => this.handleImageDelete()}>Delete</a>
        </div>
      );
    else return "";
  }

  render() {
    return (
      <Container fluid style={{ marginTop: "2em" }}>
        <Grid columns="equal">
          <Grid.Column width={2} />
          <Grid.Column width={8}>
            <Segment basic>
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
                    <Link to="/admin/authors">Authors</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Author</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />
                {this.uploadImage()}
                <br />
                {this.displayImage()}
                <br />
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>First Name</label>
                    <Input
                      fluid
                      type="text"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Middle Name</label>
                    <Input
                      fluid
                      type="text"
                      name="middleName"
                      value={this.state.middleName}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Last Name</label>
                    <Input
                      fluid
                      type="text"
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Field>
                  <Button action="submit" primary>
                    Submit
                  </Button>
                </Form.Field>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column width={6} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps({ authors }, ownProps) {
  return { authors: authors[ownProps.match.params.id] };
}

export default connect(
  mapStateToProps,
  actions
)(AdminAuthor);
