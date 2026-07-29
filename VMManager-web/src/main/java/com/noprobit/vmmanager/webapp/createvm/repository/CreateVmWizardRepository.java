package com.noprobit.vmmanager.webapp.createvm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.createvm.entity.CreateVmWizardEntity;

public interface CreateVmWizardRepository extends JpaRepository<CreateVmWizardEntity, Long> {
}