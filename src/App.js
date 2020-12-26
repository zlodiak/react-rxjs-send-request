import React from 'react';
import { BehaviorSubject } from 'rxjs';

const withObservableStream = (observable, triggers) => Component => {
  return class extends React.Component {
    componentDidMount() {
      this.subscription = observable.subscribe(newState =>
        this.setState({ ...newState }),
      );
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return (
        <Component {...this.props} {...this.state} {...triggers} />
      );
    }
  };
};

const App = ({ query = '', onChangeQuery }) => (
  <div>
    <h1>React with RxJS</h1>

    <input
      type="text"
      value={query}
      onChange={event => onChangeQuery(event.target.value)}
    />

    <p>{`http://hn.algolia.com/api/v1/search?query=${query}`}</p>
  </div>
);

const query$ = new BehaviorSubject({ query: 'react' });

export default withObservableStream(
  query$,
  {
    onChangeQuery: value => query$.next({ query: value }),
  }
)(App);