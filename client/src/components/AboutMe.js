import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Divider,
  Container,
  Grid,
  Header
} from "semantic-ui-react";
import DocumentTitle from "react-document-title";

const AboutMe = () => (
  <DocumentTitle title={`About ${process.env.REACT_APP_WEBSITE_OWNER}`}>
    <Container fluid>
      <div
        style={{
          paddingTop: 2,
          textAlign: "center",
          background: "#404040 url(/tech-talk.jpg) no-repeat center",
          height: 375
        }}
      >
        <Header
          as="h1"
          style={{
            fontSize: "250%",
            color: "#fff",
            paddingTop: 325
          }}
        >
          About Me
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
              <Breadcrumb.Section active>About Me</Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="article">
          <Grid.Column>
            My name is Aaron and I grew up in Western Pennsylvania. I lived in
            The Midwest before moving to Southern California in 2012. I`ve been
    writing software professionally for two decades and have been
    managing teams for more than a decade.
            <br />
            <br />I began managing in 2008 when I oversaw a software team that
          scaled my home - grown e - commerce application.Recognizing that I
          lacked the necessary skills to be an effective manager, I began
          studying recruiting, hiring, management and leadership.I`ve since
                      put those skills to use and have built multiple software teams.
            <br />
            <br />I use and/or tinker with the below languages, libraries and
            frameworks:
            <br />
            <br />
            <Grid columns={3} divided>
              <Grid.Row>
                <Grid.Column>
                  <span style={{ fontWeight: "bold", color: "#000" }}>
                    Server Side:
                  </span>
                  <ul style={{ marginTop: 0 }}>
                    <li>.NET Framework (Visual C# / ASP.NET)</li>
                    <li>Node.js (NodeJS)</li>
                    <li>Go! (GoLang)</li>
                    <li>Python</li>
                  </ul>
                </Grid.Column>
                <Grid.Column>
                  <span style={{ fontWeight: "bold", color: "#000" }}>
                    Databases:
                  </span>
                  <ul style={{ marginTop: 0 }}>
                    <li>SQL Server</li>
                    <li>PostgreSQL</li>
                    <li>MongoDB</li>
                  </ul>
                </Grid.Column>
                <Grid.Column>
                  <span style={{ fontWeight: "bold", color: "#000" }}>
                    Client-Side:
                  </span>
                  <ul style={{ marginTop: 0 }}>
                    <li>JavaScript - ES5/ES6/ESNext</li>
                    <li>React/Redux</li>
                    <li>Angular</li>
                    <li>VueJS</li>
                    <li>Bootstrap</li>
                    <li>SemanticUI</li>
                  </ul>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br />
            <br />I recommend <a href="/books">reading these books</a>.<br />
            <br />
            If you enjoy management and leadership you`ll enjoy the{" "}
            <a href="http://feeds.harvardbusiness.org/harvardbusiness/ideacast">
              HBR IdeaCast
            </a>
            .If you write code you may enjoy the{" "}
            <a href="https://spec.fm/podcasts/toolsday">Toolsday</a> and{" "}
            <a href="https://www.udemy.com">Udemy</a>.
          </Grid.Column >
        </Grid.Row >
      </Grid >
    </Container >
  </DocumentTitle >
);

export default AboutMe;
