import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Container, Grid, Header } from "semantic-ui-react";
import DocumentTitle from "react-document-title";

const PageNotFound = () => (
  <DocumentTitle title={`Page Not Found - ${process.env.REACT_APP_WEBSITE_OWNER}`}>
    <Container fluid className="page-header">
      <Header as="h1" style={{ fontSize: "250%", color: "#fff" }}>
        Page Not Found
      </Header>

      <Grid container>
        <Grid.Row className="article">
          <Grid.Column>
            <Breadcrumb>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section active>Page Not Found</Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="article">
          <Grid.Column>
            <p style={{ fontSize: "1.15em" }}>
              <br />
              The page you requested wasn`t found.
              <br />
              <br />
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </DocumentTitle>
);

export default PageNotFound;
