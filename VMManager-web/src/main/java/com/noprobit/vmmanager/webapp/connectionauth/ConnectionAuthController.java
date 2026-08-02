package com.noprobit.vmmanager.webapp.connectionauth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/connection-auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class ConnectionAuthController {

    private final ConnectionAuthService connectionAuthService;

    public ConnectionAuthController(ConnectionAuthService connectionAuthService) {
        this.connectionAuthService = connectionAuthService;
    }

    @PostMapping("/sessions")
    public ConnectionAuthSessionResponseDto createSession(@RequestBody ConnectionAuthSessionCreateRequestDto request) {
        try {
            return connectionAuthService.createSession(request);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        } catch (SecurityException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage(), ex);
        }
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ConnectionAuthSessionCloseResponseDto closeSession(@PathVariable String sessionId) {
        try {
            return connectionAuthService.closeSession(sessionId);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }
}
