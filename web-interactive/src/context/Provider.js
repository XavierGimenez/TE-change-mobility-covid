import React, { Component } from 'react';
import { Context } from './Context';


export class Provider extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };
    }



    
    render() {
        return (
            <Context.Provider value={{
                ...this.state
            }}>
                { this.props.children }
            </Context.Provider>
        );
    }
}