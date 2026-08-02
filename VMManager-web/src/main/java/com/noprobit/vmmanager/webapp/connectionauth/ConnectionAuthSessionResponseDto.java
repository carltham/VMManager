package com.noprobit.vmmanager.webapp.connectionauth;

public record ConnectionAuthSessionResponseDto(
        boolean success,
        String message,
        String sessionId,
        String expiresAt) {
}
