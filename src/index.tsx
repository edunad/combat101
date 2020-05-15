'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App/App';

window['app-element'] = document.getElementById('app-container');
ReactDOM.render(<App />, window['app-element']);