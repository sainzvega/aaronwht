import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/quotes";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Breadcrumb,
  Container,
  Form,
  Grid,
  Segment,
  TextArea
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import "react-select/dist/react-select.css";
import { config } from "../../config";

class AdminQuote extends Component {
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
      content: "",
      author: "",
      authorId: "",
      selectedAuthor: {},
      authorLoaded
    };

    this.handleAuthorSearch = this.handleAuthorSearch.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.typeAheadChange = this.typeAheadChange.bind(this);
  }

  typeAheadChange(value) {
    this.setState({ selectedAuthor: value });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ errorMessage: "" });

    this.props.createOrUpdateQuote(
      this.props.match.params.id,
      this.state.selectedAuthor.authorId,
      this.state.selectedAuthor.author,
      this.state.content
    );

    this.props.history.push("/admin/quotes");
  }

  componentWillMount() {
    if (
      typeof this.props.match.params.id !== "undefined" &&
      Number(this.props.match.params.id) !== 0
    ) {
      this.props.fetchAdminQuote(this.props.match.params.id);
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
    if (nextProps.quotes) {
      const { quotes } = nextProps;
      this.setState({
        content: quotes.content,
        authorId: quotes.authorId ? quotes.authorId : "",
        author: quotes.author,
        selectedAuthor: { author: quotes.author, authorId: quotes.authorId },
        authorLoaded: true
      });
    }
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
                    <Link to="/admin/quotes">Quotes</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Quote</Breadcrumb.Section>
                </Breadcrumb>
                <br />
                <br />
                <Form.Field width={10}>
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
                <Form.Field width={10}>
                  <label>Content</label>
                  <TextArea
                    name="content"
                    value={this.state.content}
                    onChange={this.handleChange}
                    rows={7}
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

function mapStateToProps({ quotes }, ownProps) {
  return { quotes: quotes[ownProps.match.params.id] };
}

export default connect(
  mapStateToProps,
  actions
)(AdminQuote);
