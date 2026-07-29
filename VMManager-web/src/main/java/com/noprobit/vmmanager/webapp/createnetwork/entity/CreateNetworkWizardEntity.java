package com.noprobit.vmmanager.webapp.createnetwork.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "create_network_wizards")
public class CreateNetworkWizardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean open;

    @Column(nullable = false)
    private int step;

    @Column(nullable = false)
    private String networkName;

    @Column(nullable = false)
    private String mode;

    @Column(nullable = false)
    private String addressRange;

    @Column(nullable = false)
    private String statusMessage;

    protected CreateNetworkWizardEntity() {
    }

    public CreateNetworkWizardEntity(
            boolean open,
            int step,
            String networkName,
            String mode,
            String addressRange,
            String statusMessage) {
        this.open = open;
        this.step = step;
        this.networkName = networkName;
        this.mode = mode;
        this.addressRange = addressRange;
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

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getAddressRange() {
        return addressRange;
    }

    public void setAddressRange(String addressRange) {
        this.addressRange = addressRange;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }
}