package com.vmmanager.webapp.vsockdetails;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

@Service
public class VsockDetailsService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, VsockState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public VsockDetailsService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized VsockDetailsDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        VsockState state = new VsockState(vmId);
        state.open = true;
        state.statusMessage = "VSock details opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized VsockDetailsDto close(long dialogId) {
        VsockState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "VSock details closed";
        return toDto(dialogId, state);
    }

    public synchronized VsockDetailsDto toggleAutoCid(long dialogId, boolean value) {
        VsockState state = getState(dialogId);
        state.autoCid = value;
        state.statusMessage = "Auto CID " + (value ? "enabled" : "disabled");
        return toDto(dialogId, state);
    }

    public synchronized VsockDetailsDto editCid(long dialogId, long cid) {
        VsockState state = getState(dialogId);
        state.cid = Math.max(3, cid);
        state.statusMessage = "CID updated";
        return toDto(dialogId, state);
    }

    public synchronized VsockDetailsDto applyChanges(long dialogId) {
        VsockState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "VSock changes applied";
        return toDto(dialogId, state);
    }

    public synchronized VsockDetailsDto cancel(long dialogId) {
        VsockState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "VSock update canceled";
        return toDto(dialogId, state);
    }

    private VsockState getState(long dialogId) {
        VsockState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("VSock dialog not found");
        }
        return state;
    }

    private VsockDetailsDto toDto(long dialogId, VsockState state) {
        return new VsockDetailsDto(dialogId, state.open, state.vmId, state.autoCid, state.cid, state.statusMessage);
    }

    private static final class VsockState {
        private boolean open;
        private long vmId;
        private boolean autoCid = true;
        private long cid = 5;
        private String statusMessage = "VSock details ready";

        private VsockState(long vmId) {
            this.vmId = vmId;
        }
    }
}
