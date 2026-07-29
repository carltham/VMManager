package com.noprobit.vmmanager.webapp.tpmdetails;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/tpm-details")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class TpmDetailsController {

    private final TpmDetailsService tpmDetailsService;

    public TpmDetailsController(TpmDetailsService tpmDetailsService) {
        this.tpmDetailsService = tpmDetailsService;
    }

    @PostMapping("/open")
    public TpmDetailsDto open(@RequestParam long vmId) {
        return execute(() -> tpmDetailsService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public TpmDetailsDto close(@PathVariable long dialogId) {
        return execute(() -> tpmDetailsService.close(dialogId));
    }

    @PostMapping("/{dialogId}/change-model")
    public TpmDetailsDto changeModel(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> tpmDetailsService.changeModel(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-version")
    public TpmDetailsDto changeVersion(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> tpmDetailsService.changeVersion(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-device-path")
    public TpmDetailsDto changeDevicePath(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> tpmDetailsService.changeDevicePath(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/apply")
    public TpmDetailsDto apply(@PathVariable long dialogId) {
        return execute(() -> tpmDetailsService.applyChanges(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public TpmDetailsDto cancel(@PathVariable long dialogId) {
        return execute(() -> tpmDetailsService.cancel(dialogId));
    }

    private TpmDetailsDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        TpmDetailsDto run();
    }

    public record TextRequest(String value) {
    }
}
