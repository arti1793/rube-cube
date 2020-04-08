import { Vector3 } from 'three';
import { Algorithm, Node } from './algorithm/algorithm';
import { Playground } from './Playground/Playground';

const appendTo = document.body;
((window as unknown) as { playground: Playground }).playground = new Playground(
  appendTo
);
((window as unknown) as { algorithm: Algorithm }).algorithm = new Algorithm();

((window as unknown) as { mockComplete: any }).mockComplete = [
  { colors: [16776960, 16777215, 65280], coords: new Vector3(0, 0, 0) },
  { colors: [16776960, 16777215], coords: new Vector3(0, 0, 1) },
  { colors: [16776960, 16777215, 255], coords: new Vector3(0, 0, 2) },
  { colors: [16776960, 65280], coords: new Vector3(0, 1, 0) },
  { colors: [16776960], coords: new Vector3(0, 1, 1) },
  { colors: [16776960, 255], coords: new Vector3(0, 1, 2) },
  { colors: [16776960, 16711680, 65280], coords: new Vector3(0, 2, 0) },
  { colors: [16776960, 16711680], coords: new Vector3(0, 2, 1) },
  { colors: [16776960, 16711680, 255], coords: new Vector3(0, 2, 2) },
  { colors: [16777215, 65280], coords: new Vector3(1, 0, 0) },
  { colors: [16777215], coords: new Vector3(1, 0, 1) },
  { colors: [16777215, 255], coords: new Vector3(1, 0, 2) },
  { colors: [65280], coords: new Vector3(1, 1, 0) },
  { colors: [], coords: new Vector3(1, 1, 1) },
  { colors: [255], coords: new Vector3(1, 1, 2) },
  { colors: [16711680, 65280], coords: new Vector3(1, 2, 0) },
  { colors: [16711680], coords: new Vector3(1, 2, 1) },
  { colors: [16711680, 255], coords: new Vector3(1, 2, 2) },
  { colors: [16753920, 16777215, 65280], coords: new Vector3(2, 0, 0) },
  { colors: [16753920, 16777215], coords: new Vector3(2, 0, 1) },
  { colors: [16753920, 16777215, 255], coords: new Vector3(2, 0, 2) },
  { colors: [16753920, 65280], coords: new Vector3(2, 1, 0) },
  { colors: [16753920], coords: new Vector3(2, 1, 1) },
  { colors: [16753920, 255], coords: new Vector3(2, 1, 2) },
  { colors: [16753920, 16711680, 65280], coords: new Vector3(2, 2, 0) },
  { colors: [16753920, 16711680], coords: new Vector3(2, 2, 1) },
  { colors: [16753920, 16711680, 255], coords: new Vector3(2, 2, 2) },
];

((window as unknown) as { mock1: any }).mock1 = [
  { colors: [16776960, 16777215, 65280], coords: new Vector3(0, 2, 0) },
  { colors: [16776960, 16777215], coords: new Vector3(0, 1, 0) },
  { colors: [16776960, 16777215, 255], coords: new Vector3(0, 0, 0) },
  { colors: [16776960, 65280], coords: new Vector3(0, 2, 1) },
  { colors: [16776960], coords: new Vector3(0, 1, 1) },
  { colors: [16776960, 255], coords: new Vector3(0, 0, 1) },
  { colors: [16776960, 16711680, 65280], coords: new Vector3(0, 2, 2) },
  { colors: [16776960, 16711680], coords: new Vector3(0, 1, 2) },
  { colors: [16776960, 16711680, 255], coords: new Vector3(0, 0, 2) },
  { colors: [16777215, 65280], coords: new Vector3(1, 0, 0) },
  { colors: [16777215], coords: new Vector3(1, 0, 1) },
  { colors: [16777215, 255], coords: new Vector3(1, 0, 2) },
  { colors: [65280], coords: new Vector3(1, 1, 0) },
  { colors: [], coords: new Vector3(1, 1, 1) },
  { colors: [255], coords: new Vector3(1, 1, 2) },
  { colors: [16711680, 65280], coords: new Vector3(1, 2, 0) },
  { colors: [16711680], coords: new Vector3(1, 2, 1) },
  { colors: [16711680, 255], coords: new Vector3(1, 2, 2) },
  { colors: [16753920, 16777215, 65280], coords: new Vector3(2, 0, 0) },
  { colors: [16753920, 16777215], coords: new Vector3(2, 0, 1) },
  { colors: [16753920, 16777215, 255], coords: new Vector3(2, 0, 2) },
  { colors: [16753920, 65280], coords: new Vector3(2, 1, 0) },
  { colors: [16753920], coords: new Vector3(2, 1, 1) },
  { colors: [16753920, 255], coords: new Vector3(2, 1, 2) },
  { colors: [16753920, 16711680, 65280], coords: new Vector3(2, 2, 0) },
  { colors: [16753920, 16711680], coords: new Vector3(2, 2, 1) },
  { colors: [16753920, 16711680, 255], coords: new Vector3(2, 2, 2) },
];

((window as unknown) as { NNode: any }).NNode = Node;

((window as unknown) as { mock2random: any }).mock2random = [
  // { colors: [16776960, 16777215, 65280], coords: new Vector3(0, 0, 0) },
  { colors: [16776960, 16777215], coords: new Vector3(1, 0, 0) },
  // { colors: [16776960, 16777215, 255], coords: new Vector3(2, 2, 2) },
  { colors: [16776960, 65280], coords: new Vector3(0, 1, 2) },
  { colors: [16776960], coords: new Vector3(2, 1, 1) },
  { colors: [16776960, 255], coords: new Vector3(2, 0, 1) },
  // { colors: [16776960, 16711680, 65280], coords: new Vector3(0, 2, 0) },
  { colors: [16776960, 16711680], coords: new Vector3(0, 0, 1) },
  // { colors: [16776960, 16711680, 255], coords: new Vector3(2, 2, 0) },
  { colors: [16777215, 65280], coords: new Vector3(1, 0, 2) },
  { colors: [16777215], coords: new Vector3(1, 0, 1) },
  { colors: [16777215, 255], coords: new Vector3(1, 2, 0) },
  { colors: [65280], coords: new Vector3(1, 1, 2) },
  { colors: [], coords: new Vector3(1, 1, 1) },
  { colors: [255], coords: new Vector3(1, 1, 0) },
  { colors: [16711680, 65280], coords: new Vector3(0, 2, 1) },
  { colors: [16711680], coords: new Vector3(1, 2, 1) },
  { colors: [16711680, 255], coords: new Vector3(2, 1, 0) },
  // { colors: [16753920, 16777215, 65280], coords: new Vector3(2, 0, 2) },
  { colors: [16753920, 16777215], coords: new Vector3(0, 1, 0) },
  // { colors: [16753920, 16777215, 255], coords: new Vector3(2, 0, 0) },
  { colors: [16753920, 65280], coords: new Vector3(1, 2, 2) },
  { colors: [16753920], coords: new Vector3(0, 1, 1) },
  { colors: [16753920, 255], coords: new Vector3(2, 2, 1) },
  // { colors: [16753920, 16711680, 65280], coords: new Vector3(0, 0, 2) },
  { colors: [16753920, 16711680], coords: new Vector3(2, 1, 2) },
  // { colors: [16753920, 16711680, 255], coords: new Vector3(0, 2, 2) },
];
