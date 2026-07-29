package com.noprobit.vmmanager.webapp.hostnets;

public record HostNetworkDto(long id, String name, String mode, boolean active, boolean autostart) {
}