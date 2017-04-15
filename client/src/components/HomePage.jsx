import React from 'react'
import Lobby from './Lobby.jsx'
import BoardPage from './BoardPage.jsx'

export class HomePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
      <div className="ui large top fixed menu transition visible">
        <div className="ui container">
          <div className="right menu">
            <div className="item" onClick={ this.props.route.sendToLogin }>
              <a className="ui button">Log in</a>
            </div>
            <div className="item" onClick={ this.props.route.sendToSignup }>
              <a className="ui primary button">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1>Root.io is your one stop shop with all the tools necessary for live and remote collaboration.</h1>
        <h1>Root.io is your one stop shop with all the tools necessary for live and remote collaboration.</h1>
        <h2>With shared project boards and video chat, your team can manage tasks seamlessly.</h2>
        <button onClick={ this.props.route.sendToSignup }>Sign Up</button>
        <div onClick={ this.props.route.sendToLogin }>Already a Root.io user? Log in.</div>
      </div>
      </div>


    )
  }
}

export default HomePage

