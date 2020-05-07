import { Playground } from './Playground/Playground';

const appendTo = document.body;
((window as unknown) as { playground: Playground }).playground = new Playground(
  appendTo
);
