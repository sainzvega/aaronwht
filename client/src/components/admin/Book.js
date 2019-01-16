import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/books";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Breadcrumb,
  Container,
  Form,
  Grid,
  Input,
  Segment
} from "semantic-ui-react";
import Ratings from "react-ratings-declarative";
import "react-select/dist/react-select.css";
import { config } from "../../config";

class AdminBook extends Component {
  constructor(props) {
    super(props);

    let authorLoaded = false;

    if (
      typeof this.props.match.params.id !== "undefined" &&
      Number(this.props.match.params.id) === 0
    ) {
      authorLoaded = true;
    }

    this.state = {
      thumbNail: "",
      thumbNailHeight: 100,
      thumbNailWidth: 100,
      title: "",
      author: "",
      authorId: "",
      purchaseUrl: "",
      ordinal: 0,
      rating: 0,
      selectedAuthor: {},
      authorLoaded: authorLoaded
    };

    this.handleAuthorSearch = this.handleAuthorSearch.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.typeAheadChange = this.typeAheadChange.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  typeAheadChange(value) {
    this.setState({ selectedAuthor: value });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeRating(newRating) {
    this.setState({
      rating: newRating
    });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ errorMessage: "" });

    this.props.createOrUpdateBook(
      this.props.match.params.id,
      this.state.selectedAuthor.authorId,
      this.state.title,
      this.state.selectedAuthor.author,
      this.state.purchaseUrl,
      this.state.rating,
      this.state.ordinal
    );

    this.props.history.push("/admin/books");
  }

  componentWillMount() {
    if (
      typeof this.props.match.params.id !== "undefined" &&
      Number(this.props.match.params.id) !== 0
    ) {
      this.props.fetchBook(this.props.match.params.id);
    }
  }

  handleAuthorSearch(input, callback) {
    let existingAuthor = {};

    if (input === null || typeof input === "undefined" || input === "") {
      existingAuthor = {
        options: [
          {
            author: this.state.selectedAuthor.author,
            authorId: this.state.selectedAuthor.authorId
          }
        ],
        complete: 0
      };

      callback(null, existingAuthor);
      return;
    }

    let authors = [];
    fetch(`${config.api()}admin/authors/find/${input}`).then(response => {
      response.json().then(body => {
        body.forEach(author => {
          authors.push({
            authorId: author._id,
            author: author.fullName
          });
        });

        if (authors.length === 0) {
          let existingAuthor = {
            options: [
              {
                author: input,
                authorId: 0
              }
            ],
            complete: 0
          };

          callback(null, existingAuthor);
          return;
        }

        let data = {
          options: authors,
          complete: authors.length
        };

        callback(null, data);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.books) {
      const { books } = nextProps;
      this.setState({
        author: books.author,
        authorId: books.authorId ? books.authorId : "",
        title: books.title,
        purchaseUrl: books.purchaseUrl ? books.purchaseUrl : "",
        thumbNail: books.thumbNail ? books.thumbNail : "",
        thumbNailHeight: books.thumbNailHeight,
        thumbNailWidth: books.thumbNailWidth,
        selectedAuthor: { author: books.author, authorId: books.authorId },
        rating: books.rating,
        ordinal: books.ordinal,
        authorLoaded: true
      });
    }
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    if (!this.props.match.params.id) return;

    const data = new FormData();
    data.append("id", this.props.match.params.id);
    data.append("file", this.fileName.files[0]);
    data.append("fileName", this.fileName.value);

    fetch(`${config.api()}admin/book/bookUpload`, {
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

    fetch(`${config.api()}admin/book/bookImageDelete`, {
      method: "POST",
      body: data
    });
    this.setState({ thumbNail: "" });
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
                    <Link to="/admin/books">Books</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Book</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />
                {this.uploadImage()}
                <br />
                {this.displayImage()}

                <Form.Field width={6}>
                  <label>Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field width={6}>
                  <label>Author</label>
                  <Select.Async
                    ignoreCase={false}
                    multi={false}
                    value={this.state.selectedAuthor}
                    onChange={this.typeAheadChange}
                    valueKey="authorId"
                    labelKey="author"
                    loadOptions={this.handleAuthorSearch}
                  />
                </Form.Field>
                <Form.Field width={6}>
                  <label>Purchase Url</label>
                  <Input
                    type="text"
                    name="purchaseUrl"
                    value={this.state.purchaseUrl}
                    onChange={this.handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <Ratings
                    rating={this.state.rating}
                    widgetRatedColors="blue"
                    changeRating={this.changeRating}
                  >
                    <Ratings.Widget widgetDimension="30px" />
                    <Ratings.Widget widgetDimension="30px" />
                    <Ratings.Widget widgetDimension="30px" />
                    <Ratings.Widget widgetDimension="30px" />
                    <Ratings.Widget widgetDimension="30px" />
                  </Ratings>
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

function mapStateToProps({ books }, ownProps) {
  return { books: books[ownProps.match.params.id] };
}

export default connect(
  mapStateToProps,
  actions
)(AdminBook);
