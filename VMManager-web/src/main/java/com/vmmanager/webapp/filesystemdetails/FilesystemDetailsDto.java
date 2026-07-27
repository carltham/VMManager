package com.vmmanager.webapp.filesystemdetails;

public record FilesystemDetailsDto(
        long dialogId,
        boolean open,
        Long vmId,
        String filesystemPath,
        String target,
        String statusMessage
) {
}
