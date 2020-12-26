import { Playground } from './Playground/Playground';

const appendTo = document.querySelector('.cube-rube');
((window as unknown) as { playground: Playground }).playground = new Playground(
  appendTo
);
