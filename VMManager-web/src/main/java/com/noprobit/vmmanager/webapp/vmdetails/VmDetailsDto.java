package com.noprobit.vmmanager.webapp.vmdetails;

import java.util.List;

import com.noprobit.vmmanager.webapp.manager.ManagerVmDto;

public record VmDetailsDto(
        ManagerVmDto vm,
        boolean open,
        String selectedHardware,
        String generalSettings,
        int cpuCount,
        int memoryMb,
        String bootOrder,
        List<String> hardwareDevices,
        boolean xmlEditorOpen,
        boolean storageBrowserOpen,
        boolean osListOpen,
        String statusMessage,
        List<String> validationErrors,
        List<VmOsListItemDto> osChoices
) {
}
