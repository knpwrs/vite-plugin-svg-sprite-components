import invariant from 'tiny-invariant';
import Icon1 from './icon1.svg?sprite';
import Icon2 from './icon2.svg?sprite';

const el = document.getElementById('app');
invariant(el);
el.innerHTML = `${Icon1}${Icon2}`;
