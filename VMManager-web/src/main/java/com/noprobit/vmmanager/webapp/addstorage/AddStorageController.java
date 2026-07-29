package com.noprobit.vmmanager.webapp.addstorage;

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
@RequestMapping("/api/add-storage")
@CrossOrigin(origins = "http://localhost:4200")
public class AddStorageController {

    private final AddStorageService addStorageService;

    public AddStorageController(AddStorageService addStorageService) {
        this.addStorageService = addStorageService;
    }

    @PostMapping("/open")
    public AddStorageDto open(@RequestParam long vmId) {
        return execute(() -> addStorageService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public AddStorageDto close(@PathVariable long dialogId) {
        return execute(() -> addStorageService.close(dialogId));
    }

    @PostMapping("/{dialogId}/browse-source")
    public AddStorageDto browseSource(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> addStorageService.browseSource(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/select-storage-path")
    public AddStorageDto selectStoragePath(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> addStorageService.selectStoragePath(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-format")
    public AddStorageDto changeFormat(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> addStorageService.changeFormat(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-size")
    public AddStorageDto changeSize(@PathVariable long dialogId, @RequestBody NumberRequest request) {
        if (request == null || request.value() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Size is required");
        }
        return execute(() -> addStorageService.changeSize(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/attach-storage")
    public AddStorageDto attachStorage(@PathVariable long dialogId) {
        return execute(() -> addStorageService.attachStorage(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public AddStorageDto cancel(@PathVariable long dialogId) {
        return execute(() -> addStorageService.cancel(dialogId));
    }

    private AddStorageDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        AddStorageDto run();
    }

    public record TextRequest(String value) {
    }

    public record NumberRequest(Integer value) {
    }
}
