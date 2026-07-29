package com.noprobit.vmmanager.webapp.manager;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.noprobit.vmmanager.webapp.manager.entity.ConnectionEntity;
import com.noprobit.vmmanager.webapp.manager.entity.VmEntity;
import com.noprobit.vmmanager.webapp.manager.repository.ConnectionRepository;
import com.noprobit.vmmanager.webapp.manager.repository.VmRepository;

@Component
public class ManagerDataInitializer implements CommandLineRunner {

    private final ConnectionRepository connectionRepository;
    private final VmRepository vmRepository;

    public ManagerDataInitializer(ConnectionRepository connectionRepository, VmRepository vmRepository) {
        this.connectionRepository = connectionRepository;
        this.vmRepository = vmRepository;
    }

    @Override
    public void run(String... args) {
        if (connectionRepository.count() > 0) {
            return;
        }

        ConnectionEntity local = connectionRepository.save(new ConnectionEntity("Local QEMU", "qemu:///system"));
        ConnectionEntity remote = connectionRepository.save(new ConnectionEntity("Remote Host", "qemu+ssh://admin@lab/system"));

        vmRepository.save(new VmEntity(local, "dev-fedora", ManagerVmState.RUNNING, false));
        vmRepository.save(new VmEntity(local, "ci-ubuntu", ManagerVmState.PAUSED, false));
        vmRepository.save(new VmEntity(remote, "win11-test", ManagerVmState.SHUTOFF, false));
    }
}