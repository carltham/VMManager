package com.noprobit.vmmanager.webapp.storage;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.noprobit.vmmanager.webapp.storage.entity.StoragePoolEntity;
import com.noprobit.vmmanager.webapp.storage.entity.StorageVolumeEntity;
import com.noprobit.vmmanager.webapp.storage.repository.StoragePoolRepository;
import com.noprobit.vmmanager.webapp.storage.repository.StorageVolumeRepository;

@Component
public class StorageManagementDataInitializer implements CommandLineRunner {

    private final StoragePoolRepository poolRepository;
    private final StorageVolumeRepository volumeRepository;

    public StorageManagementDataInitializer(StoragePoolRepository poolRepository, StorageVolumeRepository volumeRepository) {
        this.poolRepository = poolRepository;
        this.volumeRepository = volumeRepository;
    }

    @Override
    public void run(String... args) {
        if (poolRepository.count() > 0 || volumeRepository.count() > 0) {
            return;
        }

        StoragePoolEntity defaultPool = poolRepository.save(new StoragePoolEntity("default", "dir", "/var/lib/libvirt/images", true));
        StoragePoolEntity archivePool = poolRepository.save(new StoragePoolEntity("archive", "dir", "/srv/vms", false));

        volumeRepository.save(new StorageVolumeEntity(defaultPool, "base.qcow2", "qcow2", 20));
        volumeRepository.save(new StorageVolumeEntity(archivePool, "archive-template.qcow2", "qcow2", 40));
    }
}