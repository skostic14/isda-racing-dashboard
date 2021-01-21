import logo from './logo.svg';
import './App.css';
import SignUp from './SignUp/SignUp';
import RaceResults from './RaceResults/RaceResults.js';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Switch>
        <Route path="/index"><SignUp/></Route>
        <Route path="/results"><RaceResults/></Route>
      </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;
