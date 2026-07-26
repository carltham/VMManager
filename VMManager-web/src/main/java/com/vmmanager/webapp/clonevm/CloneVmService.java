package com.vmmanager.webapp.clonevm;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

import main.java.com.vmmanager.webapp.manager.ManagerVmDto;

@Service
public class CloneVmService {

    private final ManagerService managerService;
    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, CloneDialogState> dialogs = new LinkedHashMap<>();

    public CloneVmService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized CloneVmDto open() {
        List<ManagerVmDto> vms = managerService.allVms();
        if (vms.isEmpty()) {
            throw new IllegalArgumentException("No source VMs available");
        }

        long dialogId = dialogSeq.incrementAndGet();
        CloneDialogState state = new CloneDialogState(vms.get(0).id(), vms.get(0).name());
        state.open = true;
        state.statusMessage = "Clone dialog opened";
        dialogs.put(dialogId, state);
        return build(dialogId, state, vms);
    }

    public synchronized CloneVmDto close(long dialogId) {
        CloneDialogState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Clone dialog closed";
        return build(dialogId, state, managerService.allVms());
    }

    public synchronized CloneVmDto selectSourceVm(long dialogId, long sourceVmId) {
        CloneDialogState state = getState(dialogId);
        ManagerVmDto sourceVm = managerService.getVm(sourceVmId);
        state.sourceVmId = sourceVm.id();
        state.cloneName = sourceVm.name() + "-clone";
        state.statusMessage = "Source VM selected";
        return build(dialogId, state, managerService.allVms());
    }

    public synchronized CloneVmDto chooseCloneMode(long dialogId, String mode) {
        CloneDialogState state = getState(dialogId);
        String normalizedMode = textOrDefault(mode, state.cloneMode).toLowerCase();
        if (!normalizedMode.equals("clone") && !normalizedMode.equals("share")) {
            throw new IllegalArgumentException("Clone mode must be 'clone' or 'share'");
        }
        state.cloneMode = normalizedMode;
        state.statusMessage = "Clone mode updated";
        return build(dialogId, state, managerService.allVms());
    }

    public synchronized CloneVmDto browseDestination(long dialogId, String path) {
        CloneDialogState state = getState(dialogId);
        state.destinationPath = textOrDefault(path, state.destinationPath);
        state.statusMessage = "Destination path updated";
        return build(dialogId, state, managerService.allVms());
    }

    public synchronized CloneVmDto changeDiskOptions(long dialogId, String diskOptions) {
        CloneDialogState state = getState(dialogId);
        state.diskOptions = textOrDefault(diskOptions, state.diskOptions);
        state.statusMessage = "Disk options updated";
        return build(dialogId, state, managerService.allVms());
    }

    public synchronized CloneVmDto editCloneName(long dialogId, String cloneName) {
        CloneDialogState state = getState(dialogId);
        state.cloneName = textOrDefault(cloneName, state.cloneName);
        state.statusMessage = "Clone name updated";
        return build(dialogId, state, managerService.allVms());
    }

    public synchronized CloneVmDto confirmClone(long dialogId) {
        CloneDialogState state = getState(dialogId);
        if (state.sourceVmId == null) {
            throw new IllegalArgumentException("Source VM is required");
        }

        ManagerVmDto sourceVm = managerService.getVm(state.sourceVmId);
        String cloneName = textOrDefault(state.cloneName, sourceVm.name() + "-clone");
        managerService.createVm(sourceVm.connectionId(), cloneName);

        state.open = false;
        state.statusMessage = "Clone created: " + cloneName;
        return build(dialogId, state, managerService.allVms());
    }

    private CloneDialogState getState(long dialogId) {
        CloneDialogState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Clone dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private CloneVmDto build(long dialogId, CloneDialogState state, List<ManagerVmDto> vms) {
        List<CloneVmDto.SourceVmOption> options = new ArrayList<>();
        for (ManagerVmDto vm : vms) {
            options.add(new CloneVmDto.SourceVmOption(vm.id(), vm.connectionId(), vm.name(), vm.state().name()));
        }

        return new CloneVmDto(
                dialogId,
                state.open,
                state.sourceVmId,
                options,
                state.cloneMode,
                state.destinationPath,
                state.diskOptions,
                state.cloneName,
                state.statusMessage
        );
    }

    private static final class CloneDialogState {
        private boolean open;
        private Long sourceVmId;
        private String cloneMode = "clone";
        private String destinationPath = "/var/lib/libvirt/images";
        private String diskOptions = "full-copy";
        private String cloneName;
        private String statusMessage = "Clone dialog ready";

        private CloneDialogState(long sourceVmId, String sourceVmName) {
            this.sourceVmId = sourceVmId;
            this.cloneName = sourceVmName + "-clone";
        }
    }
}
