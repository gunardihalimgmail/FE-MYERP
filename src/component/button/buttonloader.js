import React, { Component } from "react";
import { Modal, Button, Container, Row, Col, Spinner } from "react-bootstrap";

export default class ButtonLoader extends Component {
  state = {
    loading: false,
    btnVal :  this.props.value
  };

  fetchData = () => {
    this.setState({ loading: true });

    this.props.onClick(this.props.value);

    //Faking API call here
    setTimeout(() => {
      this.setState({ loading: false });
    }, 60000); //Milisecond
  };

  render() {
    const { loading } = this.state;
    const { btnVal } = this.state;

    return (
      <Button variant={btnVal === "Approve" ? 'primary' : 'danger'} onClick={this.fetchData} disabled={loading}>
        {loading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          /> 
        )}
        {loading && <span> &nbsp; Please Wait..</span>}
        {!loading && <span>{btnVal}</span>}
      </Button>
    );
  }
}
