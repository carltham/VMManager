package com.noprobit.vmmanager.webapp.createvm;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noprobit.vmmanager.webapp.createvm.entity.CreateVmWizardEntity;
import com.noprobit.vmmanager.webapp.createvm.repository.CreateVmWizardRepository;
import com.noprobit.vmmanager.webapp.manager.ManagerConnectionDto;
import com.noprobit.vmmanager.webapp.manager.ManagerOverviewDto;
import com.noprobit.vmmanager.webapp.manager.ManagerService;
import com.noprobit.vmmanager.webapp.manager.ManagerVmDto;

@Service
public class CreateVmService {

    private static final int MAX_STEP = 5;
    private static final String DEFAULT_INSTALL_METHOD = "iso";
    private static final String DEFAULT_VM_NAME = "new-vm";
    private static final String DEFAULT_ISO_PATH = "/var/lib/libvirt/images/example.iso";
    private static final String DEFAULT_URL = "https://example.org/os";
    private static final String DEFAULT_IMPORT_SOURCE = "/images/import.qcow2";
    private static final String DEFAULT_APP_SOURCE = "/apps/rootfs";
    private static final String DEFAULT_OS_CONTAINER_SOURCE = "docker://registry.example/os:latest";
    private static final String DEFAULT_ARCH = "x86_64";
    private static final String DEFAULT_TYPE = "kvm";
    private static final String DEFAULT_MACHINE = "q35";

    private final ManagerService managerService;
    private final CreateVmWizardRepository wizardRepository;

    public CreateVmService(ManagerService managerService, CreateVmWizardRepository wizardRepository) {
        this.managerService = managerService;
        this.wizardRepository = wizardRepository;
    }

    @Transactional
    public synchronized CreateVmWizardDto open() {
        ManagerOverviewDto overview = managerService.getOverview();
        if (overview.connections().isEmpty()) {
            throw new IllegalArgumentException("No connections available");
        }

        long defaultConnectionId = overview.connections().get(0).id();
        CreateVmWizardEntity wizard = wizardRepository.save(new CreateVmWizardEntity(
                true,
                1,
                defaultConnectionId,
                DEFAULT_INSTALL_METHOD,
                DEFAULT_VM_NAME,
                DEFAULT_ISO_PATH,
                DEFAULT_URL,
                DEFAULT_IMPORT_SOURCE,
                DEFAULT_APP_SOURCE,
                DEFAULT_OS_CONTAINER_SOURCE,
                true,
                true,
                DEFAULT_ARCH,
                DEFAULT_TYPE,
                DEFAULT_MACHINE,
                "Create VM wizard opened"));
        return build(wizard, overview);
    }

    @Transactional
    public synchronized CreateVmWizardDto close(long wizardId) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setOpen(false);
        wizard.setStatusMessage("Create VM wizard closed");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto back(long wizardId) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setStep(Math.max(1, wizard.getStep() - 1));
        wizard.setStatusMessage("Moved back to step " + wizard.getStep());
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto next(long wizardId) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setStep(Math.min(MAX_STEP, wizard.getStep() + 1));
        wizard.setStatusMessage("Moved to step " + wizard.getStep());
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto finish(long wizardId) {
        CreateVmWizardEntity wizard = getState(wizardId);
        ManagerVmDto vm = managerService.createVm(wizard.getConnectionId(), wizard.getVmName());
        wizard.setOpen(false);
        wizard.setStatusMessage("VM created: " + vm.name());
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto changeConnection(long wizardId, long connectionId) {
        CreateVmWizardEntity wizard = getState(wizardId);
        ensureConnectionExists(connectionId);
        wizard.setConnectionId(connectionId);
        wizard.setStatusMessage("Connection changed");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto changeInstallMethod(long wizardId, String installMethod) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setInstallMethod(textOrDefault(installMethod, wizard.getInstallMethod()));
        wizard.setStatusMessage("Install method changed");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto browseIso(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setIsoPath(textOrDefault(value, wizard.getIsoPath()));
        wizard.setStatusMessage("ISO path updated");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto browseUrl(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setUrl(textOrDefault(value, wizard.getUrl()));
        wizard.setStatusMessage("URL updated");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto browseImportSource(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setImportSource(textOrDefault(value, wizard.getImportSource()));
        wizard.setStatusMessage("Import source updated");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto browseAppSource(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setAppSource(textOrDefault(value, wizard.getAppSource()));
        wizard.setStatusMessage("Application source updated");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto browseOsContainerSource(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setOsContainerSource(textOrDefault(value, wizard.getOsContainerSource()));
        wizard.setStatusMessage("OS container source updated");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto toggleDetectOs(long wizardId, boolean enabled) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setDetectOs(enabled);
        wizard.setStatusMessage("Detect OS " + (enabled ? "enabled" : "disabled"));
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto toggleStorage(long wizardId, boolean enabled) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setStorageEnabled(enabled);
        wizard.setStatusMessage("Storage " + (enabled ? "enabled" : "disabled"));
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto changeArch(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setArch(textOrDefault(value, wizard.getArch()));
        wizard.setStatusMessage("Architecture changed");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto changeType(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setType(textOrDefault(value, wizard.getType()));
        wizard.setStatusMessage("Virtualization type changed");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto changeMachine(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setMachine(textOrDefault(value, wizard.getMachine()));
        wizard.setStatusMessage("Machine type changed");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    @Transactional
    public synchronized CreateVmWizardDto editVmName(long wizardId, String value) {
        CreateVmWizardEntity wizard = getState(wizardId);
        wizard.setVmName(textOrDefault(value, wizard.getVmName()));
        wizard.setStatusMessage("VM name updated");
        return build(wizardRepository.save(wizard), managerService.getOverview());
    }

    private CreateVmWizardEntity getState(long wizardId) {
        return wizardRepository.findById(wizardId)
                .orElseThrow(() -> new IllegalArgumentException("Wizard not found"));
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

    private CreateVmWizardDto build(CreateVmWizardEntity wizard, ManagerOverviewDto overview) {
        List<String> connectionLabels = new ArrayList<>();
        for (ManagerConnectionDto conn : overview.connections()) {
            connectionLabels.add(conn.id() + ":" + conn.name() + " (" + conn.uri() + ")");
        }

        return new CreateVmWizardDto(
                wizard.getId(),
                wizard.isOpen(),
                wizard.getStep(),
                wizard.getConnectionId(),
                connectionLabels,
                wizard.getInstallMethod(),
                wizard.getVmName(),
                wizard.getIsoPath(),
                wizard.getUrl(),
                wizard.getImportSource(),
                wizard.getAppSource(),
                wizard.getOsContainerSource(),
                wizard.isDetectOs(),
                wizard.isStorageEnabled(),
                wizard.getArch(),
                wizard.getType(),
                wizard.getMachine(),
                wizard.getStatusMessage()
        );
    }
}
