import xs from 'xstream';
import {tap, omit, merge, identity} from 'ramda';


const deviceEvents = [];

const shakeGesture = () => {

	if (!window.DeviceMotionEvent) {
		return;
	}



	let last = null;

	const threshold = 2;
	const timeout = 1000;
	let lastTime = new Date();

	var query = window.matchMedia("(orientation:landscape)");
	const coord = query.matches ? "x" : "y";

	const deviceMotionHandler = eventData => {
		let info = null;
		var current = eventData.accelerationIncludingGravity;
		var currentTime;
		var timeDifference;

		if (last === null) {
			last = current.y;
			return
		}

		const delta = Math.abs(last - current[coord]);

		if (delta > threshold) {
			currentTime = new Date();
			timeDifference = currentTime.getTime() - lastTime.getTime();

			if (timeDifference > timeout) {
				deviceEvents.push({type: 'vertical-shake'});
				lastTime = new Date();
			}
		}

		last = current[coord];


	};
	window.addEventListener('devicemotion', deviceMotionHandler, false)
};

let streamInterval = 0;

const deviceEventsProducer = {
	start:  listener =>{
		streamInterval = setInterval(() => {
			if (deviceEvents.length > 0) {
				const event = deviceEvents.pop();
				if(event.type) {
					return listener.next(event)
				}
			}
		}, 100)

	},

	stop: () => {
		clearInterval(streamInterval)
	}
};


export const makeDeviceEvents = () => {

	shakeGesture();

	return sink_ => {
		const events_ = xs.create(deviceEventsProducer);
		const sinkObs_ = sink_.addListener( {
			next: action => {},
			complete: identity,
			error: identity
		});

		return { events_};
	}
};
