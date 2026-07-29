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
    await inputs.nth( 7 ).uncheck();
    await inputs.nth( 8 ).check();
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
} );