import { EEdgeType, EAxis } from "./CommonConstants";

export interface IAxisEdgeMap {
    [EAxis.x]: EEdgeType;
    [EAxis.y]: EEdgeType;
    [EAxis.z]: EEdgeType;
}