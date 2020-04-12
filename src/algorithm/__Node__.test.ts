import { Vector3 } from 'three';

import { EColor, ECubeFace, ECubieSide } from '../common/CommonConstants';
import { CubieMeta } from '../Cubes/CubieMeta/CubieMeta';
import { CubieSide } from '../Cubes/CubieSide/CubieSide';
import completedRaw from './__AlgoriithmCompletedCube__.test.json';
import { Node } from './Node';

const serializer = (
  nodes: Array<{
    coords: { x: number; y: number; z: number };
    sides: Array<{ side: ECubieSide; color: EColor; face: ECubeFace }>;
  }>
) => {
  return nodes.map(
    (cubieMeta) =>
      new CubieMeta({
        coords: new Vector3(
          cubieMeta.coords.x,
          cubieMeta.coords.y,
          cubieMeta.coords.z
        ),
        sides: cubieMeta.sides.map(
          (side) => new CubieSide(side.color, side.side, side.face as ECubeFace)
        ),
      })
  );
};

const COMPLETED = serializer(completedRaw);

test('Node. should create', () => {
  const node = new Node(COMPLETED, 0);
  expect(node).toBeInstanceOf(Node);
});
