'use strict';
import {curry} from 'ramda';

export const log = (msg) => console.log(msg);

export const logError = curry((msg, error) => console.error(msg, error) );