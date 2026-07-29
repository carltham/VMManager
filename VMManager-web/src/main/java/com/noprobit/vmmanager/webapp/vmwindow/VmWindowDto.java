package com.noprobit.vmmanager.webapp.vmwindow;

import com.noprobit.vmmanager.webapp.manager.ManagerVmDto;

public record VmWindowDto(
        ManagerVmDto vm,
        VmWindowTab activeTab,
        String statusMessage,
        String consoleText,
        String detailsText
) {
}
