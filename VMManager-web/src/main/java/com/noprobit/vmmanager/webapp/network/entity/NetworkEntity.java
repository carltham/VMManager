package com.noprobit.vmmanager.webapp.network.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "networks")
public class NetworkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String mode;

    @Column(nullable = false)
    private String addressRange;

    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private boolean autostart;

    protected NetworkEntity() {
    }

    public NetworkEntity(String name, String mode, String addressRange, boolean active, boolean autostart) {
        this.name = name;
        this.mode = mode;
        this.addressRange = addressRange;
        this.active = active;
        this.autostart = autostart;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMode() {
        return mode;
    }

    public String getAddressRange() {
        return addressRange;
    }

    public boolean isActive() {
        return active;
    }

    public boolean isAutostart() {
        return autostart;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public void setAddressRange(String addressRange) {
        this.addressRange = addressRange;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setAutostart(boolean autostart) {
        this.autostart = autostart;
    }
}