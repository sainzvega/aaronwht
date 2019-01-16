import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Button,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Dimmer,
  Loader,
  Input,
  TextArea
} from "semantic-ui-react";
import DocumentTitle from "react-document-title";
import { config } from "../config";

class ContactMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageSent: false,
      processing: false,
      displayMessage: "",
      name: "",
      email: "",
      subject: "",
      message: ""
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onNameChange(event) {
    this.setState({ name: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onSubjectChange(event) {
    this.setState({ subject: event.target.value });
  }

  onMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ displayMessage: "" });

    if (this.state.name === "") {
      this.setState({ displayMessage: "Please enter your Name" });
      return;
    }

    if (this.state.email === "") {
      this.setState({ displayMessage: "Please enter your Email" });
      return;
    }

    if (this.state.message === "") {
      this.setState({ displayMessage: "Please enter a Message" });
      return;
    }

    this.setState({ processing: true });

    axios
      .post(`${config.api()}email`, {
        name: this.state.name,
        email: this.state.email,
        subject: this.state.subject,
        message: this.state.message
      })
      .then(response => {
        if (response.data.status === "error") {
          this.setState({
            displayMessage: response.data.message,
            processing: false
          });
        } else {
          this.setState({
            displayMessage: "Your message was sent successfully.",
            processing: false
          });
          this.setState({ messageSent: true, processing: false });
        }
      });
  }

  displayForm() {
    return (
      <Form onSubmit={this.onFormSubmit}>
        <div style={{ color: "red", minHeight: 25 }}>
          {this.state.displayMessage}
        </div>
        <Form.Field width={8}>
          <label>Name</label>
          <Input
            type="text"
            value={this.state.name}
            onChange={this.onNameChange}
          />
        </Form.Field>
        <Form.Field width={8}>
          <label>Email</label>
          <Input
            type="text"
            value={this.state.email}
            onChange={this.onEmailChange}
          />
        </Form.Field>
        <Form.Field width={8}>
          <label>Subject</label>
          <Input
            type="text"
            value={this.state.subject}
            onChange={this.onSubjectChange}
          />
        </Form.Field>
        <Form.Field width={8}>
          <label>Message</label>
          <TextArea
            value={this.state.content}
            onChange={this.onMessageChange}
            rows={5}
          />
        </Form.Field>
        <Form.Field>
          <Button action="submit" primary>
            Send
          </Button>
        </Form.Field>
      </Form>
    );
  }

  processing() {
    return (
      <Dimmer active inverted>
        <Loader size="medium">Sending Message</Loader>
      </Dimmer>
    );
  }

  displayPage() {
    if (!this.state.processing) {
      return this.displayForm();
    } else {
      return this.processing();
    }
  }

  render() {
    return (
      <DocumentTitle title={`Contact ${process.env.REACT_APP_WEBSITE_OWNER}`}>
        <Container fluid>
          <div
            style={{
              paddingTop: 2,
              textAlign: "center",
              background: "#fff url(/contact-aaron.jpg) no-repeat center",
              height: 375
            }}
          >
            <Header
              as="h1"
              style={{ fontSize: "250%", color: "#fff", paddingTop: 325 }}
            >
              Contact Me
            </Header>
          </div>
          <Divider hidden />
          <Grid container>
            <Grid.Row className="article">
              <Grid.Column>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Contact Me</Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="article">
              <Grid.Column>
                {!this.state.messageSent
                  ? this.displayPage()
                  : this.state.displayMessage}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </DocumentTitle>
    );
  }
}

export default ContactMe;
