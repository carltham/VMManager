package com.vmmanager.webapp.addhardware;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

@Service
public class AddHardwareService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, AddHardwareState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public AddHardwareService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized AddHardwareDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        AddHardwareState state = new AddHardwareState(vmId);
        state.open = true;
        state.statusMessage = "Add hardware dialog opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized AddHardwareDto close(long dialogId) {
        AddHardwareState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Add hardware dialog closed";
        return toDto(dialogId, state);
    }

    public synchronized AddHardwareDto selectDeviceType(long dialogId, String value) {
        AddHardwareState state = getState(dialogId);
        state.deviceType = textOrDefault(value, state.deviceType);
        state.statusMessage = "Device type selected";
        return toDto(dialogId, state);
    }

    public synchronized AddHardwareDto configureDevice(long dialogId, String value) {
        AddHardwareState state = getState(dialogId);
        state.configuration = textOrDefault(value, state.configuration);
        state.statusMessage = "Device configured";
        return toDto(dialogId, state);
    }

    public synchronized AddHardwareDto validateDevice(long dialogId) {
        AddHardwareState state = getState(dialogId);
        state.valid = !state.configuration.isBlank();
        state.statusMessage = state.valid ? "Device configuration valid" : "Device configuration invalid";
        return toDto(dialogId, state);
    }

    public synchronized AddHardwareDto applyChanges(long dialogId) {
        AddHardwareState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Add hardware changes applied";
        return toDto(dialogId, state);
    }

    public synchronized AddHardwareDto cancel(long dialogId) {
        AddHardwareState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Add hardware canceled";
        return toDto(dialogId, state);
    }

    private AddHardwareState getState(long dialogId) {
        AddHardwareState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Add hardware dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private AddHardwareDto toDto(long dialogId, AddHardwareState state) {
        return new AddHardwareDto(
                dialogId,
                state.open,
                state.vmId,
                state.deviceType,
                state.configuration,
                state.valid,
                state.statusMessage
        );
    }

    private static final class AddHardwareState {
        private boolean open;
        private long vmId;
        private String deviceType = "disk";
        private String configuration = "size=20G";
        private boolean valid = true;
        private String statusMessage = "Add hardware ready";

        private AddHardwareState(long vmId) {
            this.vmId = vmId;
        }
    }
}
