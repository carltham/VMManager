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

    private static final List<String> DEFAULT_BROWSE_ENTRIES = List.of(
            "/",
            "/var",
            "/var/lib",
            "/var/lib/libvirt",
            "/var/lib/libvirt/images",
            "/srv",
            "/srv/vms");

    private final StoragePoolRepository poolRepository;
    private final StorageVolumeRepository volumeRepository;
    private BrowseState browseState = BrowseState.closed();

    public StorageManagementService(StoragePoolRepository poolRepository, StorageVolumeRepository volumeRepository) {
        this.poolRepository = poolRepository;
        this.volumeRepository = volumeRepository;
    }

    @Transactional(readOnly = true)
    public synchronized View view() {
        return snapshot("Host storage loaded", null);
    }

    @Transactional
    public synchronized View pool(String action, long id, String name, String type, String target) {
        if ("create".equals(action)) {
            String poolName = textOrDefault(name, "new-pool");
            poolRepository.save(new StoragePoolEntity(
                    poolName,
                    textOrDefault(type, "dir"),
                    textOrDefault(target, "/var/lib/libvirt/images"),
                    false));
            return snapshot("Pool " + poolName + " created.", null);
        }

        StoragePoolEntity pool = poolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pool not found"));

        if ("delete".equals(action)) {
            String deleted = pool.getName();
            poolRepository.delete(pool);
            return snapshot("Pool " + deleted + " deleted.", null);
        }
        if ("start".equals(action) || "stop".equals(action)) {
            pool.setActive("start".equals(action));
            poolRepository.save(pool);
            return snapshot("Pool " + pool.getName() + " " + action + "ed.", null);
        }

        throw new IllegalArgumentException("Unknown pool action: " + action);
    }

    @Transactional
    public synchronized View volume(String name, String pool, String format, int size) {
        String volumeName = textOrDefault(name, "new-volume.qcow2");
        String poolName = textOrDefault(pool, "default");
        StoragePoolEntity storagePool = poolRepository.findByName(poolName)
                .orElseThrow(() -> new IllegalArgumentException("Pool not found"));
        volumeRepository.save(new StorageVolumeEntity(
                storagePool,
                volumeName,
                textOrDefault(format, "qcow2"),
                Math.max(1, size)));
        return snapshot("Volume " + volumeName + " created in pool " + poolName + ".", null);
    }

    @Transactional(readOnly = true)
    public synchronized List<String> poolNames() {
        List<String> names = new ArrayList<>();
        for (StoragePoolEntity pool : poolRepository.findAllByOrderByIdAsc()) {
            names.add(pool.getName());
        }
        return List.copyOf(names);
    }

    public synchronized BrowseView openBrowse() {
        browseState = new BrowseState(
                true,
                "/var/lib/libvirt/images",
                DEFAULT_BROWSE_ENTRIES,
                "/var/lib/libvirt/images",
                "Storage browser opened",
                "");
        return toBrowseView(browseState);
    }

    public synchronized BrowseView selectBrowsePath(String path) {
        ensureBrowseOpen();
        String selected = textOrDefault(path, browseState.selectedPath);
        browseState = new BrowseState(
                true,
                selected,
                DEFAULT_BROWSE_ENTRIES,
                selected,
                "Path selected: " + selected,
                "");
        return toBrowseView(browseState);
    }

    public synchronized BrowseView confirmBrowsePath(String path) {
        ensureBrowseOpen();
        String selected = textOrDefault(path, browseState.selectedPath);
        // Keep dialog open so the UI can show the confirmation status before Close.
        browseState = new BrowseState(
                true,
                selected,
                DEFAULT_BROWSE_ENTRIES,
                selected,
                "Selected " + selected + ".",
                "");
        return toBrowseView(browseState);
    }

    private void ensureBrowseOpen() {
        if (browseState == null || !browseState.open) {
            browseState = new BrowseState(
                    true,
                    "/var/lib/libvirt/images",
                    DEFAULT_BROWSE_ENTRIES,
                    "/var/lib/libvirt/images",
                    "Storage browser opened",
                    "");
        }
    }

    private View snapshot(String statusMessage, String errorMessage) {
        List<Pool> pools = new ArrayList<>();
        for (StoragePoolEntity pool : poolRepository.findAllByOrderByIdAsc()) {
            pools.add(toPool(pool));
        }

        List<Volume> volumes = new ArrayList<>();
        for (StorageVolumeEntity volume : volumeRepository.findAllByOrderByIdAsc()) {
            volumes.add(toVolume(volume));
        }

        return new View(
                true,
                List.copyOf(pools),
                List.copyOf(volumes),
                "/var/lib/libvirt/images",
                statusMessage == null ? "" : statusMessage,
                errorMessage == null ? "" : errorMessage);
    }

    private Pool toPool(StoragePoolEntity entity) {
        return new Pool(entity.getId(), entity.getName(), entity.getType(), entity.getTarget(), entity.isActive());
    }

    private Volume toVolume(StorageVolumeEntity entity) {
        return new Volume(entity.getId(), entity.getName(), entity.getPool().getName(), entity.getFormat(), entity.getSizeGb());
    }

    private BrowseView toBrowseView(BrowseState state) {
        return new BrowseView(
                state.open,
                state.currentPath,
                List.copyOf(state.entries),
                state.selectedPath,
                state.statusMessage,
                state.errorMessage);
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    public record Pool(long id, String name, String type, String target, boolean active) {
    }

    public record Volume(long id, String name, String pool, String format, int sizeGb) {
    }

    public record View(
            boolean open,
            List<Pool> pools,
            List<Volume> volumes,
            String currentPath,
            String statusMessage,
            String errorMessage) {
    }

    public record BrowseView(
            boolean open,
            String currentPath,
            List<String> entries,
            String selectedPath,
            String statusMessage,
            String errorMessage) {
    }

    private record BrowseState(
            boolean open,
            String currentPath,
            List<String> entries,
            String selectedPath,
            String statusMessage,
            String errorMessage) {
        private static BrowseState closed() {
            return new BrowseState(false, "/", DEFAULT_BROWSE_ENTRIES, "/", "", "");
        }
    }
}
