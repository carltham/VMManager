package com.noprobit.vmmanager.webapp.vmdetails;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.noprobit.vmmanager.webapp.manager.ManagerService;

import com.noprobit.vmmanager.webapp.manager.ManagerVmDto;

@Service
public class VmDetailsService {

    private static final List<VmOsListItemDto> DEFAULT_OS_CHOICES = List.of(
            new VmOsListItemDto("fedora41", "Fedora 41", "linux"),
            new VmOsListItemDto("ubuntu2404", "Ubuntu 24.04", "linux"),
            new VmOsListItemDto("debian12", "Debian 12", "linux"),
            new VmOsListItemDto("win11", "Windows 11", "windows"));

    private final ManagerService managerService;
    private final Map<Long, VmDetailsState> detailsByVm = new LinkedHashMap<>();

    public VmDetailsService(ManagerService managerService) {
        this.managerService = managerService;
    }

    public synchronized VmDetailsDto open(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = detailsByVm.computeIfAbsent(vmId, ignored -> defaultState(vm));
        state.open = true;
        state.statusMessage = "Details opened";
        return build(vm, state);
    }

    public synchronized VmDetailsDto refresh(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.statusMessage = "Details refreshed";
        return build(vm, state);
    }

    public synchronized VmDetailsDto selectHardware(long vmId, String hardware) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.selectedHardware = normalizeText(hardware, "disk");
        state.statusMessage = "Hardware selected: " + state.selectedHardware;
        return build(vm, state);
    }

    public synchronized VmDetailsDto editGeneral(long vmId, String value) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.generalSettings = normalizeText(value, state.generalSettings);
        state.validationErrors = List.of();
        state.statusMessage = "General settings updated";
        return build(vm, state);
    }

    public synchronized VmDetailsDto editCpu(long vmId, Integer cpuCount) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.cpuCount = Math.max(1, cpuCount == null ? state.cpuCount : cpuCount);
        state.statusMessage = "CPU updated";
        return build(vm, state);
    }

    public synchronized VmDetailsDto editMemory(long vmId, Integer memoryMb) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.memoryMb = Math.max(512, memoryMb == null ? state.memoryMb : memoryMb);
        state.statusMessage = "Memory updated";
        return build(vm, state);
    }

    public synchronized VmDetailsDto editBoot(long vmId, String bootOrder) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.bootOrder = normalizeText(bootOrder, state.bootOrder);
        state.statusMessage = "Boot order updated";
        return build(vm, state);
    }

    public synchronized VmDetailsDto addHardware(long vmId, String hardware) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        String hw = normalizeText(hardware, "new-device");
        state.hardwareDevices.add(hw);
        state.statusMessage = "Hardware added: " + hw;
        return build(vm, state);
    }

    public synchronized VmDetailsDto removeHardware(long vmId, String hardware) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        String hw = normalizeText(hardware, state.selectedHardware);
        state.hardwareDevices.remove(hw);
        state.statusMessage = "Hardware removed: " + hw;
        return build(vm, state);
    }

    public synchronized VmDetailsDto editStorage(long vmId, String value) {
        return touchDeviceSetting(vmId, "storage", value);
    }

    public synchronized VmDetailsDto editNetwork(long vmId, String value) {
        return touchDeviceSetting(vmId, "network", value);
    }

    public synchronized VmDetailsDto editGraphics(long vmId, String value) {
        return touchDeviceSetting(vmId, "graphics", value);
    }

    public synchronized VmDetailsDto editTpm(long vmId, String value) {
        return touchDeviceSetting(vmId, "tpm", value);
    }

    public synchronized VmDetailsDto editVsock(long vmId, String value) {
        return touchDeviceSetting(vmId, "vsock", value);
    }

    public synchronized VmDetailsDto launchXmlEditor(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.xmlEditorOpen = true;
        state.validationErrors = List.of();
        state.statusMessage = "XML editor launched";
        return build(vm, state);
    }

    public synchronized VmDetailsDto launchStorageBrowser(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.storageBrowserOpen = true;
        state.statusMessage = "Storage browser launched";
        return build(vm, state);
    }

    public synchronized VmDetailsDto launchOsList(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.osListOpen = true;
        state.osChoices = DEFAULT_OS_CHOICES;
        state.statusMessage = "OS list launched";
        return build(vm, state);
    }

    public synchronized VmXmlValidationResponseDto validateXml(long vmId, String xml) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        List<String> errors = new ArrayList<>();
        String value = xml == null ? "" : xml.trim();

        if (value.isBlank() || !value.contains("<domain")) {
            errors.add("Missing domain root element");
        }
        if (!value.contains("<memory")) {
            errors.add("Missing memory element");
        }

        int nameIndex = value.indexOf("<name");
        int devicesIndex = value.indexOf("<devices");
        if (devicesIndex >= 0 && nameIndex >= 0 && devicesIndex < nameIndex) {
            errors.add("Invalid devices ordering");
        }

        state.validationErrors = List.copyOf(errors);
        state.statusMessage = errors.isEmpty() ? "XML validation passed" : "XML validation failed";
        return new VmXmlValidationResponseDto(errors.isEmpty(), List.copyOf(errors));
    }

    public synchronized VmOsListResponseDto osList(long vmId, String query) {
        managerService.getVm(vmId);
        String normalizedQuery = query == null ? "" : query.trim().toLowerCase();
        List<VmOsListItemDto> items = new ArrayList<>();
        for (VmOsListItemDto item : DEFAULT_OS_CHOICES) {
            if (normalizedQuery.isBlank()
                    || item.label().toLowerCase().contains(normalizedQuery)
                    || item.id().toLowerCase().contains(normalizedQuery)
                    || item.family().toLowerCase().contains(normalizedQuery)) {
                items.add(item);
            }
        }
        return new VmOsListResponseDto(List.copyOf(items));
    }

    public synchronized VmDetailsDto applyChanges(long vmId) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.statusMessage = "Changes applied";
        return build(vm, state);
    }

    private VmDetailsDto touchDeviceSetting(long vmId, String type, String value) {
        ManagerVmDto vm = managerService.getVm(vmId);
        VmDetailsState state = stateFor(vmId, vm);
        state.selectedHardware = type;
        if (!state.hardwareDevices.contains(type)) {
            state.hardwareDevices.add(type);
        }
        state.generalSettings = normalizeText(value, state.generalSettings);
        state.statusMessage = "Updated " + type + " settings";
        return build(vm, state);
    }

    private VmDetailsState stateFor(long vmId, ManagerVmDto vm) {
        return detailsByVm.computeIfAbsent(vmId, ignored -> defaultState(vm));
    }

    private VmDetailsState defaultState(ManagerVmDto vm) {
        VmDetailsState state = new VmDetailsState();
        state.open = false;
        state.selectedHardware = "disk";
        state.generalSettings = vm.name() + " defaults";
        state.cpuCount = 2;
        state.memoryMb = 4096;
        state.bootOrder = "disk,network";
        state.hardwareDevices = new ArrayList<>(List.of("disk", "network", "graphics"));
        state.validationErrors = List.of();
        state.osChoices = DEFAULT_OS_CHOICES;
        state.statusMessage = "Details ready";
        return state;
    }

    private VmDetailsDto build(ManagerVmDto vm, VmDetailsState state) {
        return new VmDetailsDto(
                vm,
                state.open,
                state.selectedHardware,
                state.generalSettings,
                state.cpuCount,
                state.memoryMb,
                state.bootOrder,
                List.copyOf(state.hardwareDevices),
                state.xmlEditorOpen,
                state.storageBrowserOpen,
                state.osListOpen,
                state.statusMessage,
                state.validationErrors,
                state.osChoices
        );
    }

    private String normalizeText(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private static final class VmDetailsState {
        private boolean open;
        private String selectedHardware;
        private String generalSettings;
        private int cpuCount;
        private int memoryMb;
        private String bootOrder;
        private List<String> hardwareDevices;
        private boolean xmlEditorOpen;
        private boolean storageBrowserOpen;
        private boolean osListOpen;
        private String statusMessage;
        private List<String> validationErrors;
        private List<VmOsListItemDto> osChoices;
    }
}
