package com.noprobit.vmmanager.webapp.manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.manager.entity.VmEntity;

public interface VmRepository extends JpaRepository<VmEntity, Long> {

    List<VmEntity> findAllByConnection_IdOrderByIdAsc(long connectionId);

    long countByConnection_Id(long connectionId);
}