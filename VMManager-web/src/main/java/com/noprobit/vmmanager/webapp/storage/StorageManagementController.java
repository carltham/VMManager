package com.noprobit.vmmanager.webapp.storage;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/storage")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class StorageManagementController {

	private final StorageManagementService service;

	public StorageManagementController(StorageManagementService service) {
		this.service = service;
	}

	@PostMapping("/open")
	public StorageManagementService.View open() {
		return execute(service::view);
	}

	@PostMapping("/pools/{action}")
	public StorageManagementService.View pool(
			@PathVariable String action,
			@RequestBody(required = false) PoolRequest request) {
		PoolRequest body = request == null
				? new PoolRequest(null, null, null, null, null)
				: request;
		long id = body.id() == null ? 0L : body.id();
		return execute(() -> service.pool(action, id, body.name(), body.type(), body.target()));
	}

	@PostMapping("/volumes/create")
	public Map<String, Object> volume(@RequestBody VolumeRequest request) {
		return execute(() -> {
			StorageManagementService.View view = service.volume(
					request.name(),
					request.pool(),
					request.format(),
					request.sizeGb());
			return Map.of(
					"name", request.name() == null ? "" : request.name(),
					"pool", request.pool() == null ? "" : request.pool(),
					"format", request.format() == null ? "" : request.format(),
					"sizeGb", request.sizeGb(),
					"path", request.path() == null ? "" : request.path(),
					"open", true,
					"pools", service.poolNames(),
					"statusMessage", view.statusMessage(),
					"errorMessage", "",
					"view", view);
		});
	}

	@GetMapping("/volumes/pools")
	public List<String> volumePools() {
		return execute(service::poolNames);
	}

	@PostMapping("/browse/open")
	public StorageManagementService.BrowseView browseOpen() {
		return execute(service::openBrowse);
	}

	@PostMapping("/browse/select")
	public StorageManagementService.BrowseView browseSelect(@RequestBody(required = false) PathRequest request) {
		return execute(() -> service.selectBrowsePath(request == null ? null : request.path()));
	}

	@PostMapping("/browse/confirm")
	public StorageManagementService.BrowseView browseConfirm(@RequestBody(required = false) PathRequest request) {
		return execute(() -> service.confirmBrowsePath(request == null ? null : request.path()));
	}

	private <T> T execute(java.util.concurrent.Callable<T> action) {
		try {
			return action.call();
		} catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
		} catch (Exception ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), ex);
		}
	}

	public record PoolRequest(Long id, String name, String type, String target, String source) {
	}

	public record VolumeRequest(String name, String pool, String format, int sizeGb, String path) {
	}

	public record PathRequest(String path) {
	}
}
