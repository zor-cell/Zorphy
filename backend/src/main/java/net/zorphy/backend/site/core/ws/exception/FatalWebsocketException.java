package net.zorphy.backend.site.core.ws.exception;

/**
 * An exception that indicates a websocket error that should close the connection
 */
public class FatalWebsocketException extends RuntimeException {
    public FatalWebsocketException(String message) {
        super(message);
    }
}
