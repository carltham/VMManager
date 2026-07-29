package com.noprobit.vmmanager.webapp.storage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.storage.entity.StoragePoolEntity;

public interface StoragePoolRepository extends JpaRepository<StoragePoolEntity, Long> {

    List<StoragePoolEntity> findAllByOrderByIdAsc();

    Optional<StoragePoolEntity> findByName(String name);
}