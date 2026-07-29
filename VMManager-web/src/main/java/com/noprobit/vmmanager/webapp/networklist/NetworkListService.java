package com.noprobit.vmmanager.webapp.networklist;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noprobit.vmmanager.webapp.network.repository.NetworkRepository;
import com.noprobit.vmmanager.webapp.networklist.entity.NetworkListDialogEntity;
import com.noprobit.vmmanager.webapp.networklist.repository.NetworkListDialogRepository;

@Service
public class NetworkListService {

    private final NetworkListDialogRepository dialogRepository;
    private final NetworkRepository networkRepository;

    public NetworkListService(
            NetworkListDialogRepository dialogRepository,
            NetworkRepository networkRepository) {
        this.dialogRepository = dialogRepository;
        this.networkRepository = networkRepository;
    }

    @Transactional
    public synchronized NetworkListDto open() {
        String defaultSelection = availableNetworks().stream().findFirst().orElse("default");
        NetworkListDialogEntity dialog = dialogRepository.save(
                new NetworkListDialogEntity(true, defaultSelection, "Network list opened"));
        return toDto(dialog);
    }

    @Transactional
    public synchronized NetworkListDto close(long dialogId) {
        NetworkListDialogEntity dialog = getState(dialogId);
        dialog.setOpen(false);
        dialog.setStatusMessage("Network list closed");
        return toDto(dialogRepository.save(dialog));
    }

    @Transactional
    public synchronized NetworkListDto selectNetwork(long dialogId, String network) {
        NetworkListDialogEntity dialog = getState(dialogId);
        dialog.setSelectedNetwork(textOrDefault(network, dialog.getSelectedNetwork()));
        dialog.setStatusMessage("Network selected");
        return toDto(dialogRepository.save(dialog));
    }

    @Transactional
    public synchronized NetworkListDto confirmSource(long dialogId) {
        NetworkListDialogEntity dialog = getState(dialogId);
        dialog.setOpen(false);
        dialog.setStatusMessage("Network source confirmed: " + dialog.getSelectedNetwork());
        return toDto(dialogRepository.save(dialog));
    }

    @Transactional
    public synchronized NetworkListDto cancel(long dialogId) {
        NetworkListDialogEntity dialog = getState(dialogId);
        dialog.setOpen(false);
        dialog.setStatusMessage("Network selection canceled");
        return toDto(dialogRepository.save(dialog));
    }

    private NetworkListDialogEntity getState(long dialogId) {
        return dialogRepository.findById(dialogId)
                .orElseThrow(() -> new IllegalArgumentException("Network list dialog not found"));
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private List<String> availableNetworks() {
        List<String> networks = new ArrayList<>();
        networkRepository.findAllByOrderByIdAsc().forEach(network -> networks.add(network.getName()));
        return networks;
    }

    private NetworkListDto toDto(NetworkListDialogEntity dialog) {
        return new NetworkListDto(
                dialog.getId(),
                dialog.isOpen(),
                dialog.getSelectedNetwork(),
                availableNetworks(),
                dialog.getStatusMessage()
        );
    }
}
