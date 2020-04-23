import { ECubeFace } from '../common/CommonConstants';
import { Node } from './Node';

export const distanceToCenters = (node: Node) => {
  const weights = [1, 1, 1];
  for (const [sideTypeWeight, index] of weights.entries()) {
    const faces = Object.keys(ECubeFace).map((face) =>
      node.values
        .filter(({ sides }) => sides.length === index + 1)
        .map(({ sides }) => sides)
        .flat(1)
        .filter((side) => side.face === face)
    );
  }
};
