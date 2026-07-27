package com.vmmanager.webapp.createnetwork;

public record CreateNetworkDto(
        long wizardId,
        boolean open,
        int step,
        String networkName,
        String mode,
        String addressRange,
        String statusMessage
) {
}
