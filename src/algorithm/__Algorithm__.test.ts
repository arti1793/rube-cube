import { Vector3 } from 'three';
import { EColor, ECubeFace, ECubieSide } from '../common/CommonConstants';
import { ICubieMeta } from '../common/CommonTypes';
import { CubieSide } from '../Cubes/CubieSide/CubieSide';
import completed from './__CompletedMeta__.test.json';
import randomised from './__RandomisedMeta__.test.json';
import { Node } from './Node';

const serializer = (
  nodes: Array<{
    coords: { x: number; y: number; z: number };
    sides: Array<{ side: ECubieSide; color: EColor; face: ECubeFace }>;
  }>
) => {
  return nodes.map((cubieMeta) => ({
    coords: new Vector3(
      cubieMeta.coords.x,
      cubieMeta.coords.y,
      cubieMeta.coords.z
    ),
    sides: cubieMeta.sides.map(
      (side) => new CubieSide(side.color, side.side, side.face as ECubeFace)
    ),
  }));
};

const completedSerialized: ICubieMeta[] = serializer(completed);
const randomisedSerialized: ICubieMeta[] = serializer(randomised);

test('algorithm. isComplete should pass', () => {
  const node: Node = new Node(completedSerialized, 0);
  const isComplete = node.isComplete();
  expect(isComplete).toBe(true);
});

test('algorithm. isComplete should not pass', () => {
  const node: Node = new Node(randomisedSerialized, 0);
  const isComplete = node.isComplete();
  expect(isComplete).toBe(false);
});

test('algorithm. areTopsComplete should pass', () => {
  const node: Node = new Node(completedSerialized, 0);
  const areTopsComplete = node.areTopsComplete();
  expect(areTopsComplete).toBe(true);
});

test('algorithm. areTopsComplete should not pass', () => {
  const node: Node = new Node(randomisedSerialized, 0);
  const areTopsComplete = node.areTopsComplete();
  expect(areTopsComplete).toBe(false);
});
