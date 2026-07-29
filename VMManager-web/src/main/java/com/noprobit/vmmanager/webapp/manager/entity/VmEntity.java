package com.noprobit.vmmanager.webapp.manager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.noprobit.vmmanager.webapp.manager.ManagerVmState;

@Entity
@Table(name = "vms")
public class VmEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private long connectionId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ManagerVmState state;

    @Column(nullable = false)
    private boolean opened;

    protected VmEntity() {
    }

    public VmEntity(long connectionId, String name, ManagerVmState state, boolean opened) {
        this.connectionId = connectionId;
        this.name = name;
        this.state = state;
        this.opened = opened;
    }

    public Long getId() {
        return id;
    }

    public long getConnectionId() {
        return connectionId;
    }

    public String getName() {
        return name;
    }

    public ManagerVmState getState() {
        return state;
    }

    public boolean isOpened() {
        return opened;
    }

    public void setState(ManagerVmState state) {
        this.state = state;
    }

    public void setOpened(boolean opened) {
        this.opened = opened;
    }
}