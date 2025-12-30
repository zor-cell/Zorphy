package net.zorphy.backend.main.core;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {
    @RequestMapping("/")
    public String getGreeting() {
        return "This is the backend server of zorphy.net!";
    }
}
