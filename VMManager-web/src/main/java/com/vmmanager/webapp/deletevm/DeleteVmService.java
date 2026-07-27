package com.vmmanager.webapp.deletevm;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

@Service
public class DeleteVmService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, DeleteState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public DeleteVmService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized DeleteVmDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        DeleteState state = new DeleteState(vmId);
        state.open = true;
        state.statusMessage = "Delete dialog opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized DeleteVmDto close(long dialogId) {
        DeleteState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Delete dialog closed";
        return toDto(dialogId, state);
    }

    public synchronized DeleteVmDto toggleRemoveStorage(long dialogId, boolean value) {
        DeleteState state = getState(dialogId);
        state.removeStorage = value;
        state.statusMessage = "Remove storage " + (value ? "enabled" : "disabled");
        return toDto(dialogId, state);
    }

    public synchronized DeleteVmDto confirmDelete(long dialogId) {
        DeleteState state = getState(dialogId);
        if (state.vmId == null) {
            throw new IllegalArgumentException("VM id is required");
        }
        managerService.deleteVm(state.vmId);
        state.open = false;
        state.statusMessage = state.removeStorage
                ? "VM deleted with storage cleanup"
                : "VM deleted";
        return toDto(dialogId, state);
    }

    public synchronized DeleteVmDto cancelDelete(long dialogId) {
        DeleteState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Delete canceled";
        return toDto(dialogId, state);
    }

    private DeleteState getState(long dialogId) {
        DeleteState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Delete dialog not found");
        }
        return state;
    }

    private DeleteVmDto toDto(long dialogId, DeleteState state) {
        return new DeleteVmDto(dialogId, state.open, state.vmId, state.removeStorage, state.statusMessage);
    }

    private static final class DeleteState {
        private boolean open;
        private Long vmId;
        private boolean removeStorage;
        private String statusMessage = "Delete dialog ready";

        private DeleteState(long vmId) {
            this.vmId = vmId;
        }
    }
}
