package com.vmmanager.webapp.hostnets;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class HostNetworksService {
    private final List<HostNetworkDto> networks = new ArrayList<>(List.of(
            new HostNetworkDto(1, "default", "nat", true, true),
            new HostNetworkDto(2, "isolated", "isolated", false, false)
    ));

    public synchronized List<HostNetworkDto> list() { return List.copyOf(networks); }
    public synchronized HostNetworkDto start(long id) { return update(id, true, null, null); }
    public synchronized HostNetworkDto stop(long id) { return update(id, false, null, null); }
    public synchronized void delete(long id) { networks.removeIf(network -> network.id() == id); }
    public synchronized HostNetworkDto update(long id, Boolean active, String name, Boolean autostart) {
        for (int index = 0; index < networks.size(); index++) {
            HostNetworkDto network = networks.get(index);
            if (network.id() == id) {
                HostNetworkDto updated = new HostNetworkDto(id, name == null || name.isBlank() ? network.name() : name.trim(), network.mode(), active == null ? network.active() : active, autostart == null ? network.autostart() : autostart);
                networks.set(index, updated);
                return updated;
            }
        }
        throw new IllegalArgumentException("Network not found");
    }
}