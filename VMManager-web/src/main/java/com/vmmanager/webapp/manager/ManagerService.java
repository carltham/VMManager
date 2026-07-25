package com.vmmanager.webapp.manager;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import main.java.com.vmmanager.webapp.manager.ManagerConnectionDto;
import main.java.com.vmmanager.webapp.manager.ManagerVmDto;
import main.java.com.vmmanager.webapp.manager.ManagerVmState;

@Service
public class ManagerService {

    private final AtomicLong connectionSeq = new AtomicLong(2);
    private final AtomicLong vmSeq = new AtomicLong(3);
    private final Map<Long, ConnectionEntity> connections = new LinkedHashMap<>();
    private boolean statsEnabled = true;

    public ManagerService() {
        var local = new ConnectionEntity(1L, "Local QEMU", "qemu:///system");
        local.vms.add(new VmEntity(1L, 1L, "dev-fedora", ManagerVmState.RUNNING, false));
        local.vms.add(new VmEntity(2L, 1L, "ci-ubuntu", ManagerVmState.PAUSED, false));

        var remote = new ConnectionEntity(2L, "Remote Host", "qemu+ssh://admin@lab/system");
        remote.vms.add(new VmEntity(3L, 2L, "win11-test", ManagerVmState.SHUTOFF, false));

        connections.put(local.id, local);
        connections.put(remote.id, remote);
    }

    public synchronized ManagerOverviewDto getOverview() {
        return new ManagerOverviewDto(statsEnabled, toConnectionDtos());
    }

    public synchronized boolean toggleStats() {
        statsEnabled = !statsEnabled;
        return statsEnabled;
    }

    public synchronized ManagerConnectionDto addConnection(String name, String uri) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Connection name is required");
        }
        if (uri == null || uri.isBlank()) {
            throw new IllegalArgumentException("Connection URI is required");
        }

        long id = connectionSeq.incrementAndGet();
        ConnectionEntity conn = new ConnectionEntity(id, name.trim(), uri.trim());
        connections.put(id, conn);
        return toConnectionDto(conn);
    }

    public synchronized ManagerVmDto createVm(long connectionId, String name) {
        ConnectionEntity conn = connections.get(connectionId);
        if (conn == null) {
            throw new IllegalArgumentException("Connection not found");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("VM name is required");
        }

        long vmId = vmSeq.incrementAndGet();
        VmEntity vm = new VmEntity(vmId, connectionId, name.trim(), ManagerVmState.SHUTOFF, false);
        conn.vms.add(vm);
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto openVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.opened = true;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto runVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.state = ManagerVmState.RUNNING;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto pauseVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.state = ManagerVmState.PAUSED;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto shutdownVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.state = ManagerVmState.SHUTOFF;
        vm.opened = false;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto resetVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.state = ManagerVmState.RUNNING;
        vm.opened = true;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto rebootVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.state = ManagerVmState.RUNNING;
        vm.opened = true;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto saveVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.state = ManagerVmState.SAVED;
        vm.opened = false;
        return toVmDto(vm);
    }

    public synchronized ManagerVmDto getVm(long vmId) {
        return toVmDto(findVm(vmId));
    }

    public synchronized List<ManagerVmDto> allVms() {
        List<ManagerVmDto> vms = new ArrayList<>();
        for (ConnectionEntity connection : connections.values()) {
            for (VmEntity vm : connection.vms) {
                vms.add(toVmDto(vm));
            }
        }
        return vms;
    }

    public synchronized void deleteVm(long vmId) {
        for (ConnectionEntity connection : connections.values()) {
            for (int i = 0; i < connection.vms.size(); i++) {
                if (connection.vms.get(i).id == vmId) {
                    connection.vms.remove(i);
                    return;
                }
            }
        }
        throw new IllegalArgumentException("VM not found");
    }

    public synchronized Map<String, Object> hostDetails(long connectionId) {
        ConnectionEntity conn = connections.get(connectionId);
        if (conn == null) {
            throw new IllegalArgumentException("Connection not found");
        }

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("connectionId", conn.id);
        details.put("connectionName", conn.name);
        details.put("uri", conn.uri);
        details.put("cpuUsage", 38);
        details.put("memoryUsageMb", 4096);
        details.put("vmCount", conn.vms.size());
        return details;
    }

    public Map<String, String> preferences() {
        Map<String, String> details = new LinkedHashMap<>();
        details.put("theme", "system");
        details.put("defaultConnectionUri", "qemu:///system");
        details.put("autoConnect", "true");
        return details;
    }

    public Map<String, String> about() {
        Map<String, String> details = new LinkedHashMap<>();
        details.put("name", "VMManager-web");
        details.put("module", "manager");
        details.put("version", "0.0.1-SNAPSHOT");
        return details;
    }

    private List<ManagerConnectionDto> toConnectionDtos() {
        List<ManagerConnectionDto> result = new ArrayList<>();
        for (ConnectionEntity connection : connections.values()) {
            result.add(toConnectionDto(connection));
        }
        return result;
    }

    private ManagerConnectionDto toConnectionDto(ConnectionEntity connection) {
        List<ManagerVmDto> vms = new ArrayList<>();
        for (VmEntity vm : connection.vms) {
            vms.add(toVmDto(vm));
        }
        return new ManagerConnectionDto(connection.id, connection.name, connection.uri, vms);
    }

    private ManagerVmDto toVmDto(VmEntity vm) {
        return new ManagerVmDto(vm.id, vm.connectionId, vm.name, vm.state, vm.opened);
    }

    private VmEntity findVm(long vmId) {
        for (ConnectionEntity connection : connections.values()) {
            for (VmEntity vm : connection.vms) {
                if (vm.id == vmId) {
                    return vm;
                }
            }
        }
        throw new IllegalArgumentException("VM not found");
    }

    private static final class ConnectionEntity {
        private final long id;
        private final String name;
        private final String uri;
        private final List<VmEntity> vms = new ArrayList<>();

        private ConnectionEntity(long id, String name, String uri) {
            this.id = id;
            this.name = name;
            this.uri = uri;
        }
    }

    private static final class VmEntity {
        private final long id;
        private final long connectionId;
        private final String name;
        private ManagerVmState state;
        private boolean opened;

        private VmEntity(long id, long connectionId, String name, ManagerVmState state, boolean opened) {
            this.id = id;
            this.connectionId = connectionId;
            this.name = name;
            this.state = state;
            this.opened = opened;
        }
    }
}
