import * as React from 'react';
import { Component } from 'react';
import './body.scss';

export class Body extends Component{
    render(){
        return <div className="body"></div>;
    }
}

export default class BodyContainer extends Component{
    render(){
        return <Body {...this.props}/>;
    }
}