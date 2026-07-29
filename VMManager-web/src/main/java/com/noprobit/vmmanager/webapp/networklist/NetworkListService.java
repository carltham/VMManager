package com.noprobit.vmmanager.webapp.networklist;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class NetworkListService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, NetworkListState> dialogs = new LinkedHashMap<>();

    public synchronized NetworkListDto open() {
        long dialogId = dialogSeq.incrementAndGet();
        NetworkListState state = new NetworkListState();
        state.open = true;
        state.statusMessage = "Network list opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized NetworkListDto close(long dialogId) {
        NetworkListState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Network list closed";
        return toDto(dialogId, state);
    }

    public synchronized NetworkListDto selectNetwork(long dialogId, String network) {
        NetworkListState state = getState(dialogId);
        state.selectedNetwork = textOrDefault(network, state.selectedNetwork);
        state.statusMessage = "Network selected";
        return toDto(dialogId, state);
    }

    public synchronized NetworkListDto confirmSource(long dialogId) {
        NetworkListState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Network source confirmed: " + state.selectedNetwork;
        return toDto(dialogId, state);
    }

    public synchronized NetworkListDto cancel(long dialogId) {
        NetworkListState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Network selection canceled";
        return toDto(dialogId, state);
    }

    private NetworkListState getState(long dialogId) {
        NetworkListState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Network list dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private NetworkListDto toDto(long dialogId, NetworkListState state) {
        return new NetworkListDto(
                dialogId,
                state.open,
                state.selectedNetwork,
                state.availableNetworks,
                state.statusMessage
        );
    }

    private static final class NetworkListState {
        private boolean open;
        private String selectedNetwork = "default";
        private List<String> availableNetworks = List.of("default", "lab-net", "dmz-net");
        private String statusMessage = "Network list ready";
    }
}
