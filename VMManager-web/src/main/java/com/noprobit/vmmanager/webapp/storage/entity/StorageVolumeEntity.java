package com.noprobit.vmmanager.webapp.storage.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "storage_volumes")
public class StorageVolumeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pool_id", nullable = false)
    private StoragePoolEntity pool;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String format;

    @Column(nullable = false)
    private int sizeGb;

    protected StorageVolumeEntity() {
    }

    public StorageVolumeEntity(StoragePoolEntity pool, String name, String format, int sizeGb) {
        this.pool = pool;
        this.name = name;
        this.format = format;
        this.sizeGb = sizeGb;
    }

    public Long getId() {
        return id;
    }

    public StoragePoolEntity getPool() {
        return pool;
    }

    public String getName() {
        return name;
    }

    public String getFormat() {
        return format;
    }

    public int getSizeGb() {
        return sizeGb;
    }
}