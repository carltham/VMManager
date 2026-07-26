package com.vmmanager.webapp.vmdetails;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/vm-details")
@CrossOrigin(origins = "http://localhost:4200")
public class VmDetailsController {

    private final VmDetailsService vmDetailsService;

    public VmDetailsController(VmDetailsService vmDetailsService) {
        this.vmDetailsService = vmDetailsService;
    }

    @PostMapping("/{vmId}/open")
    public VmDetailsDto open(@PathVariable long vmId) {
        return execute(() -> vmDetailsService.open(vmId));
    }

    @PostMapping("/{vmId}/refresh")
    public VmDetailsDto refresh(@PathVariable long vmId) {
        return execute(() -> vmDetailsService.refresh(vmId));
    }

    @PostMapping("/{vmId}/select-hardware")
    public VmDetailsDto selectHardware(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.selectHardware(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-general")
    public VmDetailsDto editGeneral(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editGeneral(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-cpu")
    public VmDetailsDto editCpu(@PathVariable long vmId, @RequestBody NumberRequest request) {
        return execute(() -> vmDetailsService.editCpu(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-memory")
    public VmDetailsDto editMemory(@PathVariable long vmId, @RequestBody NumberRequest request) {
        return execute(() -> vmDetailsService.editMemory(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-boot")
    public VmDetailsDto editBoot(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editBoot(vmId, request.value()));
    }

    @PostMapping("/{vmId}/add-hardware")
    public VmDetailsDto addHardware(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.addHardware(vmId, request.value()));
    }

    @PostMapping("/{vmId}/remove-hardware")
    public VmDetailsDto removeHardware(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.removeHardware(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-storage")
    public VmDetailsDto editStorage(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editStorage(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-network")
    public VmDetailsDto editNetwork(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editNetwork(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-graphics")
    public VmDetailsDto editGraphics(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editGraphics(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-tpm")
    public VmDetailsDto editTpm(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editTpm(vmId, request.value()));
    }

    @PostMapping("/{vmId}/edit-vsock")
    public VmDetailsDto editVsock(@PathVariable long vmId, @RequestBody TextRequest request) {
        return execute(() -> vmDetailsService.editVsock(vmId, request.value()));
    }

    @PostMapping("/{vmId}/launch-xml-editor")
    public VmDetailsDto launchXmlEditor(@PathVariable long vmId) {
        return execute(() -> vmDetailsService.launchXmlEditor(vmId));
    }

    @PostMapping("/{vmId}/launch-storage-browser")
    public VmDetailsDto launchStorageBrowser(@PathVariable long vmId) {
        return execute(() -> vmDetailsService.launchStorageBrowser(vmId));
    }

    @PostMapping("/{vmId}/launch-os-list")
    public VmDetailsDto launchOsList(@PathVariable long vmId) {
        return execute(() -> vmDetailsService.launchOsList(vmId));
    }

    @PostMapping("/{vmId}/apply")
    public VmDetailsDto applyChanges(@PathVariable long vmId) {
        return execute(() -> vmDetailsService.applyChanges(vmId));
    }

    private VmDetailsDto execute(VmDetailsOperation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface VmDetailsOperation {
        VmDetailsDto run();
    }

    public record TextRequest(String value) {
    }

    public record NumberRequest(Integer value) {
    }
}
