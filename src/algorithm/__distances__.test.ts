import { Vector3 } from 'three';
import { EColor, ECubeFace, ECubieSide } from '../common/CommonConstants';
import { CubieMeta } from '../Cubes/CubieMeta/CubieMeta';
import { CubieSide } from '../Cubes/CubieSide/CubieSide';
import completedRaw from './__AlgoriithmCompletedCube__.test.json';
import halfOfEdgesCompletedRaw from './__AlgorithmOnlyHalfOfEdgesCompleted__.test.json';
import onlyTopsCompletedRaw from './__AlgorithmOnlyTopsCompleted__.test.json';
import randomisedRaw from './__AlgorithmRandomisedCube__.test.json';
import { distanceToCenters } from './distances';
import { Node } from './Node';

const serializer = (
  nodes: Array<{
    coords: { x: number; y: number; z: number };
    sides: Array<{ side: ECubieSide; color: EColor; face: string }>;
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

test('distance should', () => {
  const distance = distanceToCenters(new Node(serializer(completedRaw), 0));
  expect(distance).toBe(Number);
});
