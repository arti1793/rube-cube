import { Vector3 } from 'three';

import { EColor, ECubeFace, ECubieSide } from '../common/CommonConstants';
import { CubieMeta } from '../Cubes/CubieMeta/CubieMeta';
import { CubieSide } from '../Cubes/CubieSide/CubieSide';
import completedRaw from './__AlgoriithmCompletedCube__.test.json';
import halfOfEdgesCompletedRaw from './__AlgorithmOnlyHalfOfEdgesCompleted__.test.json';
import onlyTopsCompletedRaw from './__AlgorithmOnlyTopsCompleted__.test.json';
import randomisedRaw from './__AlgorithmRandomisedCube__.test.json';
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

const COMPLETED: CubieMeta[] = serializer(completedRaw);
const RANDOMISED: CubieMeta[] = serializer(randomisedRaw);
const ONLY_TOPS: CubieMeta[] = serializer(onlyTopsCompletedRaw);
const HALF_OF_EDGES: CubieMeta[] = serializer(halfOfEdgesCompletedRaw);

test('Node. should create', () => {
  const node = new Node(COMPLETED, 0);
  expect(node).toBeInstanceOf(Node);
});

test('Node. isComplete should pass', () => {
  const node: Node = new Node(COMPLETED, 0);
  const isComplete = node.isComplete();
  expect(isComplete).toBe(true);
});

test('Node. isComplete should not pass', () => {
  const node: Node = new Node(RANDOMISED, 0);
  const isComplete = node.isComplete();
  expect(isComplete).toBe(false);
});

test('Node. areTopsComplete on completed cube should pass', () => {
  const node: Node = new Node(COMPLETED, 0);
  const areTopsComplete = node.areTopsComplete();
  expect(areTopsComplete).toBe(true);
});

test('Node. areTopsComplete on randomised cube should not pass', () => {
  const node: Node = new Node(RANDOMISED, 0);
  const areTopsComplete = node.areTopsComplete();
  expect(areTopsComplete).toBe(false);
});

test('Node. areTopsComplete on ONLY_TOPS should pass', () => {
  const node: Node = new Node(ONLY_TOPS, 0);
  const areTopsComplete = node.areTopsComplete();
  expect(areTopsComplete).toBe(true);
});

test('Node. half of edges on completed should pass', () => {
  const node: Node = new Node(COMPLETED, 0);
  const isHalfOfEdgesComplete = node.isHalfOfEdgesComplete();
  expect(isHalfOfEdgesComplete).toBe(true);
});

test('Node. half of edges on randomised should not pass', () => {
  const node: Node = new Node(RANDOMISED, 0);
  const isHalfOfEdgesComplete = node.isHalfOfEdgesComplete();
  expect(isHalfOfEdgesComplete).toBe(false);
});

test('Node. half of edges on onlyHalfOfEdges should pass', () => {
  const node: Node = new Node(HALF_OF_EDGES, 0);
  const isHalfOfEdgesComplete = node.isHalfOfEdgesComplete();
  expect(isHalfOfEdgesComplete).toBe(true);
});
