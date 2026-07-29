package com.noprobit.vmmanager.webapp.vmwindow;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.noprobit.vmmanager.webapp.manager.ManagerService;

import com.noprobit.vmmanager.webapp.manager.ManagerVmDto;
import com.noprobit.vmmanager.webapp.vmwindow.VmWindowDto;
import com.noprobit.vmmanager.webapp.vmwindow.VmWindowTab;

@Service
public class VmWindowService {

    private final ManagerService managerService;
    private final Map<Long, VmWindowState> windows = new LinkedHashMap<>();

    public VmWindowService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized VmWindowDto open(long vmId) {
        ManagerVmDto vm = managerService.openVm(vmId);
        VmWindowState state = windows.computeIfAbsent(vmId, ignored -> new VmWindowState(VmWindowTab.CONSOLE));
        state.statusMessage = "VM window opened";
        return build(vm, state);
    }

    public synchronized VmWindowDto close(long vmId) {
        windows.remove(vmId);
        ManagerVmDto vm = managerService.getVm(vmId);
        return new VmWindowDto(
                vm,
                VmWindowTab.CONSOLE,
                "VM window closed",
                "Console disconnected",
                "Details pane hidden"
        );
    }

    public synchronized VmWindowDto switchTab(long vmId, VmWindowTab tab) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmWindowState state = windows.computeIfAbsent(vmId, ignored -> new VmWindowState(VmWindowTab.CONSOLE));
        state.activeTab = tab;
        state.statusMessage = "Switched tab to " + tab.name().toLowerCase();
        return build(vm, state);
    }

    public synchronized VmWindowDto startVm(long vmId) {
        ManagerVmDto vm = managerService.runVm(vmId);
        VmWindowState state = stateFor(vmId, "VM started");
        return build(vm, state);
    }

    public synchronized VmWindowDto pauseVm(long vmId) {
        ManagerVmDto vm = managerService.pauseVm(vmId);
        VmWindowState state = stateFor(vmId, "VM paused");
        return build(vm, state);
    }

    public synchronized VmWindowDto resetVm(long vmId) {
        ManagerVmDto vm = managerService.resetVm(vmId);
        VmWindowState state = stateFor(vmId, "VM reset completed");
        return build(vm, state);
    }

    public synchronized VmWindowDto rebootVm(long vmId) {
        ManagerVmDto vm = managerService.rebootVm(vmId);
        VmWindowState state = stateFor(vmId, "VM rebooted");
        return build(vm, state);
    }

    public synchronized VmWindowDto shutdownVm(long vmId) {
        ManagerVmDto vm = managerService.shutdownVm(vmId);
        VmWindowState state = stateFor(vmId, "VM shut down");
        return build(vm, state);
    }

    public synchronized VmWindowDto saveVm(long vmId) {
        ManagerVmDto vm = managerService.saveVm(vmId);
        VmWindowState state = stateFor(vmId, "VM saved");
        return build(vm, state);
    }

    public synchronized VmWindowDto updateStatus(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmWindowState state = windows.computeIfAbsent(vmId, ignored -> new VmWindowState(VmWindowTab.CONSOLE));
        state.statusMessage = "Status refreshed";
        return build(vm, state);
    }

    private VmWindowState stateFor(long vmId, String message) {
        VmWindowState state = windows.computeIfAbsent(vmId, ignored -> new VmWindowState(VmWindowTab.CONSOLE));
        state.statusMessage = message;
        return state;
    }

    private VmWindowDto build(ManagerVmDto vm, VmWindowState state) {
        String consoleText = "Console for " + vm.name() + " is " + (vm.opened() ? "connected" : "idle") + ".";
        String detailsText = "State=" + vm.state() + ", ConnectionId=" + vm.connectionId() + ", VMId=" + vm.id();
        return new VmWindowDto(vm, state.activeTab, state.statusMessage, consoleText, detailsText);
    }

    private static final class VmWindowState {
        private VmWindowTab activeTab;
        private String statusMessage;

        private VmWindowState(VmWindowTab activeTab) {
            this.activeTab = activeTab;
            this.statusMessage = "VM window ready";
        }
    }
}
