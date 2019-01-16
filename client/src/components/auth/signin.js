import React, { Component } from "react";
import { connect } from "react-redux";
import { signinUser } from "../../actions";
import {
  Button,
  Container,
  Form,
  Header,
  Message,
  Grid,
  Input,
  Segment
} from "semantic-ui-react";
import * as actions from "../../actions";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", password: "", errorMessage: "" };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage)
      this.setState({ errorMessage: nextProps.errorMessage });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ errorMessage: "" });
    if (this.state.email === "" || this.state.password === "") {
      this.setState({ errorMessage: "Please enter your Email and Password." });
      return;
    }
    this.props.signinUser(
      this.state.email,
      this.state.password,
      this.props.history
    );
  }

  renderHeader() {
    if (this.state.errorMessage) {
      return (
        <Message error>
          <strong>{this.state.errorMessage}</strong>
        </Message>
      );
    } else {
      return <Header>Sign In</Header>;
    }
  }

  render() {
    return (
      <Container fluid>
        <Grid columns="equal">
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <Segment.Group>
              <Message attached="top">{this.renderHeader()}</Message>
              <Segment>
                <Form onSubmit={this.onFormSubmit}>
                  <Form.Field width={3}>
                    <label>Email</label>
                    <Input
                      type="text"
                      value={this.state.email}
                      onChange={this.onEmailChange}
                    />
                  </Form.Field>
                  <Form.Field width={3}>
                    <label>Password</label>
                    <Input
                      type="password"
                      value={this.state.password}
                      onChange={this.onPasswordChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Button action="submit" primary>
                      Sign In
                    </Button>
                  </Form.Field>
                </Form>
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, { signinUser, actions })(Signin);
