package com.noprobit.vmmanager.webapp.createnetwork;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class CreateNetworkService {

    private static final int MAX_STEP = 4;

    private final AtomicLong wizardSeq = new AtomicLong(0);
    private final Map<Long, NetworkState> wizards = new LinkedHashMap<>();

    public synchronized CreateNetworkDto open() {
        long wizardId = wizardSeq.incrementAndGet();
        NetworkState state = new NetworkState();
        state.open = true;
        state.statusMessage = "Create network wizard opened";
        wizards.put(wizardId, state);
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto close(long wizardId) {
        NetworkState state = getState(wizardId);
        state.open = false;
        state.statusMessage = "Create network wizard closed";
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto back(long wizardId) {
        NetworkState state = getState(wizardId);
        state.step = Math.max(1, state.step - 1);
        state.statusMessage = "Moved back to step " + state.step;
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto next(long wizardId) {
        NetworkState state = getState(wizardId);
        state.step = Math.min(MAX_STEP, state.step + 1);
        state.statusMessage = "Moved to step " + state.step;
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto configureNetwork(long wizardId, String networkName, String mode) {
        NetworkState state = getState(wizardId);
        state.networkName = textOrDefault(networkName, state.networkName);
        state.mode = textOrDefault(mode, state.mode);
        state.statusMessage = "Network configuration updated";
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto setAddressRange(long wizardId, String value) {
        NetworkState state = getState(wizardId);
        state.addressRange = textOrDefault(value, state.addressRange);
        state.statusMessage = "Address range updated";
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto review(long wizardId) {
        NetworkState state = getState(wizardId);
        state.statusMessage = "Review complete";
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto createNetwork(long wizardId) {
        NetworkState state = getState(wizardId);
        state.open = false;
        state.statusMessage = "Network created: " + state.networkName;
        return toDto(wizardId, state);
    }

    public synchronized CreateNetworkDto cancel(long wizardId) {
        NetworkState state = getState(wizardId);
        state.open = false;
        state.statusMessage = "Create network canceled";
        return toDto(wizardId, state);
    }

    private NetworkState getState(long wizardId) {
        NetworkState state = wizards.get(wizardId);
        if (state == null) {
            throw new IllegalArgumentException("Create network wizard not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private CreateNetworkDto toDto(long wizardId, NetworkState state) {
        return new CreateNetworkDto(
                wizardId,
                state.open,
                state.step,
                state.networkName,
                state.mode,
                state.addressRange,
                state.statusMessage
        );
    }

    private static final class NetworkState {
        private boolean open;
        private int step = 1;
        private String networkName = "default-net";
        private String mode = "nat";
        private String addressRange = "192.168.100.0/24";
        private String statusMessage = "Create network wizard ready";
    }
}
