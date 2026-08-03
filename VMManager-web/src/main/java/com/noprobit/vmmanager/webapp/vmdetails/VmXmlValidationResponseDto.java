package com.noprobit.vmmanager.webapp.vmdetails;

import java.util.List;

public record VmXmlValidationResponseDto(
        boolean valid,
        List<String> errors
) {
}
