package com.noprobit.vmmanager.webapp.migratevm;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.noprobit.vmmanager.webapp.manager.ManagerService;
import com.noprobit.vmmanager.webapp.manager.ManagerVmDto;

@Service
public class MigrateVmService {

    private final AtomicLong dialogSeq = new AtomicLong(0);
    private final Map<Long, MigrateState> dialogs = new LinkedHashMap<>();
    private final ManagerService managerService;

    public MigrateVmService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized MigrateVmDto open(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        long dialogId = dialogSeq.incrementAndGet();
        MigrateState state = new MigrateState(vm.id(), vm.name());
        state.open = true;
        state.statusMessage = "Migrate dialog opened";
        dialogs.put(dialogId, state);
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto close(long dialogId) {
        MigrateState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Migrate dialog closed";
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto chooseDestination(long dialogId, String destination) {
        MigrateState state = getState(dialogId);
        state.destination = textOrDefault(destination, state.destination);
        state.statusMessage = "Destination selected";
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto toggleAddress(long dialogId, boolean value) {
        MigrateState state = getState(dialogId);
        state.addressEnabled = value;
        state.statusMessage = "Address option updated";
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto togglePort(long dialogId, boolean value) {
        MigrateState state = getState(dialogId);
        state.portEnabled = value;
        state.statusMessage = "Port option updated";
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto changeMigrationMode(long dialogId, String value) {
        MigrateState state = getState(dialogId);
        state.migrationMode = textOrDefault(value, state.migrationMode);
        state.statusMessage = "Migration mode updated";
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto editXmlPreview(long dialogId, String value) {
        MigrateState state = getState(dialogId);
        state.xmlPreview = textOrDefault(value, state.xmlPreview);
        state.statusMessage = "XML preview updated";
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto finishMigration(long dialogId) {
        MigrateState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Migration started to " + state.destination;
        return toDto(dialogId, state);
    }

    public synchronized MigrateVmDto cancelMigration(long dialogId) {
        MigrateState state = getState(dialogId);
        state.open = false;
        state.statusMessage = "Migration canceled";
        return toDto(dialogId, state);
    }

    private MigrateState getState(long dialogId) {
        MigrateState state = dialogs.get(dialogId);
        if (state == null) {
            throw new IllegalArgumentException("Migrate dialog not found");
        }
        return state;
    }

    private String textOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private MigrateVmDto toDto(long dialogId, MigrateState state) {
        return new MigrateVmDto(
                dialogId,
                state.open,
                state.vmId,
                state.destination,
                state.addressEnabled,
                state.portEnabled,
                state.migrationMode,
                state.xmlPreview,
                state.statusMessage
        );
    }

    private static final class MigrateState {
        private boolean open;
        private long vmId;
        private String destination = "qemu+ssh://target/system";
        private boolean addressEnabled;
        private boolean portEnabled;
        private String migrationMode = "live";
        private String xmlPreview;
        private String statusMessage = "Migrate dialog ready";

        private MigrateState(long vmId, String vmName) {
            this.vmId = vmId;
            this.xmlPreview = "<domain><name>" + vmName + "</name></domain>";
        }
    }
}
