package com.vmmanager.webapp.graphicsdetails;

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
@RequestMapping("/api/graphics-details")
@CrossOrigin(origins = "http://localhost:4200")
public class GraphicsDetailsController {

    private final GraphicsDetailsService graphicsDetailsService;

    public GraphicsDetailsController(GraphicsDetailsService graphicsDetailsService) {
        this.graphicsDetailsService = graphicsDetailsService;
    }

    @PostMapping("/open")
    public GraphicsDetailsDto open(@RequestParam long vmId) {
        return execute(() -> graphicsDetailsService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public GraphicsDetailsDto close(@PathVariable long dialogId) {
        return execute(() -> graphicsDetailsService.close(dialogId));
    }

    @PostMapping("/{dialogId}/change-graphics-type")
    public GraphicsDetailsDto changeGraphicsType(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> graphicsDetailsService.changeGraphicsType(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/change-listen-port-key")
    public GraphicsDetailsDto changeListenPortKey(@PathVariable long dialogId, @RequestBody GraphicsRequest request) {
        return execute(() -> graphicsDetailsService.changeListenPortKey(dialogId, request.listenAddress(), request.port(), request.keymap()));
    }

    @PostMapping("/{dialogId}/apply")
    public GraphicsDetailsDto apply(@PathVariable long dialogId) {
        return execute(() -> graphicsDetailsService.applyChanges(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public GraphicsDetailsDto cancel(@PathVariable long dialogId) {
        return execute(() -> graphicsDetailsService.cancel(dialogId));
    }

    private GraphicsDetailsDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        GraphicsDetailsDto run();
    }

    public record TextRequest(String value) {
    }

    public record GraphicsRequest(String listenAddress, Integer port, String keymap) {
    }
}
