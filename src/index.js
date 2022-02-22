import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'cross-fetch';
import './index.css';

const PETERPORTAL_REST_URL = 'https://api.peterportal.org/rest/v0'
const PETERPORTAL_GQL_URL = 'https://api.peterportal.org/graphql'
const DEPARTMENT_ALIASES = {
  'COMPSCI': /^CS/gm,
  'I&CSCI': /^ICS/gm,
  'IN4MATX': /^INF/gm
}

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
      <h1>Add your favorite classes below!</h1>
      <form onSubmit={this.handleSubmit}>
        <label>Class ID: </label>
        <input type='text'
        value={this.state.value}
        onChange={this.handleChange}
        title="Enter the class ID (case insensitive) here.
        Shortened department names are fine (CS161 will resolve to COMPSCI161),
        as are spaces (I&amp;C SCI 33 will resolve to I&amp;CSCI33)." />
        <input className='submit' type='submit' value='Submit' />
      </form>
      </>
    );
  }
}

class Class extends React.Component {
  constructor(props) {
    super(props);
    let sanitizedName = this.props.name.replaceAll(' ', '').toUpperCase();
    Object.keys(DEPARTMENT_ALIASES).map(
      (k) => (sanitizedName = sanitizedName.replace(DEPARTMENT_ALIASES[k], k))
    );
    this.state = {sanitizedName: sanitizedName, restRes: null, instructors: null};
  }

  async componentDidMount() {
    const restRes = await fetch(
      `${PETERPORTAL_REST_URL}/courses/${this.state.sanitizedName}`,
      {'method': 'GET'}).then(res => res.json());
    const instructors = await fetch(
      PETERPORTAL_GQL_URL, {
        'method': 'POST',
        'body': JSON.stringify({query: `
          query {
            course(id: "${this.state.sanitizedName}") {
              instructor_history {
                name
              }
            }
          }
        `}),
        'headers' : {
          'Content-Type': 'application/json'
        }
      }
    ).then(res => res.json());
    this.setState({
      sanitizedName: this.state.sanitizedName,
      restRes: restRes,
      instructors: instructors.data.course.instructor_history.map((i) => i == null ? 'Unknown' : i.name)
    });
  }
  
  render() {
    return this.state.restRes == null ? null : (
      <>
        <h2>{this.state.restRes.department} {this.state.restRes.number}: {this.state.restRes.title}</h2>
        <h3>Past instructors:</h3>
        <ul>
        {this.state.instructors.map((i) => <li>{i}</li>)}
        </ul>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);
