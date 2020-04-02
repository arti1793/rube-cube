import { Playground } from './Playground/Platground';

const appendTo = document.body;
((window as unknown) as { playground: Playground }).playground = new Playground(
  appendTo
);
