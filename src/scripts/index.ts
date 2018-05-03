import * as ReactDOM from 'react-dom';
import { sp } from '@pnp/sp';
import { setupPnp } from './utils/odata';
import root from './root';

setupPnp();

const container: HTMLElement = document.getElementById('listform-cewp-container');

SP.SOD.executeOrDelayUntilScriptLoaded(() => {
  ReactDOM.render(root, container);
  console.log('loaded');
}, 'SP.js');
