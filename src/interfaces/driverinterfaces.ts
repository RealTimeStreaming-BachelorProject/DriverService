export interface IDriverAuth {
    jwt: string;
    username: string;
}

export interface ICoordinateData {
    coordinate: [number, number];
    userid: string;
}