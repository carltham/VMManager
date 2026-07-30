package com.noprobit.vmmanager.webapp.filesystemdetails;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.noprobit.vmmanager.webapp.manager.ManagerService;

@Service
public class FilesystemDetailsService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, FilesystemState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public FilesystemDetailsService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized FilesystemDetailsDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        FilesystemState state = new FilesystemState(vmId);
        state.open = true;
        state.statusMessage = "Filesystem details opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized FilesystemDetailsDto close(long dialogId) {
        FilesystemState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Filesystem details closed";
        return toDto(dialogId, state);
    }

    public synchronized FilesystemDetailsDto browseSource(long dialogId, String value) {
        FilesystemState state = getState(dialogId);
        state.filesystemPath = textOrDefault(value, state.filesystemPath);
        state.statusMessage = "Filesystem source selected";
        return toDto(dialogId, state);
    }

    public synchronized FilesystemDetailsDto editFilesystemPath(long dialogId, String value) {
        FilesystemState state = getState(dialogId);
        state.filesystemPath = textOrDefault(value, state.filesystemPath);
        state.statusMessage = "Filesystem path updated";
        return toDto(dialogId, state);
    }

    public synchronized FilesystemDetailsDto editTarget(long dialogId, String value) {
        FilesystemState state = getState(dialogId);
        state.target = textOrDefault(value, state.target);
        state.statusMessage = "Filesystem target updated";
        return toDto(dialogId, state);
    }

    public synchronized FilesystemDetailsDto applyChanges(long dialogId) {
        FilesystemState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Filesystem changes applied";
        return toDto(dialogId, state);
    }

    public synchronized FilesystemDetailsDto cancel(long dialogId) {
        FilesystemState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Filesystem update canceled";
        return toDto(dialogId, state);
    }

    private FilesystemState getState(long dialogId) {
        FilesystemState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Filesystem dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private FilesystemDetailsDto toDto(long dialogId, FilesystemState state) {
        return new FilesystemDetailsDto(
                dialogId,
                state.open,
                state.vmId,
                state.filesystemPath,
                state.target,
                state.statusMessage
        );
    }

    private static final class FilesystemState {
        private boolean open;
        private long vmId;
        private String filesystemPath = "/srv/share";
        private String target = "/mnt/share";
        private String statusMessage = "Filesystem details ready";

        private FilesystemState(long vmId) {
            this.vmId = vmId;
        }
    }
}
