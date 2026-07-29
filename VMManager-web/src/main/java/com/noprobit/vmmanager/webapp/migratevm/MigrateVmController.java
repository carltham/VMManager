package com.noprobit.vmmanager.webapp.migratevm;

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
@RequestMapping("/api/migrate-vm")
@CrossOrigin(origins = "http://localhost:4200")
public class MigrateVmController {

    private final MigrateVmService migrateVmService;

    public MigrateVmController(MigrateVmService migrateVmService) {
        this.migrateVmService = migrateVmService;
    }

    @PostMapping("/open")
    public MigrateVmDto open(@RequestParam long vmId) {
        return execute(() -> migrateVmService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public MigrateVmDto close(@PathVariable long dialogId) {
        return execute(() -> migrateVmService.close(dialogId));
    }

    @PostMapping("/{dialogId}/choose-destination")
    public MigrateVmDto chooseDestination(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> migrateVmService.chooseDestination(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/toggle-address")
    public MigrateVmDto toggleAddress(@PathVariable long dialogId, @RequestBody BooleanRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Boolean value is required");
        }
        return execute(() -> migrateVmService.toggleAddress(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/toggle-port")
    public MigrateVmDto togglePort(@PathVariable long dialogId, @RequestBody BooleanRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Boolean value is required");
        }
        return execute(() -> migrateVmService.togglePort(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-migration-mode")
    public MigrateVmDto changeMigrationMode(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> migrateVmService.changeMigrationMode(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/edit-xml-preview")
    public MigrateVmDto editXmlPreview(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> migrateVmService.editXmlPreview(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/finish-migration")
    public MigrateVmDto finishMigration(@PathVariable long dialogId) {
        return execute(() -> migrateVmService.finishMigration(dialogId));
    }

    @PostMapping("/{dialogId}/cancel-migration")
    public MigrateVmDto cancelMigration(@PathVariable long dialogId) {
        return execute(() -> migrateVmService.cancelMigration(dialogId));
    }

    private MigrateVmDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        MigrateVmDto run();
    }

    public record TextRequest(String value) {
    }

    public record BooleanRequest(Boolean value) {
    }
}
