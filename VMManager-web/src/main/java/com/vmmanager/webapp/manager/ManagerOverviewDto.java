package com.vmmanager.webapp.manager;

import java.util.List;

import com.vmmanager.webapp.manager.ManagerConnectionDto;

public record ManagerOverviewDto(
        boolean statsEnabled,
        List<ManagerConnectionDto> connections
) {
}
