package com.noprobit.vmmanager.webapp.manager.dto;

public record ManagerHostDetailsDto(
        long connectionId,
        String connectionName,
        String uri,
        int cpuUsage,
        int memoryUsageMb,
        int vmCount) {
}