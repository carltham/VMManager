package com.noprobit.vmmanager.webapp.manager;

import java.util.List;

public record ManagerConnectionDto(
        long id,
        String name,
        String uri,
        List<ManagerVmDto> vms
) {
}
