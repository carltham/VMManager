package com.noprobit.vmmanager.webapp.manager.entity;

import com.noprobit.vmmanager.webapp.manager.ManagerVmState;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vms")
public class VmEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "connection_id", nullable = false)
    private ConnectionEntity connection;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ManagerVmState state;

    @Column(nullable = false)
    private boolean opened;

    protected VmEntity() {
    }

    public VmEntity(ConnectionEntity connection, String name, ManagerVmState state, boolean opened) {
        this.connection = connection;
        this.name = name;
        this.state = state;
        this.opened = opened;
    }

    public Long getId() {
        return id;
    }

    public long getConnectionId() {
        return connection.getId();
    }

    public ConnectionEntity getConnection() {
        return connection;
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