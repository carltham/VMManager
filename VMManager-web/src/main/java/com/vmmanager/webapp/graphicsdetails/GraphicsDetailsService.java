package com.vmmanager.webapp.graphicsdetails;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerService;

@Service
public class GraphicsDetailsService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, GraphicsState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public GraphicsDetailsService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized GraphicsDetailsDto open(long vmId) {
        managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        GraphicsState state = new GraphicsState(vmId);
        state.open = true;
        state.statusMessage = "Graphics details opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized GraphicsDetailsDto close(long dialogId) {
        GraphicsState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Graphics details closed";
        return toDto(dialogId, state);
    }

    public synchronized GraphicsDetailsDto changeGraphicsType(long dialogId, String value) {
        GraphicsState state = getState(dialogId);
        state.graphicsType = textOrDefault(value, state.graphicsType);
        state.statusMessage = "Graphics type changed";
        return toDto(dialogId, state);
    }

    public synchronized GraphicsDetailsDto changeListenPortKey(long dialogId, String listenAddress, Integer port, String keymap) {
        GraphicsState state = getState(dialogId);
        state.listenAddress = textOrDefault(listenAddress, state.listenAddress);
        state.port = port == null ? state.port : Math.max(5900, port);
        state.keymap = textOrDefault(keymap, state.keymap);
        state.statusMessage = "Graphics options updated";
        return toDto(dialogId, state);
    }

    public synchronized GraphicsDetailsDto applyChanges(long dialogId) {
        GraphicsState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Graphics changes applied";
        return toDto(dialogId, state);
    }

    public synchronized GraphicsDetailsDto cancel(long dialogId) {
        GraphicsState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Graphics update canceled";
        return toDto(dialogId, state);
    }

    private GraphicsState getState(long dialogId) {
        GraphicsState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Graphics dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private GraphicsDetailsDto toDto(long dialogId, GraphicsState state) {
        return new GraphicsDetailsDto(
                dialogId,
                state.open,
                state.vmId,
                state.graphicsType,
                state.listenAddress,
                state.port,
                state.keymap,
                state.statusMessage
        );
    }

    private static final class GraphicsState {
        private boolean open;
        private long vmId;
        private String graphicsType = "spice";
        private String listenAddress = "0.0.0.0";
        private int port = 5900;
        private String keymap = "en-us";
        private String statusMessage = "Graphics details ready";

        private GraphicsState(long vmId) {
            this.vmId = vmId;
        }
    }
}
