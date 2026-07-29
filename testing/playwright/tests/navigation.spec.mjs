import { expect,test } from '@playwright/test';

test.describe.serial( 'manager commands',() => {
  test.beforeEach( async ( { page } ) => {
    await page.goto( '/' );
    await expect( page.getByRole( 'heading',{ name: 'Virtual Machine Manager' } ) ).toBeVisible();
  } );

  test( 'loads manager data and runs primary manager controls',async ( { page } ) => {
    await page.getByRole( 'button',{ name: 'Refresh',exact: true } ).first().click();
    await expect( page.getByRole( 'columnheader',{ name: 'Name' } ) ).toBeVisible();
    await page.getByRole( 'button',{ name: /Stats:/ } ).click();
    await expect( page.getByText( /Stats are now (enabled|disabled)/i ) ).toBeVisible();

    const connectionName = `Playwright ${Date.now()}`;
    await page.locator( 'app-manager' ).getByRole( 'button',{ name: 'Add Connection',exact: true } ).click();
    await page.getByRole( 'textbox',{ name: 'Name' } ).fill( connectionName );
    await page.getByRole( 'textbox',{ name: 'URI' } ).fill( 'qemu:///system' );
    await page.locator( 'app-manager' ).getByRole( 'button',{ name: 'Connect',exact: true } ).click();
    await expect( page.getByText( `Connection ${connectionName} added.` ) ).toBeVisible();
    const chooseConnectionAction = async ( action ) => {
      const row = page.locator( '.connection-row' ).filter( { hasText: connectionName } );
      await row.click( { button: 'right' } );
      const contextMenu = page.getByRole( 'menu',{ name: 'Connection actions' } );
      await expect( contextMenu ).toBeVisible();
      await contextMenu.getByRole( 'menuitem',{ name: action,exact: true } ).click();
    };

    await chooseConnectionAction( 'Connect' );
    await expect( page.locator( '.connection-row' ).filter( { hasText: connectionName } ) ).toBeVisible();

    await chooseConnectionAction( 'New Virtual Machine' );
    await expect( page.locator( 'app-create-vm' ).getByText( /Step 1 of 5/ ) ).toBeVisible();
    await page.locator( 'app-create-vm' ).getByRole( 'button',{ name: 'Close',exact: true } ).click();

    await chooseConnectionAction( 'Disconnect' );
    await expect( page.getByText( 'Connection disconnected' ) ).toBeVisible();
    await expect( page.locator( '.connection-row' ).filter( { hasText: connectionName } ) ).toBeHidden();

    await expect( page.locator( 'app-create-vm' ) ).toBeHidden();
    await expect( page.locator( 'app-clone-vm' ) ).toBeHidden();
    await expect( page.locator( 'app-vm-details' ) ).toBeHidden();
  } );
} );
