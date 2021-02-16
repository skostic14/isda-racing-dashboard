import logo from './logo.svg';
import './App.css';
import SignUp from './SignUp/SignUp';
import RaceResults from './RaceResults/RaceResults.js';
import SeasonStandings from './RaceResults/SeasonStandings.js';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import 'typeface-roboto';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/signup" component={SignUp}></Route>
          <Route path="/results" component={RaceResults}></Route>
          <Route path="/standings" component={SeasonStandings}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
