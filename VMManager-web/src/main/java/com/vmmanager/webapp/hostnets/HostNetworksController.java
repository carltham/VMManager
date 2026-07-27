package com.vmmanager.webapp.hostnets;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/host-networks")
@CrossOrigin(origins = "http://localhost:4200")
public class HostNetworksController {
    private final HostNetworksService service;
    public HostNetworksController(HostNetworksService service) { this.service = service; }
    @PostMapping("/open") public List<HostNetworkDto> open() { return service.list(); }
    @PostMapping("/refresh") public List<HostNetworkDto> refresh() { return service.list(); }
    @PostMapping("/{id}/start") public HostNetworkDto start(@PathVariable long id) { return execute(() -> service.start(id)); }
    @PostMapping("/{id}/stop") public HostNetworkDto stop(@PathVariable long id) { return execute(() -> service.stop(id)); }
    @PostMapping("/{id}/apply") public HostNetworkDto apply(@PathVariable long id, @RequestBody EditRequest request) { return execute(() -> service.update(id, null, request.name(), request.autostart())); }
    @DeleteMapping("/{id}") public void delete(@PathVariable long id) { execute(() -> { service.delete(id); return null; }); }
    private <T> T execute(Operation<T> operation) { try { return operation.run(); } catch (IllegalArgumentException exception) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception); } }
    @FunctionalInterface private interface Operation<T> { T run(); }
    public record EditRequest(String name, Boolean autostart) { }
}