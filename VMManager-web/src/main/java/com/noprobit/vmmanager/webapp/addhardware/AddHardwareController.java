package com.noprobit.vmmanager.webapp.addhardware;

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
@RequestMapping("/api/add-hardware")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class AddHardwareController {

    private final AddHardwareService addHardwareService;

    public AddHardwareController(AddHardwareService addHardwareService) {
        this.addHardwareService = addHardwareService;
    }

    @PostMapping("/open")
    public AddHardwareDto open(@RequestParam long vmId) {
        return execute(() -> addHardwareService.open(vmId));
    }

    @PostMapping("/{dialogId}/close")
    public AddHardwareDto close(@PathVariable long dialogId) {
        return execute(() -> addHardwareService.close(dialogId));
    }

    @PostMapping("/{dialogId}/select-device-type")
    public AddHardwareDto selectDeviceType(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> addHardwareService.selectDeviceType(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/configure-device")
    public AddHardwareDto configureDevice(@PathVariable long dialogId, @RequestBody TextRequest request) {
        return execute(() -> addHardwareService.configureDevice(dialogId, request.value()));
    }

    @PostMapping("/{dialogId}/validate-device")
    public AddHardwareDto validateDevice(@PathVariable long dialogId) {
        return execute(() -> addHardwareService.validateDevice(dialogId));
    }

    @PostMapping("/{dialogId}/apply")
    public AddHardwareDto apply(@PathVariable long dialogId) {
        return execute(() -> addHardwareService.applyChanges(dialogId));
    }

    @PostMapping("/{dialogId}/cancel")
    public AddHardwareDto cancel(@PathVariable long dialogId) {
        return execute(() -> addHardwareService.cancel(dialogId));
    }

    private AddHardwareDto execute(Operation operation) {
        try {
            return operation.run();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @FunctionalInterface
    private interface Operation {
        AddHardwareDto run();
    }

    public record TextRequest(String value) {
    }
}
