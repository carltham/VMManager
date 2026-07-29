package com.noprobit.vmmanager.webapp.network;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.noprobit.vmmanager.webapp.network.entity.NetworkEntity;
import com.noprobit.vmmanager.webapp.network.repository.NetworkRepository;

@Component
public class NetworkDataInitializer implements CommandLineRunner {

    private final NetworkRepository networkRepository;

    public NetworkDataInitializer(NetworkRepository networkRepository) {
        this.networkRepository = networkRepository;
    }

    @Override
    public void run(String... args) {
        if (networkRepository.count() > 0) {
            return;
        }

        networkRepository.save(new NetworkEntity("default", "nat", "192.168.122.0/24", true, true));
        networkRepository.save(new NetworkEntity("lab-net", "isolated", "192.168.200.0/24", false, false));
        networkRepository.save(new NetworkEntity("dmz-net", "nat", "10.10.10.0/24", false, false));
    }
}