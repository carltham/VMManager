import { expect,test } from '@playwright/test';

const machineView = async ( page ) => {
  await page.goto( '/' );
  await page.getByRole( 'button',{ name: 'View',exact: true } ).click();
  await page.getByRole( 'menu',{ name: 'View',exact: true } )
    .getByRole( 'menuitem',{ name: 'Machines',exact: true } ).click();
  await expect( page.locator( 'app-manager' ) ).toBeVisible();
};

test.describe.serial( 'machine workflows',() => {
  test( 'creates a VM through every create-wizard field and action',async ( { page } ) => {
    await machineView( page );
    await page.locator( 'app-manager' ).getByRole( 'button',{ name: 'New VM',exact: true } ).click();
    const wizard = page.locator( 'app-create-vm' );
    await expect( wizard.getByText( /Step 1 of 5/ ) ).toBeVisible();
    const inputs = wizard.locator( 'input' );
    await inputs.nth( 0 ).fill( 'local' );
    await inputs.nth( 1 ).fill( `Playwright VM ${Date.now()}` );
    await inputs.nth( 2 ).fill( '/tmp/installer.iso' );
    await inputs.nth( 3 ).fill( 'https://example.test/installer.iso' );
    await inputs.nth( 4 ).fill( '/tmp/import.qcow2' );
    await inputs.nth( 5 ).fill( '/tmp/app' );
    await inputs.nth( 6 ).fill( '/tmp/container' );
    const detectOs = inputs.nth( 7 );
    const storageEnabled = inputs.nth( 8 );
    await detectOs.setChecked( !( await detectOs.isChecked() ) );
    await storageEnabled.setChecked( !( await storageEnabled.isChecked() ) );
    await inputs.nth( 9 ).fill( 'x86_64' );
    await inputs.nth( 10 ).fill( 'kvm' );
    await inputs.nth( 11 ).fill( 'q35' );
    await wizard.getByRole( 'button',{ name: 'Next',exact: true } ).click();
    await wizard.getByRole( 'button',{ name: 'Back',exact: true } ).click();
    await wizard.getByRole( 'button',{ name: 'Finish',exact: true } ).click();
    await expect( wizard ).toBeHidden();
  } );

  test( 'operates clone, migration, delete, window, details, and device-dialog entry points',async ( { page } ) => {
    await machineView( page );
    const firstVm = page.locator( 'app-manager .vm-row' ).first();
    await expect( firstVm ).toBeVisible();
    const chooseVmAction = async ( action ) => {
      await firstVm.click( { button: 'right' } );
      const contextMenu = page.getByRole( 'menu',{ name: 'Virtual machine actions' } );
      await expect( contextMenu ).toBeVisible();
      await contextMenu.getByRole( 'menuitem',{ name: action,exact: true } ).click();
    };

    await chooseVmAction( 'Clone' );
    const clone = page.locator( 'app-clone-vm' );
    await clone.getByLabel( 'Clone Name' ).fill( `Playwright Clone ${Date.now()}` );
    await clone.getByRole( 'button',{ name: 'Close',exact: true } ).click();

    await chooseVmAction( 'Open' );
    await expect( page.locator( 'app-vm-window' ) ).toContainText( /Console|Details/ );
    await page.locator( 'app-vm-window' ).getByRole( 'button',{ name: 'Details',exact: true } ).click();
    await page.locator( 'app-vm-window' ).getByRole( 'button',{ name: 'Close Window',exact: true } ).click();

    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();
    await expect( page.locator( 'app-vm-details .status' ) ).toBeVisible();
    for ( const name of ['Add HW','Add Storage','Filesystem','Graphics','TPM','VSOCK','Network'] ) {
      await page.locator( 'app-vm-details' ).getByRole( 'button',{ name,exact: true } ).click();
      await expect( page.getByRole( 'dialog' ) ).toBeVisible();
      await page.getByRole( 'dialog' ).getByRole( 'button',{ name: 'Close',exact: true } ).click();
    }

    await chooseVmAction( 'Migrate' );
    const migration = page.getByRole( 'dialog' );
    await migration.getByLabel( 'Destination' ).fill( 'qemu+ssh://target/system' );
    await migration.getByLabel( 'Set address' ).check();
    await migration.getByLabel( 'Set port' ).check();
    await migration.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( migration ).toBeHidden();

    await chooseVmAction( 'Delete' );
    await expect( page.getByRole( 'dialog' ) ).toBeVisible();
    await page.getByRole( 'dialog' ).getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
  } );

  test( 'confirms VM deletion with associated storage removal',async ( { page } ) => {
    const overview = await page.request.get( 'http://localhost:18080/api/manager' );
    const { connections } = await overview.json();
    const vmName = `Delete VM ${Date.now()}`;
    await page.request.post( 'http://localhost:18080/api/manager/vms',{
      data: { connectionId: connections[0].id,name: vmName },
    } );

    await machineView( page );
    const vmRow = page.locator( 'app-manager .vm-row' ).filter( { hasText: vmName } );
    await expect( vmRow ).toBeVisible();
    await vmRow.click( { button: 'right' } );
    await page.getByRole( 'menu',{ name: 'Virtual machine actions' } )
      .getByRole( 'menuitem',{ name: 'Delete',exact: true } ).click();

    const dialog = page.getByRole( 'dialog' );
    const removeStorage = dialog.getByLabel( 'Remove associated storage' );
    await expect( dialog ).toBeVisible();
    await removeStorage.setChecked( !( await removeStorage.isChecked() ) );
    await removeStorage.setChecked( true );
    await dialog.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await vmRow.click( { button: 'right' } );
    await page.getByRole( 'menu',{ name: 'Virtual machine actions' } )
      .getByRole( 'menuitem',{ name: 'Delete',exact: true } ).click();
    await expect( dialog ).toBeVisible();
    await dialog.getByRole( 'button',{ name: 'Delete VM',exact: true } ).click();

    await expect( dialog ).toBeHidden();
    await expect( vmRow ).toBeHidden();
  } );

  test( 'completes VM migration with all migration settings',async ( { page } ) => {
    const overview = await page.request.get( 'http://localhost:18080/api/manager' );
    const { connections } = await overview.json();
    const vmName = `Migrate VM ${Date.now()}`;
    await page.request.post( 'http://localhost:18080/api/manager/vms',{
      data: { connectionId: connections[0].id,name: vmName },
    } );

    await machineView( page );
    const vmRow = page.locator( 'app-manager .vm-row' ).filter( { hasText: vmName } );
    await expect( vmRow ).toBeVisible();
    const openMigration = async () => {
      await vmRow.click( { button: 'right' } );
      await page.getByRole( 'menu',{ name: 'Virtual machine actions' } )
        .getByRole( 'menuitem',{ name: 'Migrate',exact: true } ).click();
    };

    await openMigration();
    const dialog = page.getByRole( 'dialog' );
    await expect( dialog ).toBeVisible();
    await dialog.getByLabel( 'Destination' ).fill( 'qemu+ssh://target/system' );
    await dialog.getByLabel( 'Migration mode' ).selectOption( 'tunnelled' );
    const address = dialog.getByLabel( 'Set address' );
    const port = dialog.getByLabel( 'Set port' );
    await address.setChecked( !( await address.isChecked() ) );
    await port.setChecked( !( await port.isChecked() ) );
    await dialog.getByLabel( 'XML preview' ).fill( '<domain><name>migrated</name></domain>' );
    await dialog.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openMigration();
    await expect( dialog ).toBeVisible();
    await dialog.getByRole( 'button',{ name: 'Start Migration',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'configures, validates, cancels, applies, and closes add hardware',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const openHardware = async () => {
      await details.getByRole( 'button',{ name: 'Add HW',exact: true } ).click();
      await expect( dialog ).toBeVisible();
    };
    const configureAndValidate = async ( deviceType,configuration ) => {
      await dialog.getByLabel( 'Device type' ).selectOption( deviceType );
      await dialog.getByLabel( 'Configuration' ).fill( configuration );
      await dialog.getByRole( 'button',{ name: 'Validate',exact: true } ).click();
      await expect( dialog.getByText( 'Configuration valid',{ exact: true } ) ).toBeVisible();
      await expect( dialog.getByRole( 'button',{ name: 'Apply',exact: true } ) ).toBeEnabled();
    };

    await openHardware();
    await configureAndValidate( 'network','model=virtio' );
    await dialog.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openHardware();
    await configureAndValidate( 'graphics','type=spice' );
    await dialog.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openHardware();
    await dialog.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'configures, cancels, attaches, and closes add storage',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const openStorage = async () => {
      await details.getByRole( 'button',{ name: 'Add Storage',exact: true } ).click();
      await expect( dialog ).toBeVisible();
    };
    const configureStorage = async ( source,path,size ) => {
      await dialog.getByLabel( 'Source' ).fill( source );
      await dialog.getByLabel( 'Storage path' ).fill( path );
      await dialog.getByLabel( 'Format' ).selectOption( 'raw' );
      await dialog.getByLabel( 'Size (GB)' ).fill( size );
    };

    await openStorage();
    await configureStorage( '/tmp/cancel.qcow2','/var/lib/libvirt/images/cancel.qcow2','16' );
    await dialog.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openStorage();
    await configureStorage( '/tmp/attach.raw','/var/lib/libvirt/images/attach.raw','24' );
    await dialog.getByRole( 'button',{ name: 'Attach Storage',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openStorage();
    await dialog.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'browses, edits, cancels, applies, and closes filesystem details',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const openFilesystem = async () => {
      await details.getByRole( 'button',{ name: 'Filesystem',exact: true } ).click();
      await expect( dialog ).toBeVisible();
    };
    const configureFilesystem = async ( path,target ) => {
      await dialog.getByLabel( 'Filesystem path' ).fill( path );
      await dialog.getByRole( 'button',{ name: 'Browse source',exact: true } ).click();
      await expect( dialog.getByText( 'Filesystem source selected',{ exact: true } ) ).toBeVisible();
      await dialog.getByLabel( 'Target mount' ).fill( target );
    };

    await openFilesystem();
    await configureFilesystem( '/srv/cancel','/mnt/cancel' );
    await dialog.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openFilesystem();
    await configureFilesystem( '/srv/apply','/mnt/apply' );
    await dialog.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openFilesystem();
    await dialog.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'configures, cancels, applies, and closes graphics details',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const graphics = page.locator( 'app-graphics-details' );
    const openGraphics = async () => {
      await details.getByRole( 'button',{ name: 'Graphics',exact: true } ).click();
      await expect( dialog ).toBeVisible();
      await expect( graphics.getByRole( 'heading',{ name: 'Graphics details' } ) ).toBeVisible();
      await expect( graphics.getByText( /Graphics details opened/ ) ).toBeVisible();
    };

    await openGraphics();
    await graphics.getByRole( 'combobox' ).selectOption( 'vnc' );
    await expect( graphics.getByText( /Graphics type changed/ ) ).toBeVisible();
    await graphics.getByRole( 'textbox' ).nth( 0 ).fill( '127.0.0.1' );
    await graphics.getByRole( 'spinbutton' ).fill( '5901' );
    await graphics.getByRole( 'textbox' ).nth( 1 ).fill( 'sv' );
    await graphics.getByRole( 'textbox' ).nth( 1 ).press( 'Tab' );
    await expect( graphics.getByText( /Graphics options updated/ ) ).toBeVisible();
    await graphics.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openGraphics();
    await graphics.getByRole( 'combobox' ).selectOption( 'spice' );
    await graphics.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openGraphics();
    await graphics.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'configures, cancels, applies, and closes TPM details',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const tpm = page.locator( 'app-tpm-details' );
    const openTpm = async () => {
      await details.getByRole( 'button',{ name: 'TPM',exact: true } ).click();
      await expect( dialog ).toBeVisible();
      await expect( tpm.getByRole( 'heading',{ name: 'TPM details' } ) ).toBeVisible();
      await expect( tpm.getByText( /TPM details opened/ ) ).toBeVisible();
    };

    await openTpm();
    await tpm.getByRole( 'combobox' ).nth( 0 ).selectOption( 'tpm-crb' );
    await expect( tpm.getByText( /TPM model changed/ ) ).toBeVisible();
    await tpm.getByRole( 'combobox' ).nth( 1 ).selectOption( '1.2' );
    await expect( tpm.getByText( /TPM version changed/ ) ).toBeVisible();
    await tpm.getByRole( 'textbox' ).fill( '/dev/tpmrm0' );
    await expect( tpm.getByText( /TPM device path changed/ ) ).toBeVisible();
    await tpm.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openTpm();
    await tpm.getByRole( 'combobox' ).nth( 0 ).selectOption( 'tpm-tis' );
    await tpm.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openTpm();
    await tpm.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'configures, cancels, applies, and closes VSock details',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const vsock = page.locator( 'app-vsock-details' );
    const openVsock = async () => {
      await details.getByRole( 'button',{ name: 'VSOCK',exact: true } ).click();
      await expect( dialog ).toBeVisible();
      await expect( vsock.getByRole( 'heading',{ name: 'VSock details' } ) ).toBeVisible();
      await expect( vsock.getByText( /VSock details opened/ ) ).toBeVisible();
    };

    await openVsock();
    const autoCid = vsock.getByLabel( 'Assign CID automatically' );
    // Default is enabled; toggle off then on to exercise both status paths.
    await autoCid.setChecked( false );
    await expect( vsock.getByText( /Auto CID disabled/ ) ).toBeVisible();
    await vsock.getByRole( 'spinbutton' ).fill( '7' );
    await expect( vsock.getByText( /CID updated/ ) ).toBeVisible();
    await autoCid.setChecked( true );
    await expect( vsock.getByText( /Auto CID enabled/ ) ).toBeVisible();
    await vsock.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openVsock();
    await vsock.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openVsock();
    await vsock.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );
} );