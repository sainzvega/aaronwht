import React, { Component } from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../actions/quotes";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Container,
  Grid,
  Header,
  Image,
  Segment
} from "semantic-ui-react";
import DocumentTitle from "react-document-title";
import { config } from "../config";

export class Quotes extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1 };
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.getPage(1);
  }

  getPage(currentPage) {
    if (currentPage !== this.state.currentPage) this.setState({ currentPage });
    this.props.fetchQuotes(currentPage);
  }

  displayQuoteImage(quote) {
    if (quote.thumbNail) {
      return (
        <Image
          src={`${config.imageUrl() + quote.thumbNail}`}
          height={quote.thumbNailHeight}
          width={quote.thumbNailWidth}
          circular
          centered
        />
      );
    } else {
      return ` `;
    }
  }

  renderList() {
    return map(this.props.quotes, quote => {
      return (
        <Grid.Column key={quote._id}>
          <Segment>
            <div style={{ height: "105px" }}>
              {this.displayQuoteImage(quote)}
            </div>
            <div
              style={{
                textAlign: "center",
                minHeight: "20px"
              }}
            >
              {quote.author}
            </div>
            <div
              style={{
                minHeight: "120px",
                fontSize: ".9em",
                paddingTop: "5px"
              }}
            >
              {quote.content}
            </div>
          </Segment>
        </Grid.Column>
      );
    });
  }

  displayList() {
    return (
      <Grid relaxed columns={3} stackable>
        {this.renderList()}
      </Grid>
    );
  }

  render() {
    return (
      <DocumentTitle title={`Inspiring Quotes - ${process.env.REACT_APP_WEBSITE_OWNER}`}>
        <Container fluid className="page-header">
          <Header as="h1" sub textAlign="center">
            Inspiring Quotes
          </Header>
          <Grid container>
            <Grid.Row className="article">
              <Grid.Column>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right angle" />
                  <Breadcrumb.Section active>Quotes</Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>{this.displayList()}</Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </DocumentTitle>
    );
  }
}

function mapStateToProps({ quotes }) {
  return {
    quotes: quotes.quotes,
    maxQuotesReturned: quotes.maxQuotesReturned,
    totalQuotesCount: quotes.totalQuotesCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(Quotes);
