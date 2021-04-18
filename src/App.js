import './App.css';
import RaceResults from './RaceResults/RaceResults.js';
import SeasonStandings from './RaceResults/SeasonStandings.js';
import SignupList from './SignUp/SignupList.js';
import Calendar from './Calendar/Calendar.js';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import 'typeface-roboto';

import DashboardSignUp from './DashboardLogin/SignUp.js';
import { AuthProvider } from './Authentication/AuthContext.js';
import Login from './DashboardLogin/Login.js';
import PasswordReset from './DashboardLogin/PasswordReset.js';
import CompleteDriverProfile from './DashboardLogin/CompleteDriverProfile.js';
import Dashboard from './DashboardMain/Dashboard.js';
import Logout from './DashboardLogin/Logout.js';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/results" component={RaceResults}></Route>
            <Route path="/standings" component={SeasonStandings}></Route>
            <Route path="/calendar" component={Calendar}></Route>
            <Route path="/sign_up" component={DashboardSignUp}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/password_reset" component={PasswordReset}></Route>
            <Route path="/complete_profile" component={CompleteDriverProfile}></Route>
            <Route exact path="/" component={Dashboard}></Route>
            <Route path='/logout' component={Logout}></Route>
            <Route path='/entry_lists' component={SignupList}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
