package com.noprobit.vmmanager.webapp.manager;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.noprobit.vmmanager.webapp.manager.dto.ManagerHostDetailsDto;
import com.noprobit.vmmanager.webapp.manager.dto.ManagerPreferencesDto;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping
    public ManagerOverviewDto getOverview() {
        return managerService.getOverview();
    }

    @GetMapping("/overview")
    public ManagerOverviewDto getOverviewAlias() {
        return managerService.getOverview();
    }

    @PostMapping("/stats/toggle")
    public ManagerActionResultDto toggleStats() {
        boolean enabled = managerService.toggleStats();
        return new ManagerActionResultDto("toggle stats", "Stats are now " + (enabled ? "enabled" : "disabled"));
    }

    @PostMapping("/connections")
    public ManagerConnectionDto addConnection(@RequestBody AddConnectionRequest request) {
        try {
            return managerService.addConnection(request.name(), request.uri());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @DeleteMapping("/connections/{connectionId}")
    public ManagerActionResultDto disconnectConnection(@PathVariable long connectionId) {
        try {
            managerService.disconnectConnection(connectionId);
            return new ManagerActionResultDto("disconnect connection", "Connection disconnected");
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @PostMapping("/vms")
    public ManagerVmDto createVm(@RequestBody CreateVmRequest request) {
        try {
            return managerService.createVm(request.connectionId(), request.name());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @PostMapping("/vms/{vmId}/open")
    public ManagerVmDto openVm(@PathVariable long vmId) {
        return updateVm(() -> managerService.openVm(vmId));
    }

    @PostMapping("/vms/{vmId}/run")
    public ManagerVmDto runVm(@PathVariable long vmId) {
        return updateVm(() -> managerService.runVm(vmId));
    }

    @PostMapping("/vms/{vmId}/pause")
    public ManagerVmDto pauseVm(@PathVariable long vmId) {
        return updateVm(() -> managerService.pauseVm(vmId));
    }

    @PostMapping("/vms/{vmId}/shutdown")
    public ManagerVmDto shutdownVm(@PathVariable long vmId) {
        return updateVm(() -> managerService.shutdownVm(vmId));
    }

    @DeleteMapping("/vms/{vmId}")
    public ManagerActionResultDto deleteVm(@PathVariable long vmId) {
        try {
            managerService.deleteVm(vmId);
            return new ManagerActionResultDto("delete VM", "VM deleted");
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @GetMapping("/host/{connectionId}")
    public ManagerHostDetailsDto hostDetails(@PathVariable long connectionId) {
        try {
            return managerService.hostDetails(connectionId);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @GetMapping("/preferences")
    public ManagerPreferencesDto preferences() {
        return managerService.preferences();
    }

    @GetMapping("/about")
    public ManagerAboutDto about() {
        return managerService.about();
    }

    private ManagerVmDto updateVm(VmOperation operation) {
        try {
            return operation.execute();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface VmOperation {
        ManagerVmDto execute();
    }

    public record AddConnectionRequest(String name, String uri) {
    }

    public record CreateVmRequest(Long connectionId, String name) {
    }
}
