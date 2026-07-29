package com.noprobit.vmmanager.webapp.addstorage;

public record AddStorageDto(
        long dialogId,
        boolean open,
        Long vmId,
        String source,
        String storagePath,
        String format,
        int sizeGb,
        String statusMessage
) {
}
