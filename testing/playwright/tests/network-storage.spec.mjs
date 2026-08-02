import { expect,test } from '@playwright/test';

const chooseView = async ( page,view ) => {
  await page.getByRole( 'button',{ name: 'View',exact: true } ).click();
  await page.getByRole( 'menu',{ name: 'View',exact: true } )
    .getByRole( 'menuitem',{ name: view,exact: true } ).click();
};

const machineView = async ( page ) => {
  await page.goto( '/' );
  await chooseView( page,'Machines' );
  await expect( page.locator( 'app-manager' ) ).toBeVisible();
};

test.describe.serial( 'network and storage workflows',() => {
  test( 'configures, reviews, cancels, creates, and closes create-network wizard',async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page,'Networks' );

    const wizard = page.locator( 'app-create-network' );
    const openWizard = async () => {
      await wizard.getByRole( 'button',{ name: /Open Network Wizard/ } ).click();
      await expect( wizard.getByText( /Step 1: Create network wizard opened/ ) ).toBeVisible();
    };

    await openWizard();
    const name = `playwright-net-${Date.now()}`;
    await wizard.getByLabel( 'Name' ).fill( name );
    await wizard.getByLabel( 'Mode' ).selectOption( 'isolated' );
    await wizard.getByLabel( 'Name' ).press( 'Tab' );
    await expect( wizard.getByText( /Network configuration updated/ ) ).toBeVisible();
    await wizard.getByLabel( 'Address range' ).fill( '192.168.142.0/24' );
    await expect( wizard.getByText( /Address range updated/ ) ).toBeVisible();
    await wizard.getByRole( 'button',{ name: 'Next',exact: true } ).click();
    await expect( wizard.getByText( /Moved to step 2/ ) ).toBeVisible();
    await wizard.getByRole( 'button',{ name: 'Back',exact: true } ).click();
    await expect( wizard.getByText( /Moved back to step 1/ ) ).toBeVisible();
    await wizard.getByRole( 'button',{ name: 'Review',exact: true } ).click();
    await expect( wizard.getByText( /Review complete/ ) ).toBeVisible();
    await wizard.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( wizard.getByRole( 'button',{ name: /Open Network Wizard/ } ) ).toBeVisible();

    await openWizard();
    await wizard.getByLabel( 'Name' ).fill( name );
    await wizard.getByLabel( 'Mode' ).selectOption( 'nat' );
    await wizard.getByLabel( 'Name' ).press( 'Tab' );
    await wizard.getByLabel( 'Address range' ).fill( '192.168.200.0/24' );
    await wizard.getByRole( 'button',{ name: 'Create Network',exact: true } ).click();
    await expect( wizard.getByRole( 'button',{ name: /Open Network Wizard/ } ) ).toBeVisible();

    await openWizard();
    await wizard.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( wizard.getByRole( 'button',{ name: /Open Network Wizard/ } ) ).toBeVisible();

    const hostNetworks = page.locator( 'app-host-networks' );
    await hostNetworks.getByRole( 'button',{ name: 'Refresh',exact: true } ).click();
    const created = hostNetworks.locator( '.item' ).filter( { hasText: name } );
    await expect( created ).toBeVisible();
    await created.click();
    await hostNetworks.getByLabel( 'Autostart' ).check();
    await hostNetworks.getByRole( 'button',{ name: 'Apply',exact: true } ).click();
    await hostNetworks.getByRole( 'button',{ name: 'Start',exact: true } ).click();
    await expect( created ).toContainText( /running/ );
    await hostNetworks.getByRole( 'button',{ name: 'Stop',exact: true } ).click();
    await expect( created ).toContainText( /stopped/ );
  } );

  test( 'selects, cancels, confirms, and closes network-list from VM details',async ( { page } ) => {
    await machineView( page );
    await page.getByRole( 'button',{ name: 'Edit',exact: true } ).click();
    await page.getByRole( 'menu',{ name: 'Edit',exact: true } )
      .getByRole( 'menuitem',{ name: 'Virtual Machine Details',exact: true } ).click();

    const details = page.locator( 'app-vm-details' );
    const dialog = page.getByRole( 'dialog' );
    const networkList = page.locator( 'app-network-list' );
    const openNetworkList = async () => {
      await details.getByRole( 'button',{ name: 'Network',exact: true } ).click();
      await expect( dialog ).toBeVisible();
      await expect( networkList.getByRole( 'heading',{ name: 'Select network source' } ) ).toBeVisible();
      await expect( networkList.getByText( /Network list opened/ ) ).toBeVisible();
    };

    await openNetworkList();
    const networkSelect = networkList.getByLabel( 'Network' );
    const options = await networkSelect.locator( 'option' ).allTextContents();
    expect( options.length ).toBeGreaterThan( 0 );
    if ( options.length > 1 ) {
      await networkSelect.selectOption( { label: options[1] } );
    } else {
      await networkSelect.selectOption( { label: options[0] } );
    }
    await expect( networkList.getByText( /Network selected/ ) ).toBeVisible();
    await networkList.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openNetworkList();
    await networkList.getByRole( 'button',{ name: 'Use Network',exact: true } ).click();
    await expect( dialog ).toBeHidden();

    await openNetworkList();
    await networkList.getByRole( 'button',{ name: 'Close',exact: true } ).click();
    await expect( dialog ).toBeHidden();
  } );

  test( 'creates, cancels, and lists storage pools and volumes',async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page,'Storage' );

    const hostStorage = page.locator( 'app-host-storage' );
    await expect( hostStorage ).toBeVisible();
    await hostStorage.getByRole( 'button',{ name: 'Refresh',exact: true } ).click();
    await expect( hostStorage.getByRole( 'heading',{ name: 'Pools' } ) ).toBeVisible();
    await expect( hostStorage.getByRole( 'heading',{ name: 'Volumes' } ) ).toBeVisible();
    await expect( hostStorage.getByText( 'Host storage loaded',{ exact: true } ) ).toBeVisible();
    await expect( hostStorage.locator( 'article' ).filter( { hasText: 'default' } ).first() ).toBeVisible();

    const createPool = page.locator( 'app-create-pool' );
    const poolName = `playwright-pool-${Date.now()}`;
    await createPool.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await expect( createPool.getByLabel( 'Name' ) ).toBeVisible();
    await createPool.getByLabel( 'Name' ).fill( `${poolName}-cancel` );
    await createPool.getByLabel( 'Type' ).selectOption( 'dir' );
    await createPool.getByLabel( 'Source' ).fill( '/tmp/cancel-pool' );
    await createPool.getByLabel( 'Target' ).fill( '/tmp/cancel-pool' );
    await createPool.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( createPool.getByLabel( 'Name' ) ).toHaveCount( 0 );

    await createPool.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await createPool.getByLabel( 'Name' ).fill( poolName );
    await createPool.getByLabel( 'Type' ).selectOption( 'dir' );
    await createPool.getByLabel( 'Source' ).fill( `/tmp/${poolName}` );
    await createPool.getByLabel( 'Target' ).fill( `/tmp/${poolName}` );
    await createPool.getByRole( 'button',{ name: 'Create Pool',exact: true } ).click();
    await expect( createPool.getByText( new RegExp( `Pool ${poolName} created` ) ) ).toBeVisible();
    await createPool.getByRole( 'button',{ name: 'Close',exact: true } ).click();

    await hostStorage.getByRole( 'button',{ name: 'Refresh',exact: true } ).click();
    const poolCard = hostStorage.locator( 'article' ).filter( { hasText: poolName } );
    await expect( poolCard ).toBeVisible();
    await expect( poolCard ).toContainText( /stopped/ );
    await poolCard.getByRole( 'button',{ name: 'Start',exact: true } ).click();
    await expect( poolCard ).toContainText( /running/ );
    await poolCard.getByRole( 'button',{ name: 'Stop',exact: true } ).click();
    await expect( poolCard ).toContainText( /stopped/ );

    const createVolume = page.locator( 'app-create-volume' );
    const volumeName = `playwright-volume-${Date.now()}.qcow2`;
    await createVolume.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await expect( createVolume.getByLabel( 'Name' ) ).toBeVisible();
    await createVolume.getByLabel( 'Name' ).fill( `${volumeName}-cancel` );
    await createVolume.getByRole( 'button',{ name: 'Browse path',exact: true } ).click();
    await expect( createVolume.getByText( /Browse path dialog is not available/ ) ).toBeVisible();
    await createVolume.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( createVolume.getByLabel( 'Name' ) ).toHaveCount( 0 );

    await createVolume.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await createVolume.getByLabel( 'Name' ).fill( volumeName );
    const poolSelect = createVolume.getByLabel( 'Pool' );
    const poolOptions = ( await poolSelect.locator( 'option' ).allTextContents() ).map( ( v ) => v.trim() ).filter( Boolean );
    expect( poolOptions.length ).toBeGreaterThan( 0 );
    const targetPool = poolOptions.includes( 'default' ) ? 'default' : poolOptions[0];
    await poolSelect.selectOption( targetPool );
    await createVolume.getByLabel( 'Format' ).selectOption( 'qcow2' );
    await createVolume.getByLabel( 'Size GB' ).fill( '12' );
    await createVolume.getByLabel( 'Path' ).fill( `/var/lib/libvirt/images/${volumeName}` );
    await createVolume.getByRole( 'button',{ name: 'Create Volume',exact: true } ).click();
    await expect( createVolume.getByText( `Volume ${volumeName} created in pool ${targetPool}.`,{ exact: true } ) ).toBeVisible();
    await createVolume.getByRole( 'button',{ name: 'Close',exact: true } ).click();

    await hostStorage.getByRole( 'button',{ name: 'Refresh',exact: true } ).click();
    await expect( hostStorage.locator( 'article' ).filter( { hasText: volumeName } ) ).toBeVisible();
  } );

  test( 'opens, selects, confirms, and cancels storage browse',async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page,'Storage' );

    const browse = page.locator( 'app-storage-browse' );
    await browse.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    await expect( browse.getByText( /Current:/ ) ).toBeVisible();
    await expect( browse.getByText( 'Storage browser opened',{ exact: true } ) ).toBeVisible();

    const entry = browse.locator( 'button.entry' ).filter( { hasText: '/var/lib/libvirt' } ).first();
    await expect( entry ).toBeVisible();
    await entry.click();
    await expect( browse.getByText( /Path selected:\s*\/var\/lib\/libvirt/ ) ).toBeVisible();

    await browse.getByRole( 'button',{ name: 'Cancel',exact: true } ).click();
    await expect( browse.getByText( /Current:/ ) ).toHaveCount( 0 );

    await browse.getByRole( 'button',{ name: 'Open',exact: true } ).click();
    const images = browse.locator( 'button.entry' ).filter( { hasText: '/var/lib/libvirt/images' } ).first();
    await images.click();
    await browse.getByRole( 'button',{ name: 'Confirm',exact: true } ).click();
    await expect( browse.getByText( /Selected \/var\/lib\/libvirt\/images/ ) ).toBeVisible();
    // confirm closes browse open=false but component may keep panel if toggle state local
    // Close via header toggle if still open
    const closeOrOpen = browse.getByRole( 'button',{ name: /^(Close|Open)$/ } );
    if ( await browse.getByText( /Current:/ ).count() ) {
      await closeOrOpen.click();
    }

    for ( const component of ['app-create-pool','app-create-volume','app-storage-browse','app-storage-management','app-host-storage'] ) {
      await expect( page.locator( component ) ).toBeVisible();
    }
  } );
} );
