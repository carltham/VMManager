package com.noprobit.vmmanager.webapp.manager;

import java.util.List;

import com.noprobit.vmmanager.webapp.manager.ManagerConnectionDto;

public record ManagerOverviewDto(
        boolean statsEnabled,
        List<ManagerConnectionDto> connections
) {
}
