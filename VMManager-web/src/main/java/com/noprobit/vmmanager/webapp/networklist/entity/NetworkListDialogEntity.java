package com.noprobit.vmmanager.webapp.networklist.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "network_list_dialogs")
public class NetworkListDialogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean open;

    @Column(nullable = false)
    private String selectedNetwork;

    @Column(nullable = false)
    private String statusMessage;

    protected NetworkListDialogEntity() {
    }

    public NetworkListDialogEntity(boolean open, String selectedNetwork, String statusMessage) {
        this.open = open;
        this.selectedNetwork = selectedNetwork;
        this.statusMessage = statusMessage;
    }

    public Long getId() {
        return id;
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public String getSelectedNetwork() {
        return selectedNetwork;
    }

    public void setSelectedNetwork(String selectedNetwork) {
        this.selectedNetwork = selectedNetwork;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }
}