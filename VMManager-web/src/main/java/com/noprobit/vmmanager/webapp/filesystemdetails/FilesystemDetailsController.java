package com.noprobit.vmmanager.webapp.filesystemdetails;

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
@RequestMapping("/api/filesystem-details")
@CrossOrigin(origins = "http://localhost:4200")
public class FilesystemDetailsController {

    private final FilesystemDetailsService filesystemDetailsService;

    public FilesystemDetailsController(FilesystemDetailsService filesystemDetailsService) {
        this.filesystemDetailsService = filesystemDetailsService;
    }

    @PostMapping("/open")
    public FilesystemDetailsDto open(@RequestParam long vmId) {
        return execute(() -> filesystemDetailsService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public FilesystemDetailsDto close(@PathVariable long dialogId) {
        return execute(() -> filesystemDetailsService.close(dialogId));
    }

    @PostMapping("/{dialogId}/edit-filesystem-path")
    public FilesystemDetailsDto editFilesystemPath(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> filesystemDetailsService.editFilesystemPath(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/edit-target")
    public FilesystemDetailsDto editTarget(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> filesystemDetailsService.editTarget(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/apply")
    public FilesystemDetailsDto apply(@PathVariable long dialogId) {
        return execute(() -> filesystemDetailsService.applyChanges(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public FilesystemDetailsDto cancel(@PathVariable long dialogId) {
        return execute(() -> filesystemDetailsService.cancel(dialogId));
    }

    private FilesystemDetailsDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        FilesystemDetailsDto run();
    }

    public record TextRequest(String value) {
    }
}
