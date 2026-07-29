package com.noprobit.vmmanager.webapp.deletevm;

public record DeleteVmDto(
        long dialogId,
        boolean open,
        Long vmId,
        boolean removeStorage,
        String statusMessage
) {
}
