package com.vmmanager.webapp.addhardware;

public record AddHardwareDto(
        long dialogId,
        boolean open,
        Long vmId,
        String deviceType,
        String configuration,
        boolean valid,
        String statusMessage
) {
}
