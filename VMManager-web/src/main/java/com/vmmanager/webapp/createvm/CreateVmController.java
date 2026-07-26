package com.vmmanager.webapp.createvm;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.vmmanager.webapp.createvm.CreateVmWizardDto;

@RestController
@RequestMapping("/api/create-vm")
@CrossOrigin(origins = "http://localhost:4200")
public class CreateVmController {

    private final CreateVmService createVmService;

    public CreateVmController(CreateVmService createVmService) {
        this.createVmService = createVmService;
    }

    @PostMapping("/open")
    public CreateVmWizardDto open() {
        return execute(createVmService::open);
    }

    @PostMapping("/{wizardId}/close")
    public CreateVmWizardDto close(@PathVariable long wizardId) {
        return execute(() -> createVmService.close(wizardId));
    }

    @PostMapping("/{wizardId}/back")
    public CreateVmWizardDto back(@PathVariable long wizardId) {
        return execute(() -> createVmService.back(wizardId));
    }

    @PostMapping("/{wizardId}/next")
    public CreateVmWizardDto next(@PathVariable long wizardId) {
        return execute(() -> createVmService.next(wizardId));
    }

    @PostMapping("/{wizardId}/finish")
    public CreateVmWizardDto finish(@PathVariable long wizardId) {
        return execute(() -> createVmService.finish(wizardId));
    }

    @PostMapping("/{wizardId}/change-connection")
    public CreateVmWizardDto changeConnection(@PathVariable long wizardId, @RequestBody NumberRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Connection id is required");
        }
        return execute(() -> createVmService.changeConnection(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/change-install-method")
    public CreateVmWizardDto changeInstallMethod(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.changeInstallMethod(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/browse-iso")
    public CreateVmWizardDto browseIso(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.browseIso(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/browse-url")
    public CreateVmWizardDto browseUrl(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.browseUrl(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/browse-import-source")
    public CreateVmWizardDto browseImportSource(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.browseImportSource(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/browse-app-source")
    public CreateVmWizardDto browseAppSource(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.browseAppSource(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/browse-os-container-source")
    public CreateVmWizardDto browseOsContainerSource(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.browseOsContainerSource(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/toggle-detect-os")
    public CreateVmWizardDto toggleDetectOs(@PathVariable long wizardId, @RequestBody BooleanRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Boolean value is required");
        }
        return execute(() -> createVmService.toggleDetectOs(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/toggle-storage")
    public CreateVmWizardDto toggleStorage(@PathVariable long wizardId, @RequestBody BooleanRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Boolean value is required");
        }
        return execute(() -> createVmService.toggleStorage(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/change-arch")
    public CreateVmWizardDto changeArch(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.changeArch(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/change-type")
    public CreateVmWizardDto changeType(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.changeType(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/change-machine")
    public CreateVmWizardDto changeMachine(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.changeMachine(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/edit-vm-name")
    public CreateVmWizardDto editVmName(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createVmService.editVmName(wizardId, request.value()));
    }

    private CreateVmWizardDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        CreateVmWizardDto run();
    }

    public record TextRequest(String value) {
    }

    public record NumberRequest(Long value) {
    }

    public record BooleanRequest(Boolean value) {
    }
}
