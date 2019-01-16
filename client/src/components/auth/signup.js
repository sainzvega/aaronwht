import React, { Component } from "react";
import { connect } from "react-redux";
import { signupUser } from "../../actions";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Input,
  Message,
  Segment
} from "semantic-ui-react";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
      errorMessage: ""
    };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordConfirmChange = this.onPasswordConfirmChange.bind(this);
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

  onPasswordConfirmChange(event) {
    this.setState({ passwordConfirm: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.setState({ errorMessage: "" });
    if (this.state.email === "" || this.state.password === "") {
      this.setState({ errorMessage: "Please enter your Email and Password." });
      return;
    }
    if (this.state.passwordConfirm === "") {
      this.setState({ errorMessage: "Please confirm your Password." });
      return;
    }
    if (this.state.passwordConfirm !== this.state.password) {
      this.setState({ errorMessage: "Passwords do not match." });
      return;
    }
    this.props.signupUser(
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
      return <Header>Sign Up</Header>;
    }
  }

  render() {
    if (!this.props.authenticated) {
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
                    <Form.Field width={3}>
                      <label>Confirm Password</label>
                      <Input
                        type="password"
                        value={this.state.passwordConfirm}
                        onChange={this.onPasswordConfirmChange}
                      />
                    </Form.Field>
                    <Form.Field width={3}>
                      <Button action="submit" primary>
                        Sign Up
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
    } else {
      return <div>You have created an account and are Signed In</div>;
    }
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, { signupUser })(Signup);
