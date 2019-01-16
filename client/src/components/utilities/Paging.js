import React, { Component } from "react";
import { Menu, Icon, Table } from "semantic-ui-react";

class Paging extends Component {
  constructor(props) {
    super(props);
    this.getPage = this.getPage.bind(this);
  }

  getPage(page) {
    this.props.getPage(page);
  }

  displayPaging() {
    let maxRecordsReturned = this.props.maxRecordsReturned;
    let totalRecords = this.props.totalRecords;
    const pages = Math.ceil(totalRecords / maxRecordsReturned);
    let rows = [];

    if (!isNaN(pages) && pages > 1) {
      if (this.props.currentPage === 1) {
        rows.push(
          <Menu.Item key={"footer_menu_first"} disabled={true} icon>
            <Icon name="chevron left" />
          </Menu.Item>
        );
      } else {
        rows.push(
          <Menu.Item
            key={"footer_menu_first"}
            onClick={() => this.getPage(1)}
            icon
          >
            <Icon name="chevron left" />
          </Menu.Item>
        );
      }

      for (let i = 1; i <= pages; i++) {
        if (i === this.props.currentPage) {
          rows.push(
            <Menu.Item
              key={"paging_" + i}
              link={false}
              style={{ fontWeight: "bold" }}
            >
              {i}
            </Menu.Item>
          );
        } else {
          rows.push(
            <Menu.Item onClick={() => this.getPage(i)} key={"paging_" + i}>
              {i}
            </Menu.Item>
          );
        }
      }

      if (pages === this.props.currentPage) {
        rows.push(
          <Menu.Item key={"footer_menu_last"} disabled={true} icon>
            <Icon name="chevron right" />
          </Menu.Item>
        );
      } else {
        rows.push(
          <Menu.Item
            key={"footer_menu_last"}
            as="a"
            onClick={() => this.getPage(this.props.currentPage + 1)}
            icon
          >
            <Icon name="chevron right" />
          </Menu.Item>
        );
      }

      return (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Menu pagination>{rows}</Menu>
              <br />
              {`Total ${this.props.label}: ${this.props.totalRecords}`}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      );
    } else {
      return (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              {`Total ${this.props.label}: ${this.props.totalRecords}`}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      );
    }
  }

  render() {
    return this.displayPaging();
  }
}

export default Paging;
