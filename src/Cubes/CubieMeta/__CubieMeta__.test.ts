import { Vector3 } from 'three';
import {
  EAxis,
  EColor,
  ECubeFace,
  ECubieSide,
  NUMBER_OF_CUBIES,
} from '../../common/CommonConstants';
import { CubieSide } from '../CubieSide/CubieSide';
import { CubieMeta } from './CubieMeta';

test('cubieMeta should create', () => {
  const cubie = new CubieMeta({
    coords: new Vector3(0, 0, 0),
    sides: [new CubieSide(EColor.yellow, ECubieSide.back, ECubeFace.backLeft)],
  });
  expect(cubie).toBeInstanceOf(CubieMeta);
  expect(cubie.coords).toEqual(new Vector3(0, 0, 0));
});

test("cubieMeta should rotate cubie's coords", () => {
  const cubie = new CubieMeta({
    coords: new Vector3(0, 0, 0),
    sides: [new CubieSide(EColor.yellow, ECubieSide.back, ECubeFace.backLeft)],
  });

  const newCubie = cubie.rotate(EAxis.x, 90);
  expect(newCubie).toBeInstanceOf(CubieMeta);
  expect(newCubie.coords).toEqual(new Vector3(0, NUMBER_OF_CUBIES - 1, 0));
});

test("cubieMeta should rotate by X cubie' sides", () => {
  const cubie = new CubieMeta({
    coords: new Vector3(0, 0, 0),
    sides: [new CubieSide(EColor.yellow, ECubieSide.back, ECubeFace.backLeft)],
  });

  const newCubie = cubie.rotate(EAxis.x, 90);
  expect(newCubie).toBeInstanceOf(CubieMeta);
  expect(newCubie.sides[0]).toEqual(
    new CubieSide(EColor.yellow, ECubieSide.top, ECubeFace.top)
  );
});

test("cubieMeta should rotate by Y cubie' sides", () => {
  const cubie = new CubieMeta({
    coords: new Vector3(0, 0, 0),
    sides: [new CubieSide(EColor.yellow, ECubieSide.back, ECubeFace.backLeft)],
  });

  const newCubie = cubie.rotate(EAxis.y, 90);
  expect(newCubie).toBeInstanceOf(CubieMeta);
  expect(newCubie.sides[0]).toEqual(
    new CubieSide(EColor.yellow, ECubieSide.left, ECubeFace.backLeft)
  );
});

test("cubieMeta should rotate by Z cubie' sides", () => {
  const cubie = new CubieMeta({
    coords: new Vector3(0, 0, 0),
    sides: [new CubieSide(EColor.yellow, ECubieSide.back, ECubeFace.backLeft)],
  });

  const newCubie = cubie.rotate(EAxis.z, 90);
  expect(newCubie).toBeInstanceOf(CubieMeta);
  expect(newCubie.sides[0]).toEqual(
    new CubieSide(EColor.yellow, ECubieSide.back, ECubeFace.backRight)
  );
});
