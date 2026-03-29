import React, { useEffect, useState } from 'react';
import { MicrofrontRegistry } from '../services/MicrofrontRegistry';

const MicrofrontLoader = ({ name }: { name: string }) => {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    const app = MicrofrontRegistry.find((m: any) => m.name === name);
    if (!app) return;

    const loadRemoteModule = async () => {

      if (!window[app.name]) {
        const script = document.createElement('script');
        script.src = app.url;
        script.onload = async () => {
          try {
            await (__webpack_init_sharing__ as any)('default');
            const container = (window as any)[app.name];
            await container.init((__webpack_share_scopes__ as any).default);
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
          await (__webpack_init_sharing__ as any)('default');
          const container = (window as any)[app.name];
          await container.init((__webpack_share_scopes__ as any).default);
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
