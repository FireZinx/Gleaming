import { CatmullRomCurve3, Vector3 } from "three";

export const CamRoute = {
  apartment: {
    previousPos: "apartment",
    nextPos: ["room"],
    curve: new CatmullRomCurve3([
      new Vector3(-10, 2.3, 5),
      new Vector3(-5.5, 2.2, 5)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(-10, 10, 5),
      new Vector3(10, 0.8, 5)
    ]),
    velocity: 0.2
  },
  room: {
    previousPos: "apartment",
    nextPos: ["kitchen", "corridor"],
    curve: new CatmullRomCurve3([
      new Vector3(-5.5, 2.2, 5),
      new Vector3(2, 2.2, 5.5),
      new Vector3(5.5, 2.2, 7.25)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(10, 0.8, 5),
      new Vector3(0, 1.1, 1),
    ]),
    velocity: 0.2
  },
  kitchen: {
    previousPos: "room",
    nextPos: [],
    curve: new CatmullRomCurve3([
      new Vector3(5.5, 2.2, 7.25),
      new Vector3(5, 2.2, 6.8 ),
      new Vector3(4, 2.2, 6.5)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(0, 1.1, 1),
      new Vector3(0, 1.3, 9),
    ]),
    velocity: 0.4
  },
  corridor: {
    previousPos: "room",
    nextPos: ["bedroom", "masterbedroom", "bathroom"],
    curve: new CatmullRomCurve3([
      new Vector3(5.5, 2.2, 7.25),
      new Vector3(4, 2.2, 4.5 ),
      new Vector3(3.2, 2.2, 2.8)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(0, 1.1, 1),
      new Vector3(3.5, 1.3, -2),
    ]),
    velocity: 0.25
  },
  bedroom: {
    previousPos: "corridor",
    nextPos: [],
    curve: new CatmullRomCurve3([
      new Vector3(3.2, 2.2, 2.8),
      new Vector3(3, 2.2, 1.1 ),
      new Vector3(2, 2.2, 1.1),
      new Vector3(2, 2.2, 0.6)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(3.5, 1.3, -2),
      new Vector3(-1, 1.1, -1),
    ]),
    velocity: 0.25
  },
  masterbedroom: {
    previousPos: "corridor",
    nextPos: [],
    curve: new CatmullRomCurve3([
      new Vector3(3.2, 2.2, 2.8),
      new Vector3(3.1, 2.2, 0.7 ),
      new Vector3(6.5, 2.2, 0.3)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(3.5, 1.3, -2),
      new Vector3(8, 1.3, 2),
    ]),
    velocity: 0.25
  },
  bathroom: {
    previousPos: "corridor",
    nextPos: [],
    curve: new CatmullRomCurve3([
      new Vector3(3.2, 2.2, 2.8),
      new Vector3(2.95, 2.2, 0.7 ),
      new Vector3(2.8, 2.2, -1.5)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(3.5, 1.3, -2),
      new Vector3(5, 1.3, 0),
    ]),
    velocity: 0.25
  }
} as const;
