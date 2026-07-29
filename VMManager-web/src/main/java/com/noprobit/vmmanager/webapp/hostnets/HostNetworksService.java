package com.noprobit.vmmanager.webapp.hostnets;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noprobit.vmmanager.webapp.network.entity.NetworkEntity;
import com.noprobit.vmmanager.webapp.network.repository.NetworkRepository;

@Service
public class HostNetworksService {

    private final NetworkRepository networkRepository;

    public HostNetworksService(NetworkRepository networkRepository) {
        this.networkRepository = networkRepository;
    }

    @Transactional(readOnly = true)
    public synchronized List<HostNetworkDto> list() {
        List<HostNetworkDto> result = new ArrayList<>();
        for (NetworkEntity network : networkRepository.findAllByOrderByIdAsc()) {
            result.add(toDto(network));
        }
        return List.copyOf(result);
    }

    @Transactional
    public synchronized HostNetworkDto start(long id) {
        NetworkEntity network = find(id);
        network.setActive(true);
        networkRepository.save(network);
        return toDto(network);
    }

    @Transactional
    public synchronized HostNetworkDto stop(long id) {
        NetworkEntity network = find(id);
        network.setActive(false);
        networkRepository.save(network);
        return toDto(network);
    }

    @Transactional
    public synchronized void delete(long id) {
        NetworkEntity network = find(id);
        networkRepository.delete(network);
    }

    @Transactional
    public synchronized HostNetworkDto update(long id, Boolean active, String name, Boolean autostart) {
        NetworkEntity network = find(id);
        if (name != null && !name.isBlank()) {
            String trimmedName = name.trim();
            networkRepository.findByName(trimmedName).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Network name already in use");
                }
            });
            network.setName(trimmedName);
        }

        network.setActive(active == null ? network.isActive() : active);
        network.setAutostart(autostart == null ? network.isAutostart() : autostart);
        networkRepository.save(network);
        return toDto(network);
    }

    private HostNetworkDto toDto(NetworkEntity network) {
        return new HostNetworkDto(
                network.getId(),
                network.getName(),
                network.getMode(),
                network.isActive(),
                network.isAutostart());
    }

    private NetworkEntity find(long id) {
        return networkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Network not found"));
    }
}