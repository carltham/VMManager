package com.noprobit.vmmanager.webapp.createnetwork;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noprobit.vmmanager.webapp.createnetwork.entity.CreateNetworkWizardEntity;
import com.noprobit.vmmanager.webapp.createnetwork.repository.CreateNetworkWizardRepository;
import com.noprobit.vmmanager.webapp.network.entity.NetworkEntity;
import com.noprobit.vmmanager.webapp.network.repository.NetworkRepository;

@Service
public class CreateNetworkService {

    private static final int MAX_STEP = 4;
    private static final String DEFAULT_ADDRESS_RANGE = "192.168.100.0/24";

    private final CreateNetworkWizardRepository wizardRepository;
    private final NetworkRepository networkRepository;

    public CreateNetworkService(
            CreateNetworkWizardRepository wizardRepository,
            NetworkRepository networkRepository) {
        this.wizardRepository = wizardRepository;
        this.networkRepository = networkRepository;
    }

    @Transactional
    public synchronized CreateNetworkDto open() {
        CreateNetworkWizardEntity wizard = wizardRepository.save(new CreateNetworkWizardEntity(
                true,
                1,
                "default-net",
                "nat",
                DEFAULT_ADDRESS_RANGE,
                "Create network wizard opened"));
        return toDto(wizard);
    }

    @Transactional
    public synchronized CreateNetworkDto close(long wizardId) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setOpen(false);
        wizard.setStatusMessage("Create network wizard closed");
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto back(long wizardId) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setStep(Math.max(1, wizard.getStep() - 1));
        wizard.setStatusMessage("Moved back to step " + wizard.getStep());
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto next(long wizardId) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setStep(Math.min(MAX_STEP, wizard.getStep() + 1));
        wizard.setStatusMessage("Moved to step " + wizard.getStep());
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto configureNetwork(long wizardId, String networkName, String mode) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setNetworkName(textOrDefault(networkName, wizard.getNetworkName()));
        wizard.setMode(textOrDefault(mode, wizard.getMode()));
        wizard.setStatusMessage("Network configuration updated");
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto setAddressRange(long wizardId, String value) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setAddressRange(textOrDefault(value, wizard.getAddressRange()));
        wizard.setStatusMessage("Address range updated");
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto review(long wizardId) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setStatusMessage("Review complete");
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto createNetwork(long wizardId) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        networkRepository.save(new NetworkEntity(
                wizard.getNetworkName(),
                wizard.getMode(),
                wizard.getAddressRange(),
                false,
                false));
        wizard.setOpen(false);
        wizard.setStatusMessage("Network created: " + wizard.getNetworkName());
        return toDto(wizardRepository.save(wizard));
    }

    @Transactional
    public synchronized CreateNetworkDto cancel(long wizardId) {
        CreateNetworkWizardEntity wizard = getState(wizardId);
        wizard.setOpen(false);
        wizard.setStatusMessage("Create network canceled");
        return toDto(wizardRepository.save(wizard));
    }

    private CreateNetworkWizardEntity getState(long wizardId) {
        return wizardRepository.findById(wizardId)
                .orElseThrow(() -> new IllegalArgumentException("Create network wizard not found"));
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private CreateNetworkDto toDto(CreateNetworkWizardEntity wizard) {
        return new CreateNetworkDto(
                wizard.getId(),
                wizard.isOpen(),
                wizard.getStep(),
                wizard.getNetworkName(),
                wizard.getMode(),
                wizard.getAddressRange(),
                wizard.getStatusMessage());
    }
}
