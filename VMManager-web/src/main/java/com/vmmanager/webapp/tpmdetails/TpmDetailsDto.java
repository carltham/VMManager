package com.vmmanager.webapp.tpmdetails;

public record TpmDetailsDto(
        long dialogId,
        boolean open,
        Long vmId,
        String model,
        String version,
        String devicePath,
        String statusMessage
) {
}
