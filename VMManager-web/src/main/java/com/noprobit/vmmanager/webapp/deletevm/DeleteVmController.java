package com.noprobit.vmmanager.webapp.deletevm;

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
@RequestMapping("/api/delete-vm")
@CrossOrigin(origins = "http://localhost:4200")
public class DeleteVmController {

    private final DeleteVmService deleteVmService;

    public DeleteVmController(DeleteVmService deleteVmService) {
        this.deleteVmService = deleteVmService;
    }

    @PostMapping("/open")
    public DeleteVmDto open(@RequestParam long vmId) {
        return execute(() -> deleteVmService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public DeleteVmDto close(@PathVariable long dialogId) {
        return execute(() -> deleteVmService.close(dialogId));
    }

    @PostMapping("/{dialogId}/toggle-remove-storage")
    public DeleteVmDto toggleRemoveStorage(@PathVariable long dialogId, @RequestBody BooleanRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Boolean value is required");
        }
        return execute(() -> deleteVmService.toggleRemoveStorage(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/confirm-delete")
    public DeleteVmDto confirmDelete(@PathVariable long dialogId) {
        return execute(() -> deleteVmService.confirmDelete(dialogId));
    }

    @PostMapping("/{dialogId}/cancel-delete")
    public DeleteVmDto cancelDelete(@PathVariable long dialogId) {
        return execute(() -> deleteVmService.cancelDelete(dialogId));
    }

    private DeleteVmDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        DeleteVmDto run();
    }

    public record BooleanRequest(Boolean value) {
    }
}
