import { render } from 'solid-js/web';
import invariant from 'tiny-invariant';
import Icon1 from './icon1.svg?sprite-solid';
import Icon2 from './icon2.svg?sprite-solid';

const el = document.getElementById('app');
invariant(el);

render(
  () => (
    <div>
      <Icon1 />
      <Icon2 />
    </div>
  ),
  el,
);
