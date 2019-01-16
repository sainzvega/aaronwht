import React, { Component } from "react";
import Paging from "../utilities/Paging";
import { map } from "lodash";
import { connect } from "react-redux";
import * as actions from "../../actions/quotes";
import { Link } from "react-router-dom";
import { getQuotes } from "../../selectors/selectors_quotes";
import { Breadcrumb, Container, Grid, Segment, Table } from "semantic-ui-react";

class AdminQuotes extends Component {
  constructor(props) {
    super(props);

    this.state = { currentPage: 1 };
    this.getPage = this.getPage.bind(this);
  }

  componentWillMount() {
    this.props.fetchQuotes(this.state.currentPage);
  }

  getPage(page) {
    this.fetchQuotes(page);
  }

  fetchQuotes(page) {
    this.setState({ currentPage: page });
    this.props.fetchQuotes(page);
  }

  renderList() {
    return map(this.props.quotes, quote => {
      return (
        <Table.Row key={quote._id}>
          <Table.Cell>
            <Link to={`/admin/quote/${quote._id}`}>{quote.content}</Link>
            <br />
            {quote.author}
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  displayList() {
    if (this.props.totalQuotesCount !== 0) {
      return (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Quote</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderList()}</Table.Body>

          <Paging
            getPage={this.getPage}
            label={"Quotes"}
            totalRecords={this.props.totalQuotesCount}
            maxRecordsReturned={this.props.maxQuotesReturned}
            currentPage={this.state.currentPage}
          />
        </Table>
      );
    }
  }

  render() {
    return (
      <Container fluid style={{ marginTop: "2em" }}>
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
                <Breadcrumb.Section active>Quotes</Breadcrumb.Section>
              </Breadcrumb>
              <br />
              <br />

              <Link to={`/admin/quote/0`}>Add Quote</Link>
              <br />
              {this.displayList()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps({ quotes }) {
  return {
    quotes: getQuotes(quotes),
    maxQuotesReturned: quotes.maxQuotesReturned,
    totalQuotesCount: quotes.totalQuotesCount
  };
}

export default connect(
  mapStateToProps,
  actions
)(AdminQuotes);
