package com.vmmanager.webapp.clonevm;

import java.util.List;

public record CloneVmDto(
        long dialogId,
        boolean open,
        Long sourceVmId,
        List<SourceVmOption> availableSourceVms,
        String cloneMode,
        String destinationPath,
        String diskOptions,
        String cloneName,
        String statusMessage
) {
    public record SourceVmOption(
            long id,
            long connectionId,
            String name,
            String state
    ) {
    }
}
