const hash = (time) => ~~time;

const TimeMapI = Object.assign(Object.create(null), {
	init(){
		this._map = {};
		return this;
	},
	add(time, data){
		const h = hash(time);
		this._map[h] = (this._map[h] || []).concat(data);
		return this;
	},
	get(time){
		return this._map[hash(time)] || [];
	}
});

export const TimeMap = () => Object.create(TimeMapI).init();
