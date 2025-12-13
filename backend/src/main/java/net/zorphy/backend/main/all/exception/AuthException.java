package net.zorphy.backend.main.all.exception;

public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
    public AuthException(String message, Exception ex) {
        super(message, ex);
    }
}
