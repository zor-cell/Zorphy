package net.zorphy.backend.config.ws;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
public class UserChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String rawUsername = getHeaderValue(accessor, "user-name");

            if(rawUsername == null || rawUsername.isBlank()) {
                throw new MessageDeliveryException("Username is required");
            }

            //avoid name duplication with user id
            String userId = rawUsername;// + "#" + UUID.randomUUID().toString().substring(0, 6);
            accessor.setUser(new StompPrincipal(userId));
        }

        return message;
    }

    private String getHeaderValue(StompHeaderAccessor accessor, String headerName) {
        Object value = accessor.getFirstNativeHeader(headerName);
        return value != null ? value.toString() : null;
    }
}