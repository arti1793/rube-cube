import { Matrix4 } from 'three';
import { EColor, ECubeFace, ECubieSide } from '../../common/CommonConstants';
import { CubieSide } from './CubieSide';

test('cubieside. should create', () => {
  const cubieSide = new CubieSide(EColor.blue, ECubieSide.top, ECubeFace.left);
  expect(cubieSide).toBeInstanceOf(CubieSide);
});
test('cubieside. should rotate +90', () => {
  const cubieSide = new CubieSide(EColor.red, ECubieSide.top, ECubeFace.top);

  const matrix = new Matrix4();
  // by x +90
  matrix.elements = [
    1,
    0,
    0,
    0,
    0,
    2.220446049250313e-16,
    1.0000000000000002,
    0,
    0,
    -1.0000000000000002,
    2.220446049250313e-16,
    0,
    0,
    0,
    0,
    1,
  ];
  const newCubieSide = cubieSide.rotate(matrix);

  expect(newCubieSide.color).toBe(EColor.red);
  expect(newCubieSide.face).toBe(ECubeFace.left);
  expect(newCubieSide.side).toBe(ECubieSide.front);
});

test('cubieside. should rotate -90', () => {
  const cubieSide = new CubieSide(EColor.red, ECubieSide.top, ECubeFace.top);

  const matrix = new Matrix4();
  // by x -90
  matrix.elements = [
    1,
    0,
    -0,
    0,
    -0,
    2.220446049250313e-16,
    -1.0000000000000002,
    0,
    0,
    1.0000000000000002,
    2.220446049250313e-16,
    0,
    0,
    0,
    0,
    1,
  ];
  const newCubieSide = cubieSide.rotate(matrix);

  expect(newCubieSide.color).toBe(EColor.red);
  expect(newCubieSide.face).toBe(ECubeFace.backRight);
  expect(newCubieSide.side).toBe(ECubieSide.back);
});
