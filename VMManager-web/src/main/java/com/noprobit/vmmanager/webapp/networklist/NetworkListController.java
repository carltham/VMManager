package com.noprobit.vmmanager.webapp.networklist;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/network-list")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class NetworkListController {

    private final NetworkListService networkListService;

    public NetworkListController(NetworkListService networkListService) {
        this.networkListService = networkListService;
    }

    @PostMapping("/open")
    public NetworkListDto open() {
        return execute(networkListService::open);
    }

    @PostMapping("/{dialogId}/close")
    public NetworkListDto close(@PathVariable long dialogId) {
        return execute(() -> networkListService.close(dialogId));
    }

    @PostMapping("/{dialogId}/select-network")
    public NetworkListDto selectNetwork(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> networkListService.selectNetwork(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/confirm-source")
    public NetworkListDto confirmSource(@PathVariable long dialogId) {
        return execute(() -> networkListService.confirmSource(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public NetworkListDto cancel(@PathVariable long dialogId) {
        return execute(() -> networkListService.cancel(dialogId));
    }

    private NetworkListDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        NetworkListDto run();
    }

    public record TextRequest(String value) {
    }
}
