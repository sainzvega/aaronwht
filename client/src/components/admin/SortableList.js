import React from "react";
import SortableItem from "./SortableItem";
import { connect } from "react-redux";
import * as actions from "../../actions/books";
import { getBooks } from "../../selectors/selectors_books";
import { Grid } from "semantic-ui-react";
import { config } from "../../config";

class SortableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { items: this.props.items };
  }

  displayImage(thumbNail) {
    if (thumbNail)
      return <img src={`${config.imageUrl() + thumbNail}`} alt="img" />;
    else return "";
  }

  onSortItems = items => {
    let temp = [];

    for (let i = 0; i < items.length; i++) {
      temp.push({
        _id: items[i]._id,
        title: items[i].title,
        thumbNail: items[i].thumbNail,
        author: items[i].author,
        ordinal: i
      });
    }

    this.setState({
      items: temp
    });

    this.props.sortBooks(temp);
  };

  render() {
    const { items } = this.state;
    var listItems = items.map((item, i) => {
      // return `${item.title} `;

      return (
        <SortableItem
          key={item._id}
          onSortItems={this.onSortItems}
          item={item}
          items={items}
          sortId={i}
        />
      );
    });

    return (
      <Grid relaxed columns={3} stackable>
        {listItems}
      </Grid>
    );
  }
}

function mapStateToProps({ books }) {
  return {
    books: getBooks(books)
  };
}

export default connect(
  mapStateToProps,
  actions
)(SortableList);
