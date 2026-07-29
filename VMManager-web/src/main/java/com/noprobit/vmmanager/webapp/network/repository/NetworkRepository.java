package com.noprobit.vmmanager.webapp.network.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.network.entity.NetworkEntity;

public interface NetworkRepository extends JpaRepository<NetworkEntity, Long> {

    List<NetworkEntity> findAllByOrderByIdAsc();

    Optional<NetworkEntity> findByName(String name);
}