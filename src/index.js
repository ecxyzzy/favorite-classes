import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', classes: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.classes.push(this.state.value);
    this.setState({value: '', classes: this.state.classes});
  }

  render() {
    return (
      <>
      <h1>Favorite Classes</h1>
      <ul>
        {this.state.classes.map((c) => <Class name={c} />)}
      </ul>
      <h2>Add your favorite classes below!</h2>
      <form onSubmit={this.handleSubmit}>
        <label>Class Name: </label>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input class="submit" type="submit" value="Submit" />
      </form>
      </>
    )
  }
}

class Class extends React.Component {
  render() {
    return (
      <li>{this.props.name}</li>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);
