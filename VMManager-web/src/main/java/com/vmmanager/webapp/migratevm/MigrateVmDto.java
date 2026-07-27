package com.vmmanager.webapp.migratevm;

public record MigrateVmDto(
        long dialogId,
        boolean open,
        Long vmId,
        String destination,
        boolean addressEnabled,
        boolean portEnabled,
        String migrationMode,
        String xmlPreview,
        String statusMessage
) {
}
