package com.noprobit.vmmanager.webapp;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "VMManager Spring Boot App");
        model.addAttribute("message", "Your Spring Boot web application is running.");
        return "home";
    }
}
