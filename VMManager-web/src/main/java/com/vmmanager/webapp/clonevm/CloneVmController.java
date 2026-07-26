package com.vmmanager.webapp.clonevm;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/clone-vm")
@CrossOrigin(origins = "http://localhost:4200")
public class CloneVmController {

    private final CloneVmService cloneVmService;

    public CloneVmController(CloneVmService cloneVmService) {
        this.cloneVmService = cloneVmService;
    }

    @PostMapping("/open")
    public CloneVmDto open() {
        return execute(cloneVmService::open);
    }

    @PostMapping("/{dialogId}/close")
    public CloneVmDto close(@PathVariable long dialogId) {
        return execute(() -> cloneVmService.close(dialogId));
    }

    @PostMapping("/{dialogId}/select-source-vm")
    public CloneVmDto selectSourceVm(@PathVariable long dialogId, @RequestBody NumberRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Source VM id is required");
        }
        return execute(() -> cloneVmService.selectSourceVm(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/choose-clone-mode")
    public CloneVmDto chooseCloneMode(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> cloneVmService.chooseCloneMode(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/browse-destination")
    public CloneVmDto browseDestination(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> cloneVmService.browseDestination(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-disk-options")
    public CloneVmDto changeDiskOptions(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> cloneVmService.changeDiskOptions(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/edit-clone-name")
    public CloneVmDto editCloneName(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> cloneVmService.editCloneName(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/confirm-clone")
    public CloneVmDto confirmClone(@PathVariable long dialogId) {
        return execute(() -> cloneVmService.confirmClone(dialogId));
    }

    private CloneVmDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        CloneVmDto run();
    }

    public record TextRequest(String value) {
    }

    public record NumberRequest(Long value) {
    }
}
