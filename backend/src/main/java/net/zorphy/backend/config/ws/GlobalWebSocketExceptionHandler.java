package net.zorphy.backend.config.ws;

import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.main.core.exception.NotFoundException;
import net.zorphy.backend.site.core.ws.dto.WebSocketError;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalWebSocketExceptionHandler {
    private final SimpMessagingTemplate messagingTemplate;

    public GlobalWebSocketExceptionHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageExceptionHandler({InvalidSessionException.class, IllegalArgumentException.class})
    public void handleBadRequestExceptions(Exception ex, SimpMessageHeaderAccessor headerAccessor) {
        sendErrorToUser(headerAccessor, ex, 400);
    }

    @MessageExceptionHandler(NotFoundException.class)
    public void handleNotFoundExceptions(Exception ex, SimpMessageHeaderAccessor headerAccessor) {
        sendErrorToUser(headerAccessor, ex, 404);
    }

    @MessageExceptionHandler(Exception.class)
    public void handleGeneralException(Exception ex, SimpMessageHeaderAccessor headerAccessor) {
        sendErrorToUser(headerAccessor, new Exception("Internal Server Error"), 500);
    }


    private void sendErrorToUser(SimpMessageHeaderAccessor headerAccessor, Exception ex, int code) {
        String sessionId = headerAccessor.getSessionId();
        var user = headerAccessor.getUser();

        String targetUser = user != null ? user.getName() : sessionId;

        WebSocketError error = new WebSocketError(code, ex.getMessage());
        messagingTemplate.convertAndSendToUser(
                targetUser,
                "/queue/errors",
                error
        );
    }
}
