import React from 'react'
import Lobby from './Lobby.jsx'
import BoardPage from './BoardPage.jsx'
import { Link } from 'react-router'
import Video from './Video.jsx'

export class HomePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
    <div>
      <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand"><img src="./Logo.png"></img></a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li className="active"><Link to='/signup'>Sign Up</Link></li>
            <li><Link to='/login'>Login</Link></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
          </ul>
        </div>
      </div>
    </nav>
      <div className="jumbotron">
        <h1 className="homepage">Root.io is your one stop shop with all the tools necessary for live and remote collaboration.</h1>
        <h2 className="homepage">With shared project boards and video chat, your team can manage tasks seamlessly.</h2>
        <button className="btn btn-primary btn-lg" onClick={ this.props.route.sendToSignup }>Sign Up</button>
        <div onClick={ this.props.route.sendToLogin }>Already a Root.io user? Log in.</div>
      </div>
    </div>
    )
  }
}

export default HomePage

