package net.zorphy.backend.main.user.service;

import net.zorphy.backend.main.user.dto.UserDetails;
import org.springframework.security.core.Authentication;

public interface UserService {
    UserDetails getCurrentUser(Authentication authentication);

    UserDetails registerUser(UserDetails userDetails);
}
