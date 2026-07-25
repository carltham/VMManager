package com.vmmanager.webapp.vmwindow;

import main.java.com.vmmanager.webapp.manager.ManagerVmDto;

public record VmWindowDto(
        ManagerVmDto vm,
        VmWindowTab activeTab,
        String statusMessage,
        String consoleText,
        String detailsText
) {
}
