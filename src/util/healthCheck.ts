import {HealthCheck} from '../interfaces/health'
import * as socketio from 'socket.io'

export const getHealthCheck = (io: socketio.Server): HealthCheck => {
    return {
        socketCount: (io as any).engine.clientsCount // Hmm, can't find 'engine' on type.
    }
}