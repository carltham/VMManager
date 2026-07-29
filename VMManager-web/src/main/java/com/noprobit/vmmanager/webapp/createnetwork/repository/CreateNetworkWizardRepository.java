package com.noprobit.vmmanager.webapp.createnetwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.createnetwork.entity.CreateNetworkWizardEntity;

public interface CreateNetworkWizardRepository extends JpaRepository<CreateNetworkWizardEntity, Long> {
}