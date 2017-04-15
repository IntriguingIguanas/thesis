import React from 'react'
import { connect } from 'react-redux'
import { LogIn } from '../actions/LogIn.js'
import { Link } from 'react-router'

export class LogInPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.submitLogIn(this.state.username, this.state.password)
    this.setState({
      username: '',
      password: ''
    })
  }

  render() {
    return (
      <div className='ui raised very padded text centered grid'>
        <div className = 'ui huge header'>Login</div>
        <form className='ui form' onSubmit={ this.handleSubmit }>
          <div className='field'>
            <label>Username:</label>
            <div className='ui left icon input'>
              <input
                type='text'
                value={ this.state.username }
                placeholder='Username'
                onChange={ this.handleUsernameChange }
              />
              <i className='user icon'></i>
            </div>
          </div>
          <div className='field'>
            <label>Password:</label>
            <div className='ui left icon input'>
              <input
                type='text'
                value={ this.state.password }
                placeholder='Password'
                onChange={ this.handlePasswordChange }
              />
              <i className='lock icon'></i>
            </div>
          </div>
          <button className='ui primary button' type='submit'>Login</button>
        </form>
        <div>{ this.props.error }</div>
        <div>Don't have an account?
          <Link to='/signup'> Sign Up</Link>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state,
    error: state.LogIn.error
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    submitLogIn: (username, password) => { dispatch(LogIn(username, password)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInPage)