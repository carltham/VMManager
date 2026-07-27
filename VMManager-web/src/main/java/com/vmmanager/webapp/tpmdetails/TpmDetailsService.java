package com.vmmanager.webapp.tpmdetails;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

@Service
public class TpmDetailsService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, TpmState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public TpmDetailsService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized TpmDetailsDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        TpmState state = new TpmState(vmId);
        state.open = true;
        state.statusMessage = "TPM details opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized TpmDetailsDto close(long dialogId) {
        TpmState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "TPM details closed";
        return toDto(dialogId, state);
    }

    public synchronized TpmDetailsDto changeModel(long dialogId, String value) {
        TpmState state = getState(dialogId);
        state.model = textOrDefault(value, state.model);
        state.statusMessage = "TPM model changed";
        return toDto(dialogId, state);
    }

    public synchronized TpmDetailsDto changeVersion(long dialogId, String value) {
        TpmState state = getState(dialogId);
        state.version = textOrDefault(value, state.version);
        state.statusMessage = "TPM version changed";
        return toDto(dialogId, state);
    }

    public synchronized TpmDetailsDto changeDevicePath(long dialogId, String value) {
        TpmState state = getState(dialogId);
        state.devicePath = textOrDefault(value, state.devicePath);
        state.statusMessage = "TPM device path changed";
        return toDto(dialogId, state);
    }

    public synchronized TpmDetailsDto applyChanges(long dialogId) {
        TpmState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "TPM changes applied";
        return toDto(dialogId, state);
    }

    public synchronized TpmDetailsDto cancel(long dialogId) {
        TpmState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "TPM update canceled";
        return toDto(dialogId, state);
    }

    private TpmState getState(long dialogId) {
        TpmState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("TPM dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private TpmDetailsDto toDto(long dialogId, TpmState state) {
        return new TpmDetailsDto(
                dialogId,
                state.open,
                state.vmId,
                state.model,
                state.version,
                state.devicePath,
                state.statusMessage
        );
    }

    private static final class TpmState {
        private boolean open;
        private long vmId;
        private String model = "tpm-tis";
        private String version = "2.0";
        private String devicePath = "/dev/tpm0";
        private String statusMessage = "TPM details ready";

        private TpmState(long vmId) {
            this.vmId = vmId;
        }
    }
}
