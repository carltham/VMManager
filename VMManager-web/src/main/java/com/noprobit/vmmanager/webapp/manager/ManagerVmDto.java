package com.noprobit.vmmanager.webapp.manager;

public record ManagerVmDto(
        long id,
        long connectionId,
        String name,
        ManagerVmState state,
        boolean opened
) {
}
