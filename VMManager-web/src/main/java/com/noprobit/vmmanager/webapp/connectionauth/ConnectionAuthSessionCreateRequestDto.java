package com.noprobit.vmmanager.webapp.connectionauth;

public record ConnectionAuthSessionCreateRequestDto(
        Long connectionId,
        String username,
        String password,
        boolean remember) {
}
