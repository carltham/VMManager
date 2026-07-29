package com.noprobit.vmmanager.webapp.storage;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noprobit.vmmanager.webapp.storage.entity.StoragePoolEntity;
import com.noprobit.vmmanager.webapp.storage.entity.StorageVolumeEntity;
import com.noprobit.vmmanager.webapp.storage.repository.StoragePoolRepository;
import com.noprobit.vmmanager.webapp.storage.repository.StorageVolumeRepository;

@Service
public class StorageManagementService {

    private final StoragePoolRepository poolRepository;
    private final StorageVolumeRepository volumeRepository;

    public StorageManagementService(StoragePoolRepository poolRepository, StorageVolumeRepository volumeRepository) {
        this.poolRepository = poolRepository;
        this.volumeRepository = volumeRepository;
    }

    @Transactional(readOnly = true)
    public synchronized View view() {
        return snapshot();
    }

    private View snapshot() {
        List<Pool> pools = new ArrayList<>();
        for (StoragePoolEntity pool : poolRepository.findAllByOrderByIdAsc()) {
            pools.add(toPool(pool));
        }

        List<Volume> volumes = new ArrayList<>();
        for (StorageVolumeEntity volume : volumeRepository.findAllByOrderByIdAsc()) {
            volumes.add(toVolume(volume));
        }

        return new View(List.copyOf(pools), List.copyOf(volumes), "/var/lib/libvirt/images");
    }

    @Transactional
    public synchronized View pool(String action, long id, String name, String type, String target) {
        if ("create".equals(action)) {
            poolRepository.save(new StoragePoolEntity(name, type, target, false));
            return snapshot();
        }

        StoragePoolEntity pool = poolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pool not found"));

        if ("delete".equals(action)) {
            poolRepository.delete(pool);
        } else if ("start".equals(action) || "stop".equals(action)) {
            pool.setActive("start".equals(action));
            poolRepository.save(pool);
        }

        return snapshot();
    }

    @Transactional
    public synchronized View volume(String name, String pool, String format, int size) {
        StoragePoolEntity storagePool = poolRepository.findByName(pool)
                .orElseThrow(() -> new IllegalArgumentException("Pool not found"));
        volumeRepository.save(new StorageVolumeEntity(storagePool, name, format, size));
        return snapshot();
    }

    private Pool toPool(StoragePoolEntity entity) {
        return new Pool(entity.getId(), entity.getName(), entity.getType(), entity.getTarget(), entity.isActive());
    }

    private Volume toVolume(StorageVolumeEntity entity) {
        return new Volume(entity.getId(), entity.getName(), entity.getPool().getName(), entity.getFormat(), entity.getSizeGb());
    }

    public record Pool(long id, String name, String type, String target, boolean active) {
    }

    public record Volume(long id, String name, String pool, String format, int sizeGb) {
    }

    public record View(List<Pool> pools, List<Volume> volumes, String currentPath) {
    }
}