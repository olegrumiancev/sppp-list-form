import { sp } from '@pnp/sp';
import { setupPnp } from './utils/odata';
import root from './root';
require('es6-set/implement');
import * as ReactDOM from 'react-dom';
import * as React from 'react';

setupPnp();

const container: HTMLElement = document.getElementById('listform-cewp-container');

SP.SOD.executeOrDelayUntilScriptLoaded(() => {
  ReactDOM.render(root, container);
  console.log('loaded');
}, 'SP.js');
