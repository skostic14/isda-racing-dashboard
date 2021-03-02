import logo from './logo.svg';
import './App.css';
import SignUp from './SignUp/SignUp.js';
import RaceResults from './RaceResults/RaceResults.js';
import SeasonStandings from './RaceResults/SeasonStandings.js';
import EnduranceTeamSignUp from './SignUp/Endurance_SignUp.js';
import Calendar from './Calendar/Calendar.js';
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
          <Route path="/calendar" component={Calendar}></Route>
          <Route path="/team_signup" component={EnduranceTeamSignUp}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
