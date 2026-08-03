package com.noprobit.vmmanager.webapp.vmdetails;

import java.util.List;

public record VmOsListResponseDto(
        List<VmOsListItemDto> items
) {
}
