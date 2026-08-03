package com.noprobit.vmmanager.webapp.manager.dto;

public record ManagerConnectionAutoconnectDto(
        long connectionId,
        boolean autoConnect,
        String statusMessage) {
}
