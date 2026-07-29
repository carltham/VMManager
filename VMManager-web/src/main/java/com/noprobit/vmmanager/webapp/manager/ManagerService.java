package com.noprobit.vmmanager.webapp.manager;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noprobit.vmmanager.webapp.manager.dto.ManagerHostDetailsDto;
import com.noprobit.vmmanager.webapp.manager.dto.ManagerPreferencesDto;
import com.noprobit.vmmanager.webapp.manager.entity.ConnectionEntity;
import com.noprobit.vmmanager.webapp.manager.entity.VmEntity;
import com.noprobit.vmmanager.webapp.manager.repository.ConnectionRepository;
import com.noprobit.vmmanager.webapp.manager.repository.VmRepository;

@Service
public class ManagerService {

    private final ConnectionRepository connectionRepository;
    private final VmRepository vmRepository;
    private boolean statsEnabled = true;

    public ManagerService(ConnectionRepository connectionRepository, VmRepository vmRepository) {
        this.connectionRepository = connectionRepository;
        this.vmRepository = vmRepository;
    }

    @Transactional(readOnly = true)
    public synchronized ManagerOverviewDto getOverview() {
        return new ManagerOverviewDto(statsEnabled, toConnectionDtos(connectionRepository.findAllByOrderByIdAsc()));
    }

    public synchronized boolean toggleStats() {
        statsEnabled = !statsEnabled;
        return statsEnabled;
    }

    @Transactional
    public synchronized ManagerConnectionDto addConnection(String name, String uri) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Connection name is required");
        }
        if (uri == null || uri.isBlank()) {
            throw new IllegalArgumentException("Connection URI is required");
        }

        ConnectionEntity connection = connectionRepository.save(new ConnectionEntity(name.trim(), uri.trim()));
        return toConnectionDto(connection);
    }

    @Transactional
    public synchronized ManagerVmDto createVm(long connectionId, String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("VM name is required");
        }

        ConnectionEntity connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found"));

        VmEntity vm = vmRepository.save(new VmEntity(connection, name.trim(), ManagerVmState.SHUTOFF, false));
        return toVmDto(vm);
    }

    @Transactional
    public synchronized ManagerVmDto openVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setOpened(true);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional
    public synchronized ManagerVmDto runVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setState(ManagerVmState.RUNNING);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional
    public synchronized ManagerVmDto pauseVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setState(ManagerVmState.PAUSED);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional
    public synchronized ManagerVmDto shutdownVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setState(ManagerVmState.SHUTOFF);
        vm.setOpened(false);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional
    public synchronized ManagerVmDto resetVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setState(ManagerVmState.RUNNING);
        vm.setOpened(true);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional
    public synchronized ManagerVmDto rebootVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setState(ManagerVmState.RUNNING);
        vm.setOpened(false);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional
    public synchronized ManagerVmDto saveVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vm.setState(ManagerVmState.SAVED);
        vm.setOpened(false);
        return toVmDto(vmRepository.save(vm));
    }

    @Transactional(readOnly = true)
    public synchronized ManagerVmDto getVm(long vmId) {
        return toVmDto(findVm(vmId));
    }

    @Transactional(readOnly = true)
    public synchronized List<ManagerVmDto> allVms() {
        List<ManagerVmDto> vms = new ArrayList<>();
        for (ConnectionEntity connection : connectionRepository.findAllByOrderByIdAsc()) {
            for (VmEntity vm : vmRepository.findAllByConnection_IdOrderByIdAsc(connection.getId())) {
                vms.add(toVmDto(vm));
            }
        }
        return vms;
    }

    @Transactional
    public synchronized void deleteVm(long vmId) {
        VmEntity vm = findVm(vmId);
        vmRepository.delete(vm);
    }

    @Transactional(readOnly = true)
    public synchronized ManagerHostDetailsDto hostDetails(long connectionId) {
        ConnectionEntity connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found"));

        return new ManagerHostDetailsDto(
                connection.getId(),
                connection.getName(),
                connection.getUri(),
                38,
                4096,
            (int) vmRepository.countByConnection_Id(connectionId));
    }

    public ManagerPreferencesDto preferences() {
        return new ManagerPreferencesDto("system", "qemu:///system", "true");
    }

    public ManagerAboutDto about() {
        return new ManagerAboutDto("VMManager-web", "manager", "0.0.1-SNAPSHOT");
    }

    private List<ManagerConnectionDto> toConnectionDtos(List<ConnectionEntity> connections) {
        List<ManagerConnectionDto> result = new ArrayList<>();
        for (ConnectionEntity connection : connections) {
            result.add(toConnectionDto(connection));
        }
        return result;
    }

    private ManagerConnectionDto toConnectionDto(ConnectionEntity connection) {
        List<ManagerVmDto> vms = new ArrayList<>();
        for (VmEntity vm : vmRepository.findAllByConnection_IdOrderByIdAsc(connection.getId())) {
            vms.add(toVmDto(vm));
        }
        return new ManagerConnectionDto(connection.getId(), connection.getName(), connection.getUri(), vms);
    }

    private ManagerVmDto toVmDto(VmEntity vm) {
        return new ManagerVmDto(vm.getId(), vm.getConnectionId(), vm.getName(), vm.getState(), vm.isOpened());
    }

    private VmEntity findVm(long vmId) {
        return vmRepository.findById(vmId)
                .orElseThrow(() -> new IllegalArgumentException("VM not found"));
    }
}
