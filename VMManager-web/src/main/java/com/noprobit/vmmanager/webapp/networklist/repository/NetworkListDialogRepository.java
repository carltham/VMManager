package com.noprobit.vmmanager.webapp.networklist.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.networklist.entity.NetworkListDialogEntity;

public interface NetworkListDialogRepository extends JpaRepository<NetworkListDialogEntity, Long> {
}