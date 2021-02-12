export interface IDriverInitData {
    jwt: string;
}

export interface IDeliveryStartData {
    packages: string[]
}

export interface ICoordinateData {
    coordinate: [number, number];
    driverID: string;
}