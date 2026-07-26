package com.vmmanager.webapp.createvm;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.vmmanager.webapp.manager.ManagerOverviewDto;
import com.vmmanager.webapp.manager.ManagerService;

import main.java.com.vmmanager.webapp.createvm.CreateVmWizardDto;
import main.java.com.vmmanager.webapp.manager.ManagerConnectionDto;
import main.java.com.vmmanager.webapp.manager.ManagerVmDto;

@Service
public class CreateVmService {

    private static final int MAX_STEP = 5;

    private final ManagerService managerService;
    private final AtomicLong wizardSeq = new AtomicLong(0);
    private final Map<Long, WizardState> wizards = new LinkedHashMap<>();

    public CreateVmService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized CreateVmWizardDto open() {
        ManagerOverviewDto overview = managerService.getOverview();
        if (overview.connections().isEmpty()) {
            throw new IllegalArgumentException("No connections available");
        }

        long wizardId = wizardSeq.incrementAndGet();
        long defaultConnectionId = overview.connections().get(0).id();
        WizardState state = new WizardState(defaultConnectionId);
        state.open = true;
        state.statusMessage = "Create VM wizard opened";
        wizards.put(wizardId, state);
        return build(wizardId, state, overview);
    }

    public synchronized CreateVmWizardDto close(long wizardId) {
        WizardState state = getState(wizardId);
        state.open = false;
        state.statusMessage = "Create VM wizard closed";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto back(long wizardId) {
        WizardState state = getState(wizardId);
        state.step = Math.max(1, state.step - 1);
        state.statusMessage = "Moved back to step " + state.step;
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto next(long wizardId) {
        WizardState state = getState(wizardId);
        state.step = Math.min(MAX_STEP, state.step + 1);
        state.statusMessage = "Moved to step " + state.step;
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto finish(long wizardId) {
        WizardState state = getState(wizardId);
        ManagerVmDto vm = managerService.createVm(state.connectionId, state.vmName);
        state.open = false;
        state.statusMessage = "VM created: " + vm.name();
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto changeConnection(long wizardId, long connectionId) {
        WizardState state = getState(wizardId);
        ensureConnectionExists(connectionId);
        state.connectionId = connectionId;
        state.statusMessage = "Connection changed";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto changeInstallMethod(long wizardId, String installMethod) {
        WizardState state = getState(wizardId);
        state.installMethod = textOrDefault(installMethod, state.installMethod);
        state.statusMessage = "Install method changed";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto browseIso(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.isoPath = textOrDefault(value, state.isoPath);
        state.statusMessage = "ISO path updated";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto browseUrl(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.url = textOrDefault(value, state.url);
        state.statusMessage = "URL updated";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto browseImportSource(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.importSource = textOrDefault(value, state.importSource);
        state.statusMessage = "Import source updated";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto browseAppSource(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.appSource = textOrDefault(value, state.appSource);
        state.statusMessage = "Application source updated";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto browseOsContainerSource(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.osContainerSource = textOrDefault(value, state.osContainerSource);
        state.statusMessage = "OS container source updated";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto toggleDetectOs(long wizardId, boolean enabled) {
        WizardState state = getState(wizardId);
        state.detectOs = enabled;
        state.statusMessage = "Detect OS " + (enabled ? "enabled" : "disabled");
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto toggleStorage(long wizardId, boolean enabled) {
        WizardState state = getState(wizardId);
        state.storageEnabled = enabled;
        state.statusMessage = "Storage " + (enabled ? "enabled" : "disabled");
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto changeArch(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.arch = textOrDefault(value, state.arch);
        state.statusMessage = "Architecture changed";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto changeType(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.type = textOrDefault(value, state.type);
        state.statusMessage = "Virtualization type changed";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto changeMachine(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.machine = textOrDefault(value, state.machine);
        state.statusMessage = "Machine type changed";
        return build(wizardId, state, managerService.getOverview());
    }

    public synchronized CreateVmWizardDto editVmName(long wizardId, String value) {
        WizardState state = getState(wizardId);
        state.vmName = textOrDefault(value, state.vmName);
        state.statusMessage = "VM name updated";
        return build(wizardId, state, managerService.getOverview());
    }

    private WizardState getState(long wizardId) {
        WizardState state = wizards.get(wizardId);
        if (state == null) {
            throw new IllegalArgumentException("Wizard not found");
        }
        return state;
    }

    private void ensureConnectionExists(long connectionId) {
        for (ManagerConnectionDto connection : managerService.getOverview().connections()) {
            if (connection.id() == connectionId) {
                return;
            }
        }
        throw new IllegalArgumentException("Connection not found");
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private CreateVmWizardDto build(long wizardId, WizardState state, ManagerOverviewDto overview) {
        List<String> connectionLabels = new ArrayList<>();
        for (ManagerConnectionDto conn : overview.connections()) {
            connectionLabels.add(conn.id() + ":" + conn.name() + " (" + conn.uri() + ")");
        }

        return new CreateVmWizardDto(
                wizardId,
                state.open,
                state.step,
                state.connectionId,
                connectionLabels,
                state.installMethod,
                state.vmName,
                state.isoPath,
                state.url,
                state.importSource,
                state.appSource,
                state.osContainerSource,
                state.detectOs,
                state.storageEnabled,
                state.arch,
                state.type,
                state.machine,
                state.statusMessage
        );
    }

    private static final class WizardState {
        private boolean open;
        private int step = 1;
        private long connectionId;
        private String installMethod = "iso";
        private String vmName = "new-vm";
        private String isoPath = "/var/lib/libvirt/images/example.iso";
        private String url = "https://example.org/os";
        private String importSource = "/images/import.qcow2";
        private String appSource = "/apps/rootfs";
        private String osContainerSource = "docker://registry.example/os:latest";
        private boolean detectOs = true;
        private boolean storageEnabled = true;
        private String arch = "x86_64";
        private String type = "kvm";
        private String machine = "q35";
        private String statusMessage = "Wizard ready";

        private WizardState(long connectionId) {
            this.connectionId = connectionId;
        }
    }
}
