'use strict';
import {curry} from 'ramda';

export const log = (msg) => console.error(msg, args);

export const logError = curry((msg, error) => console.error(msg, error) );