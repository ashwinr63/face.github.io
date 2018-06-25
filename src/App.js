import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
	apiKey: 'e7d4b611ae8e466592389d540f23a118'
});


const particleOption =
{
	particles: {
		number: {
			value: 30,
			density: {
				enable: true,
				value_area: 700
			}
		}
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageURL: '',
			box: {},
		}
	}

	calculateFaceLocation = (data) => {

		// eslint-disable-next-line
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

		const image = document.getElementById('inputImage');

		const width = Number(image.width);

		const height = Number(image.height);

		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
		//console.log(width, height);

	}

	displayFaceBox = (box) => {
		console.log(box)
		this.setState({box: box})
	}
	
	
	onInputChange = (event) => {
		this.setState({ input: event.target.value })
	}


	onButtonSubmit = () => {
		this.setState({ imageURL: this.state.input });
		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL,
				this.state.input)
			// do something with response
			.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
			.catch(err => console.log(err));
	}
	render() {
		return (
			<div className="App">
				<Particles className='particles'
					params={particleOption}
				/>
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
				<FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
			</div>
		);
	}
}

export default App;
