package com.noprobit.vmmanager.webapp.vmwindow;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.noprobit.vmmanager.webapp.vmwindow.VmWindowDto;
import com.noprobit.vmmanager.webapp.vmwindow.VmWindowTab;

@RestController
@RequestMapping("/api/vm-window")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class VmWindowController {

    private final VmWindowService vmWindowService;

    public VmWindowController(VmWindowService vmWindowService) {
        this.vmWindowService = vmWindowService;
    }

    @PostMapping("/{vmId}/open")
    public VmWindowDto open(@PathVariable long vmId) {
        return execute(() -> vmWindowService.open(vmId));
    }

    @PostMapping("/{vmId}/close")
    public VmWindowDto close(@PathVariable long vmId) {
        return execute(() -> vmWindowService.close(vmId));
    }

    @PostMapping("/{vmId}/switch-tab")
    public VmWindowDto switchTab(@PathVariable long vmId, @RequestParam VmWindowTab tab) {
        return execute(() -> vmWindowService.switchTab(vmId, tab));
    }

    @PostMapping("/{vmId}/start")
    public VmWindowDto start(@PathVariable long vmId) {
        return execute(() -> vmWindowService.startVm(vmId));
    }

    @PostMapping("/{vmId}/pause")
    public VmWindowDto pause(@PathVariable long vmId) {
        return execute(() -> vmWindowService.pauseVm(vmId));
    }

    @PostMapping("/{vmId}/reset")
    public VmWindowDto reset(@PathVariable long vmId) {
        return execute(() -> vmWindowService.resetVm(vmId));
    }

    @PostMapping("/{vmId}/reboot")
    public VmWindowDto reboot(@PathVariable long vmId) {
        return execute(() -> vmWindowService.rebootVm(vmId));
    }

    @PostMapping("/{vmId}/shutdown")
    public VmWindowDto shutdown(@PathVariable long vmId) {
        return execute(() -> vmWindowService.shutdownVm(vmId));
    }

    @PostMapping("/{vmId}/save")
    public VmWindowDto save(@PathVariable long vmId) {
        return execute(() -> vmWindowService.saveVm(vmId));
    }

    @PostMapping("/{vmId}/status")
    public VmWindowDto status(@PathVariable long vmId) {
        return execute(() -> vmWindowService.updateStatus(vmId));
    }

    @PostMapping("/{vmId}/console/connect-viewer")
    public VmWindowDto connectViewer(@PathVariable long vmId, @RequestBody ViewerRequest request) {
        if (request == null || request.viewer() == null || request.viewer().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Viewer is required");
        }
        return executeConsole(() -> vmWindowService.connectViewer(vmId, request.viewer()));
    }

    @PostMapping("/{vmId}/console/fullscreen")
    public VmWindowDto fullscreen(@PathVariable long vmId, @RequestBody FullscreenRequest request) {
        if (request == null || request.enabled() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enabled flag is required");
        }
        return executeConsole(() -> vmWindowService.setFullscreen(vmId, request.enabled()));
    }

    @PostMapping("/{vmId}/console/send-keys")
    public VmWindowDto sendKeys(@PathVariable long vmId, @RequestBody KeyComboRequest request) {
        if (request == null || request.combo() == null || request.combo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key combo is required");
        }
        return executeConsole(() -> vmWindowService.sendKeys(vmId, request.combo()));
    }

    private VmWindowDto execute(VmWindowOperation op) {
        try {
            return op.execute();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    private VmWindowDto executeConsole(VmWindowOperation op) {
        try {
            return op.execute();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface VmWindowOperation {
        VmWindowDto execute();
    }

    public record ViewerRequest(String viewer) {
    }

    public record FullscreenRequest(Boolean enabled) {
    }

    public record KeyComboRequest(String combo) {
    }
}
