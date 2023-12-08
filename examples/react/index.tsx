import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import invariant from 'tiny-invariant';
import Icon1 from './icon1.svg?sprite-react';
import Icon2 from './icon2.svg?sprite-react';

const el = document.getElementById('app');
invariant(el);
const root = createRoot(el);

root.render(
  <StrictMode>
    <div>
      <Icon1 />
      <Icon2 />
    </div>
  </StrictMode>,
);
