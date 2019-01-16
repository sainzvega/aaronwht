import React from "react";
import { Container, Icon, Segment } from "semantic-ui-react";

const Footer = () => (
  <Segment secondary fixed="bottom">
    <Container textAlign="center">
      <a
        href={`https://www.twitter.com/${process.env.REACT_APP_TWITTER}`}
        style={{ textDecoration: "none", color: "#2986CD" }}
      >
        <Icon name="twitter" size="big" />
      </a>
      &#160;&#160;&#160;&#160;
      <a
        href={`https://www.linkedin.com/in/${process.env.REACT_APP_LINKED_IN}`}
        style={{ textDecoration: "none", color: "#2986CD" }}
      >
        <Icon name="linkedin" size="big" />
      </a>
      &#160;&#160;&#160;&#160;
      <a
        href="/contact-me"
        style={{ textDecoration: "none", color: "#2986CD" }}
      >
        <Icon name="mail" size="big" />
      </a>
    </Container>
  </Segment>
);

export default Footer;
