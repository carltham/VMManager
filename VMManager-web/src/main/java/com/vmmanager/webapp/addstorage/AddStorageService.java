package com.vmmanager.webapp.addstorage;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

@Service
public class AddStorageService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, AddStorageState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public AddStorageService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized AddStorageDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        AddStorageState state = new AddStorageState(vmId);
        state.open = true;
        state.statusMessage = "Add storage dialog opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto close(long dialogId) {
        AddStorageState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Add storage dialog closed";
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto browseSource(long dialogId, String value) {
        AddStorageState state = getState(dialogId);
        state.source = textOrDefault(value, state.source);
        state.statusMessage = "Storage source updated";
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto selectStoragePath(long dialogId, String value) {
        AddStorageState state = getState(dialogId);
        state.storagePath = textOrDefault(value, state.storagePath);
        state.statusMessage = "Storage path selected";
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto changeFormat(long dialogId, String value) {
        AddStorageState state = getState(dialogId);
        state.format = textOrDefault(value, state.format);
        state.statusMessage = "Storage format changed";
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto changeSize(long dialogId, int sizeGb) {
        AddStorageState state = getState(dialogId);
        state.sizeGb = Math.max(1, sizeGb);
        state.statusMessage = "Storage size changed";
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto attachStorage(long dialogId) {
        AddStorageState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Storage attached";
        return toDto(dialogId, state);
    }

    public synchronized AddStorageDto cancel(long dialogId) {
        AddStorageState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Add storage canceled";
        return toDto(dialogId, state);
    }

    private AddStorageState getState(long dialogId) {
        AddStorageState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Add storage dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private AddStorageDto toDto(long dialogId, AddStorageState state) {
        return new AddStorageDto(
                dialogId,
                state.open,
                state.vmId,
                state.source,
                state.storagePath,
                state.format,
                state.sizeGb,
                state.statusMessage
        );
    }

    private static final class AddStorageState {
        private boolean open;
        private long vmId;
        private String source = "pool";
        private String storagePath = "/var/lib/libvirt/images/new-disk.qcow2";
        private String format = "qcow2";
        private int sizeGb = 20;
        private String statusMessage = "Add storage ready";

        private AddStorageState(long vmId) {
            this.vmId = vmId;
        }
    }
}
