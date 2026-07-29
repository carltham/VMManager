package com.noprobit.vmmanager.webapp.manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.manager.entity.VmEntity;

public interface VmRepository extends JpaRepository<VmEntity, Long> {

    List<VmEntity> findAllByConnectionIdOrderByIdAsc(long connectionId);

    long countByConnectionId(long connectionId);
}