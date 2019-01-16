import React, { Component } from "react";
import { sortable } from "react-sortable";
import { Link } from "react-router-dom";
import { Grid, Icon } from "semantic-ui-react";
import { config } from "../../config";

class SortableItem extends Component {
  displayImage(thumbNail) {
    if (thumbNail)
      return <img src={`${config.imageUrl() + thumbNail}`} alt="img" />;
    else return "";
  }

  displayRating(id, rating) {
    if (typeof rating === "undefined" || rating === 0) return;
    let ratings = [];
    for (let i = 1; i <= rating; i++)
      ratings.push(<Icon key={id + i} name="star" />);

    return ratings;
  }

  render() {
    return (
      <Grid.Column
        {...this.props}
        textAlign="center"
        verticalAlign="bottom"
        key={this.props.item._id}
      >
        <Link to={`/admin/book/${this.props.item._id}`}>
          {this.displayImage(this.props.item.thumbNail)}
          <br />
          {this.props.item.title}
          <br />
          by {this.props.item.author}
          <br />
          {this.displayRating(this.props.item._id, this.props.item.rating)}
        </Link>
      </Grid.Column>
    );
  }
}

export default sortable(SortableItem);
