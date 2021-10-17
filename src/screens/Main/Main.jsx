import React, { Component } from 'react';

export default class Main extends React.Component {

	constructor () {
		super()
		this.state = {Reactive : true}
	}

	render() {
		return (
			<div className="Main"> 
			   <h1>React Starter App</h1>
			</div> 
		);
	}
}
