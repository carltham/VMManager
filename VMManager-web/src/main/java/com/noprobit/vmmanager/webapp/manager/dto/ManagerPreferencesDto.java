package com.noprobit.vmmanager.webapp.manager.dto;

public record ManagerPreferencesDto(
        String theme,
        String defaultConnectionUri,
        String autoConnect) {
}