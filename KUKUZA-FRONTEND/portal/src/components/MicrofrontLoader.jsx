import React, { useEffect, useState } from 'react';
import { MicrofrontRegistry } from '../services/MicrofrontRegistry';

const MicrofrontLoader = ({ name }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const app = MicrofrontRegistry.find(m => m.name === name);
    if (!app) return;

    const loadRemoteModule = async () => {

      if (!window[app.name]) {
        const script = document.createElement('script');
        script.src = app.url;
        script.onload = async () => {
          try {
            await __webpack_init_sharing__('default');
            const container = window[app.name];
            await container.init(__webpack_share_scopes__.default);
            const factory = await container.get(app.module);
            const Module = factory();
            setComponent(() => Module.default || Module);
          } catch (err) {
            console.error('Failed to load remote module', err);
          }
        };
        document.head.appendChild(script);
      } else {
        try {
          await __webpack_init_sharing__('default');
          const container = window[app.name];
          await container.init(__webpack_share_scopes__.default);
          const factory = await container.get(app.module);
          const Module = factory();
          setComponent(() => Module.default || Module);
        } catch (err) {
          console.error('Failed to load remote module', err);
        }
      }
    };

    loadRemoteModule();
  }, [name]);

  return Component ? <Component /> : <p>Chargement de {name}...</p>;
};

export default MicrofrontLoader;
