import {mapObjIndexed, map} from 'ramda';

export const createElement = (tagName, attrs, childs) => {
	const elem = document.createElement(tagName);
	mapObjIndexed((val, attr) => elem.setAttribute(attr, val), attrs);
	if (childs && childs.length){
		map(c => elem.appendChild(c), childs);
	}
	return elem;
};
