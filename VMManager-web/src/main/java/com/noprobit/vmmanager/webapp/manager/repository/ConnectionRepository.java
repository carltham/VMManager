package com.noprobit.vmmanager.webapp.manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.manager.entity.ConnectionEntity;

public interface ConnectionRepository extends JpaRepository<ConnectionEntity, Long> {

    List<ConnectionEntity> findAllByOrderByIdAsc();
}