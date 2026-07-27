package com.vmmanager.webapp.vsockdetails;

public record VsockDetailsDto(
        long dialogId,
        boolean open,
        Long vmId,
        boolean autoCid,
        long cid,
        String statusMessage
) {
}
