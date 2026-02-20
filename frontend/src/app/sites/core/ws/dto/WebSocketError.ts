export interface WebSocketError {
    status: number;
    error: string;
    teardown: boolean;
}