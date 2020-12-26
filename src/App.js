import React from 'react';
import { BehaviorSubject, combineLatest } from 'rxjs/index';

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

const SUBJECT = {
  POPULARITY: 'search',
  DATE: 'search_by_date',
};

const App = ({
  query = '',
  subject,
  onChangeQuery,
  onSelectSubject,
}) => (
  <div>
    <h1>React with RxJS</h1>

    <input
      type="text"
      value={query}
      onChange={event => onChangeQuery(event.target.value)}
    />

    <div>
      {Object.values(SUBJECT).map(value => (
        <button
          key={value}
          onClick={() => onSelectSubject(value)}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>

    <p>{`http://hn.algolia.com/api/v1/${subject}?query=${query}`}</p>
  </div>
);

const query$ = new BehaviorSubject('react');
const subject$ = new BehaviorSubject(SUBJECT.POPULARITY);

export default withObservableStream(
  combineLatest(subject$, query$, (subject, query) => ({
    subject,
    query,
  })),
  {
    onChangeQuery: value => query$.next(value),
    onSelectSubject: subject => subject$.next(subject),
  },
)(App);