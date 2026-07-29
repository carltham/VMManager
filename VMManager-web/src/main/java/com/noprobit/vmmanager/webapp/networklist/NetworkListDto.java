package com.noprobit.vmmanager.webapp.networklist;

import java.util.List;

public record NetworkListDto(
        long dialogId,
        boolean open,
        String selectedNetwork,
        List<String> availableNetworks,
        String statusMessage
) {
}
