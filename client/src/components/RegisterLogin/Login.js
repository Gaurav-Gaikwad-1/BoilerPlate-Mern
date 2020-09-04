import React, { Component } from 'react'
import { connect }  from 'react-redux';
import {loginUser} from '../../_actions/user_actions';
class Login extends Component {
    state={
        email:"",
        password:""
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    submitForm = event => {
        event.preventDefault();
        let dataToSubmit = {
            email:this.state.email,
            password: this.state.password
        }
        this.props.dispatch(loginUser(dataToSubmit))
        .then(response => console.log(response))
    }
    render() {
        return (
            <div className='container'>
                <h3>Login</h3>
                <div className="row">
                    <form className="col s12" onSubmit={event => this.submitForm(event)}>
                        <div className="row">
                            <div className="input-field col s12">
                                <div>
                                    <label htmlFor="email">Email</label>
                                </div>
                            
                                <input 
                                    name="email"
                                    value={this.state.email}
                                    onChange={e => this.handleChange(e)}
                                    id="email"
                                    type="email"
                                    className="validate"
                                /> 
                                   
                            </div>
                            <div className="input-field col s12">
                                <div>
                                    <label htmlFor="password">Password</label>
                                </div>
                                <input 
                                    name="password"
                                    value={this.state.password}
                                    onChange={e => this.handleChange(e)}
                                    id="password"
                                    type="password"
                                    className="validate"
                                /> 
                            </div>   `
                        </div>
                        <div className="row">
                            <div className="col 12">
                                <button className="btn waves-effect red lighten-2">
                                    Login
                                </button>
                            </div>
                        </div>
                        
                    </form>
                </div>
                
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        user:state.user
    }
}
export default connect(mapStateToProps)(Login);
