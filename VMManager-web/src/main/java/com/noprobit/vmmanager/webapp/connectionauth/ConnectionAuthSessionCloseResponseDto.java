package com.noprobit.vmmanager.webapp.connectionauth;

public record ConnectionAuthSessionCloseResponseDto(
        boolean success,
        String message) {
}
