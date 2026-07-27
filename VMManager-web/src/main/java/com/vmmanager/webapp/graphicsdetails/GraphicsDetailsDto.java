package com.vmmanager.webapp.graphicsdetails;

public record GraphicsDetailsDto(
        long dialogId,
        boolean open,
        Long vmId,
        String graphicsType,
        String listenAddress,
        int port,
        String keymap,
        String statusMessage
) {
}
