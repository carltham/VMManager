package com.noprobit.vmmanager.webapp.storage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noprobit.vmmanager.webapp.storage.entity.StorageVolumeEntity;

public interface StorageVolumeRepository extends JpaRepository<StorageVolumeEntity, Long> {

    List<StorageVolumeEntity> findAllByOrderByIdAsc();
}