package com.noprobit.vmmanager.webapp.createvm;

import java.util.List;

public record CreateVmWizardDto(
        long wizardId,
        boolean open,
        int step,
        long connectionId,
        List<String> availableConnections,
        String installMethod,
        String vmName,
        String isoPath,
        String url,
        String importSource,
        String appSource,
        String osContainerSource,
        boolean detectOs,
        boolean storageEnabled,
        String arch,
        String type,
        String machine,
        String statusMessage
) {
}
