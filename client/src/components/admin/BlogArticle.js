import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/blog";
import { Link } from "react-router-dom";
import {
  Button,
  Breadcrumb,
  Checkbox,
  Container,
  Form,
  Grid,
  Input,
  Segment,
  TextArea
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import "react-datepicker/dist/react-datepicker.css";
import { config } from "../../config";

class AdminBlogArticle extends Component {
  constructor() {
    super();

    this.state = {
      image: "",
      thumbnail: "",
      title: "",
      content: "",
      url: "",
      isActive: false,
      publishDate: moment()
        .utc()
        .add(5, "days")
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    if (!this.props.match.params.id) return;

    const data = new FormData();
    data.append("id", this.props.match.params.id);
    data.append("file", this.fileName.files[0]);
    data.append("fileName", this.fileName.value);

    fetch(`${config.api()}admin/blog/articleUpload`, {
      method: "POST",
      body: data
    }).then(response => {
      response.json().then(body => {
        this.setState({
          image: body[0],
          thumbNail: body[1]
        });
      });
    });
  }

  handleImageDelete() {
    const data = new FormData();
    data.append("id", this.props.match.params.id);
    data.append("image", this.state.image);
    data.append("thumbNail", this.state.thumbNail);

    fetch(`${config.api()}admin/blog/articleImageDelete`, {
      method: "POST",
      body: data
    });

    this.setState({ image: "", thumbNail: "" });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDateChange(date) {
    this.setState({
      publishDate: date
    });
  }

  onChange(isActive) {
    if (isActive) this.setState({ isActive: false });
    else this.setState({ isActive: true });
  }

  onFormSubmit(event) {
    event.preventDefault();

    this.setState({ errorMessage: "" });
    this.props.createOrUpdateBlogArticle(
      this.props.match.params.id,
      this.state.title,
      this.state.content,
      this.state.url,
      this.state.isActive,
      moment(this.state.publishDate)
        .utc()
        .format()
    );

    this.props.history.push("/admin/blog");
  }

  componentWillMount() {
    if (
      typeof this.props.match.params.id !== "undefined" &&
      Number(this.props.match.params.id) !== 0
    ) {
      this.props.fetchAdminBlogArticle(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.blogArticle) {
      const { blogArticle } = nextProps;
      this.setState({
        image: blogArticle.image,
        thumbNail: blogArticle.thumbNail,
        title: blogArticle.title,
        content: blogArticle.content,
        isActive: blogArticle.isActive,
        url: blogArticle.url,
        publishDate: blogArticle.publishDate
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
                <Breadcrumb.Section>
                  <Link to="/admin/blog">Blog</Link>
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right angle" />
                <Breadcrumb.Section active>Blog Article</Breadcrumb.Section>
              </Breadcrumb>
              <br />
              <br />
              {this.uploadImage()}
              <br />
              {this.displayImage()}

              <Form onSubmit={this.onFormSubmit}>
                <Form.Field width={8}>
                  <label>Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field width={12}>
                  <label>Content</label>
                  <TextArea
                    name="content"
                    value={this.state.content}
                    onChange={this.handleChange}
                    rows={16}
                    style={{ fontSize: "18px" }}
                  />
                </Form.Field>
                <Form.Field width={8}>
                  <label>Url</label>
                  <Input
                    type="text"
                    name="url"
                    value={this.state.url}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    toggle
                    label="Active"
                    checked={this.state.isActive ? true : false}
                    onChange={() => this.onChange(this.state.isActive)}
                  />
                </Form.Field>
                <Form.Field>
                  <DatePicker
                    selected={moment(this.state.publishDate).utc()}
                    onChange={this.handleDateChange}
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

function mapStateToProps({ blogArticles }, ownProps) {
  return { blogArticle: blogArticles[ownProps.match.params.id] };
}

export default connect(
  mapStateToProps,
  actions
)(AdminBlogArticle);
