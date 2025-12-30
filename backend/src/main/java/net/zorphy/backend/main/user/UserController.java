package net.zorphy.backend.main.user;

import jakarta.validation.Valid;
import net.zorphy.backend.main.user.dto.UserDetails;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.main.user.service.UserService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    @GetMapping("/me")
    public UserDetails getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidSessionException("No authentication info exists in current session");
        }

        return userService.getCurrentUser(authentication);
    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/register")
    public UserDetails registerUser(@Valid @RequestBody UserDetails userDetails) {
        return userService.registerUser(userDetails);
    }
}
