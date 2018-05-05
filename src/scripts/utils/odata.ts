import { sp } from '@pnp/sp';

// Use 'application/json;odata=verbose' for compatibility with SP2013
//export const ODataMode = 'application/json';
//export const ODataMode = 'application/json;odata=minimalmetadata';
export const ODataMode = 'application/json;odata=verbose';

export const setupPnp = (webUrl: string) => {
  sp.setup({
    sp: {
      headers: {
        Accept: ODataMode
      },
      baseUrl: webUrl
    }
  });
};
