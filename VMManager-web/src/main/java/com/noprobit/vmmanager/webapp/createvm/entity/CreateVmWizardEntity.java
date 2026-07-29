package com.noprobit.vmmanager.webapp.createvm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "create_vm_wizards")
public class CreateVmWizardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean open;

    @Column(nullable = false)
    private int step;

    @Column(nullable = false)
    private long connectionId;

    @Column(nullable = false)
    private String installMethod;

    @Column(nullable = false)
    private String vmName;

    @Column(nullable = false)
    private String isoPath;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String importSource;

    @Column(nullable = false)
    private String appSource;

    @Column(nullable = false)
    private String osContainerSource;

    @Column(nullable = false)
    private boolean detectOs;

    @Column(nullable = false)
    private boolean storageEnabled;

    @Column(nullable = false)
    private String arch;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String machine;

    @Column(nullable = false)
    private String statusMessage;

    protected CreateVmWizardEntity() {
    }

    public CreateVmWizardEntity(
            boolean open,
            int step,
            long connectionId,
            String installMethod,
            String vmName,
            String isoPath,
            String url,
            String importSource,
            String appSource,
            String osContainerSource,
            boolean detectOs,
            boolean storageEnabled,
            String arch,
            String type,
            String machine,
            String statusMessage) {
        this.open = open;
        this.step = step;
        this.connectionId = connectionId;
        this.installMethod = installMethod;
        this.vmName = vmName;
        this.isoPath = isoPath;
        this.url = url;
        this.importSource = importSource;
        this.appSource = appSource;
        this.osContainerSource = osContainerSource;
        this.detectOs = detectOs;
        this.storageEnabled = storageEnabled;
        this.arch = arch;
        this.type = type;
        this.machine = machine;
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

    public long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(long connectionId) {
        this.connectionId = connectionId;
    }

    public String getInstallMethod() {
        return installMethod;
    }

    public void setInstallMethod(String installMethod) {
        this.installMethod = installMethod;
    }

    public String getVmName() {
        return vmName;
    }

    public void setVmName(String vmName) {
        this.vmName = vmName;
    }

    public String getIsoPath() {
        return isoPath;
    }

    public void setIsoPath(String isoPath) {
        this.isoPath = isoPath;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImportSource() {
        return importSource;
    }

    public void setImportSource(String importSource) {
        this.importSource = importSource;
    }

    public String getAppSource() {
        return appSource;
    }

    public void setAppSource(String appSource) {
        this.appSource = appSource;
    }

    public String getOsContainerSource() {
        return osContainerSource;
    }

    public void setOsContainerSource(String osContainerSource) {
        this.osContainerSource = osContainerSource;
    }

    public boolean isDetectOs() {
        return detectOs;
    }

    public void setDetectOs(boolean detectOs) {
        this.detectOs = detectOs;
    }

    public boolean isStorageEnabled() {
        return storageEnabled;
    }

    public void setStorageEnabled(boolean storageEnabled) {
        this.storageEnabled = storageEnabled;
    }

    public String getArch() {
        return arch;
    }

    public void setArch(String arch) {
        this.arch = arch;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }
}