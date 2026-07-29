package com.noprobit.vmmanager.webapp.vsockdetails;

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
@RequestMapping("/api/vsock-details")
@CrossOrigin(origins = "http://localhost:4200")
public class VsockDetailsController {

    private final VsockDetailsService vsockDetailsService;

    public VsockDetailsController(VsockDetailsService vsockDetailsService) {
        this.vsockDetailsService = vsockDetailsService;
    }

    @PostMapping("/open")
    public VsockDetailsDto open(@RequestParam long vmId) {
        return execute(() -> vsockDetailsService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public VsockDetailsDto close(@PathVariable long dialogId) {
        return execute(() -> vsockDetailsService.close(dialogId));
    }

    @PostMapping("/{dialogId}/toggle-auto-cid")
    public VsockDetailsDto toggleAutoCid(@PathVariable long dialogId, @RequestBody BooleanRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Boolean value is required");
        }
        return execute(() -> vsockDetailsService.toggleAutoCid(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/edit-cid")
    public VsockDetailsDto editCid(@PathVariable long dialogId, @RequestBody NumberRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CID value is required");
        }
        return execute(() -> vsockDetailsService.editCid(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/apply")
    public VsockDetailsDto apply(@PathVariable long dialogId) {
        return execute(() -> vsockDetailsService.applyChanges(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public VsockDetailsDto cancel(@PathVariable long dialogId) {
        return execute(() -> vsockDetailsService.cancel(dialogId));
    }

    private VsockDetailsDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        VsockDetailsDto run();
    }

    public record NumberRequest(Long value) {
    }

    public record BooleanRequest(Boolean value) {
    }
}
