package net.zorphy.backend.config.session;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.integration.redis.util.RedisLockRegistry;

@Configuration
public class RedisConfig {
    private static final String LOCK_PREFIX = "locks";
    private static final long LOCK_EXPIRATION_MS = 10000L;

    @Bean
    public RedisLockRegistry redisLockRegistry(RedisConnectionFactory redisConnectionFactory) {
        return new RedisLockRegistry(redisConnectionFactory, LOCK_PREFIX, LOCK_EXPIRATION_MS);
    }
}
