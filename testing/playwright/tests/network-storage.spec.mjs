import { expect,test } from '@playwright/test';

const chooseView = async ( page,view ) => {
  await page.getByRole( 'button',{ name: 'View',exact: true } ).click();
  await page.getByRole( 'menu',{ name: 'View',exact: true } )
    .getByRole( 'menuitem',{ name: view,exact: true } ).click();
};

test.describe.serial( 'network and storage workflows',() => {
  test( 'creates and manages virtual networks',async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page,'Networks' );
    const wizard = page.locator( 'app-create-network' );
    await wizard.getByRole( 'button',{ name: /Open Network Wizard/ } ).click();
    await wizard.getByLabel( 'Name' ).fill( `playwright-net-${Date.now()}` );
    await wizard.getByLabel( 'Mode' ).selectOption( 'isolated' );
    await wizard.getByLabel( 'Address range' ).fill( '192.168.142.0/24' );
    for ( const name of ['Next','Back','Review','Cancel'] ) {
      await wizard.getByRole( 'button',{ name,exact: true } ).click();
    }
    await expect( wizard.getByRole( 'button',{ name: /Open Network Wizard/ } ) ).toBeVisible();

    const hostNetworks = page.locator( 'app-host-networks' );
    await hostNetworks.getByRole( 'button',{ name: 'Refresh',exact: true } ).click();
    const firstNetwork = hostNetworks.locator( '.item' ).first();
    await firstNetwork.click();
    await hostNetworks.getByLabel( 'Autostart' ).check();
    await hostNetworks.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await hostNetworks.getByRole( 'button',{ name: 'Start',exact: true } ).click();
    await hostNetworks.getByRole( 'button',{ name: 'Stop',exact: true } ).click();
  } );

  test( 'creates pools and volumes and navigates storage controls',async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page,'Storage' );
    const hostStorage = page.locator( 'app-host-storage' );
    await expect( hostStorage ).toBeVisible();
    await hostStorage.getByRole( 'button',{ name: 'Refresh',exact: true } ).click();
    await expect( hostStorage.getByText( 'Volumes' ) ).toBeVisible();

    const createPool = page.locator( 'app-create-pool' );
    await createPool.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await createPool.getByLabel( 'Name' ).fill( `playwright-pool-${Date.now()}` );
    await createPool.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();

    const createVolume = page.locator( 'app-create-volume' );
    await createVolume.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await createVolume.getByLabel( 'Name' ).fill( `playwright-volume-${Date.now()}` );
    await createVolume.getByRole( 'button',{ name: 'Browse path',exact: true } ).click();
    await createVolume.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();

    for ( const component of ['app-create-pool','app-create-volume','app-storage-browse','app-storage-management'] ) {
      await expect( page.locator( component ) ).toBeVisible();
    }
  } );
} );