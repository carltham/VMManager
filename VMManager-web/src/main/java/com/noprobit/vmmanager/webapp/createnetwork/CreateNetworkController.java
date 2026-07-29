package com.noprobit.vmmanager.webapp.createnetwork;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/create-network")
@CrossOrigin(origins = "http://localhost:4200")
public class CreateNetworkController {

    private final CreateNetworkService createNetworkService;

    public CreateNetworkController(CreateNetworkService createNetworkService) {
        this.createNetworkService = createNetworkService;
    }

    @PostMapping("/open")
    public CreateNetworkDto open() {
        return execute(createNetworkService::open);
    }

    @PostMapping("/{wizardId}/close")
    public CreateNetworkDto close(@PathVariable long wizardId) {
        return execute(() -> createNetworkService.close(wizardId));
    }

    @PostMapping("/{wizardId}/back")
    public CreateNetworkDto back(@PathVariable long wizardId) {
        return execute(() -> createNetworkService.back(wizardId));
    }

    @PostMapping("/{wizardId}/next")
    public CreateNetworkDto next(@PathVariable long wizardId) {
        return execute(() -> createNetworkService.next(wizardId));
    }

    @PostMapping("/{wizardId}/configure-network")
    public CreateNetworkDto configureNetwork(@PathVariable long wizardId, @RequestBody ConfigureRequest request) {
        return execute(() -> createNetworkService.configureNetwork(wizardId, request.networkName(), request.mode()));
    }

    @PostMapping("/{wizardId}/set-address-range")
    public CreateNetworkDto setAddressRange(@PathVariable long wizardId, @RequestBody TextRequest request) {
        return execute(() -> createNetworkService.setAddressRange(wizardId, request.value()));
    }

    @PostMapping("/{wizardId}/review")
    public CreateNetworkDto review(@PathVariable long wizardId) {
        return execute(() -> createNetworkService.review(wizardId));
    }

    @PostMapping("/{wizardId}/create")
    public CreateNetworkDto create(@PathVariable long wizardId) {
        return execute(() -> createNetworkService.createNetwork(wizardId));
    }

    @PostMapping("/{wizardId}/cancel")
    public CreateNetworkDto cancel(@PathVariable long wizardId) {
        return execute(() -> createNetworkService.cancel(wizardId));
    }

    private CreateNetworkDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        CreateNetworkDto run();
    }

    public record TextRequest(String value) {
    }

    public record ConfigureRequest(String networkName, String mode) {
    }
}
