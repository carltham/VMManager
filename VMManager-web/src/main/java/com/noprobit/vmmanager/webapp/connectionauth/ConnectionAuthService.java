package com.noprobit.vmmanager.webapp.connectionauth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.noprobit.vmmanager.webapp.manager.ManagerConnectionDto;
import com.noprobit.vmmanager.webapp.manager.ManagerService;

@Service
public class ConnectionAuthService {

    private final ManagerService managerService;
    private final Map<String, SessionState> sessions = new LinkedHashMap<>();
    private long sessionSeq = 1;

    public ConnectionAuthService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized ConnectionAuthSessionResponseDto createSession(ConnectionAuthSessionCreateRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String username = normalize(request.username());
        String password = normalize(request.password());
        if (username.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Username and password are required.");
        }

        ManagerConnectionDto connection = resolveConnection(request.connectionId());

        // Placeholder auth logic until libvirt integration layer is wired.
        if ("bad".equalsIgnoreCase(password) || "bad".equalsIgnoreCase(username)) {
            throw new SecurityException("Authentication failed for provided credentials.");
        }

        String sessionId = "sess_" + sessionSeq++;
        Instant expiresAt = request.remember() ? Instant.now().plus(7, ChronoUnit.DAYS) : Instant.now().plus(4, ChronoUnit.HOURS);
        sessions.put(sessionId, new SessionState(connection.id(), username, request.remember(), expiresAt));

        String mode = request.remember() ? "with stored session" : "for current session";

        return new ConnectionAuthSessionResponseDto(
                true,
            "Authenticated " + mode + ".",
                sessionId,
                expiresAt.toString());
    }

    public synchronized ConnectionAuthSessionCloseResponseDto closeSession(String sessionId) {
        String id = normalize(sessionId);
        if (id.isEmpty()) {
            throw new IllegalArgumentException("Session id is required.");
        }

        SessionState removed = sessions.remove(id);
        if (removed == null) {
            throw new IllegalArgumentException("Session not found.");
        }

        return new ConnectionAuthSessionCloseResponseDto(true, "Session closed.");
    }

    private ManagerConnectionDto resolveConnection(Long connectionId) {
        var connections = managerService.getOverview().connections();
        if (connections.isEmpty()) {
            throw new IllegalArgumentException("No connections available.");
        }

        long targetId = connectionId == null ? connections.get(0).id() : connectionId;
        for (ManagerConnectionDto connection : connections) {
            if (connection.id() == targetId) {
                return connection;
            }
        }

        throw new IllegalArgumentException("Connection not found.");
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record SessionState(long connectionId, String username, boolean remember, Instant expiresAt) {
    }
}
