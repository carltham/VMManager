import { expect, test } from '@playwright/test';

const chooseView = async ( page, view ) => {
  await page.getByRole( 'button', { name: 'View', exact: true } ).click();
  await page.getByRole( 'menu', { name: 'View', exact: true } )
    .getByRole( 'menuitem', { name: view, exact: true } ).click();
};

const chooseMenuItem = async ( page, menu, item ) => {
  await page.getByRole( 'button', { name: menu, exact: true } ).click();
  const dropdown = page.getByRole( 'menu', { name: menu, exact: true } );
  await expect( dropdown ).toBeVisible();
  await dropdown.getByRole( 'menuitem', { name: item, exact: true } ).click();
  await expect( dropdown ).toBeHidden();
};

test.describe.serial( 'tools workflows', () => {
  test( 'tools view exposes every tool module and top-level menu command', async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page, 'Tools' );
    for ( const component of [
      'app-create-connection', 'app-connection-auth', 'app-host-details', 'app-preferences',
      'app-about', 'app-async-job', 'app-console', 'app-xml-editor', 'app-os-list',
      'app-snapshots', 'app-snapshot-new',
    ] ) {
      await expect( page.locator( component ).first() ).toBeVisible();
    }

    for ( const [menu, command] of [
      ['File', 'Add Connection'],
      ['File', 'New Virtual Machine'],
      ['File', 'New Network'],
      ['Edit', 'Connection Details'],
      ['Edit', 'Virtual Machine Details'],
      ['Edit', 'Preferences'],
      ['Help', 'About'],
    ] ) {
      await chooseMenuItem( page, menu, command );
      await expect( page.locator( 'main' ) ).toBeVisible();
    }
  } );

  test( 'creates connection, authenticates, loads host details, preferences, and about', async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page, 'Tools' );

    const createConn = page.locator( 'app-create-connection' );
    await expect( createConn.getByRole( 'heading', { name: 'Create Connection' } ) ).toBeVisible();
    await createConn.getByRole( 'button', { name: 'Refresh', exact: true } ).click();
    await expect( createConn.getByRole( 'heading', { name: 'Known Connections' } ) ).toBeVisible();

    const connectionName = `playwright-conn-${Date.now()}`;
    await createConn.locator( 'label', { hasText: /^Name/ } ).locator( 'input' ).fill( connectionName );
    await createConn.locator( 'label', { hasText: /^URI/ } ).locator( 'input' ).fill( 'qemu:///system' );
    await createConn.getByRole( 'button', { name: 'Add connection', exact: true } ).click();
    await expect( createConn.getByText( `Connection ${connectionName} created.`, { exact: true } ) ).toBeVisible();
    await expect( createConn.locator( 'article' ).filter( { hasText: connectionName } ) ).toBeVisible();

    const auth = page.locator( 'app-connection-auth' );
    await expect( auth.getByRole( 'heading', { name: 'Connection Authentication' } ) ).toBeVisible();
    await auth.getByRole( 'button', { name: 'Authenticate', exact: true } ).click();
    await expect( auth.getByText( 'Username and password are required.', { exact: true } ) ).toBeVisible();

    await auth.locator( 'label', { hasText: /^Username/ } ).locator( 'input' ).fill( 'playwright-user' );
    await auth.locator( 'label', { hasText: /^Password/ } ).locator( 'input' ).fill( 'playwright-pass' );
    await auth.getByRole( 'checkbox', { name: /Remember credentials/ } ).check();
    await auth.getByRole( 'button', { name: 'Authenticate', exact: true } ).click();
    await expect( auth.getByText( 'Authenticated with stored session.', { exact: true } ) ).toBeVisible();

    await auth.locator( 'label', { hasText: /^Username/ } ).locator( 'input' ).fill( 'playwright-user' );
    await auth.locator( 'label', { hasText: /^Password/ } ).locator( 'input' ).fill( 'again' );
    await auth.getByRole( 'checkbox', { name: /Remember credentials/ } ).uncheck();
    await auth.getByRole( 'button', { name: 'Authenticate', exact: true } ).click();
    await expect( auth.getByText( 'Authenticated for current session.', { exact: true } ) ).toBeVisible();

    const host = page.locator( 'app-host-details' );
    await expect( host.getByRole( 'heading', { name: 'Host Details' } ) ).toBeVisible();
    await host.getByRole( 'button', { name: 'Refresh connections', exact: true } ).click();
    const connectionSelect = host.locator( 'select' );
    await expect( connectionSelect.locator( 'option' ).first() ).toBeAttached();
    const optionTexts = await connectionSelect.locator( 'option' ).allTextContents();
    const match = optionTexts.find( ( t ) => t.includes( connectionName ) );
    if ( match ) {
      await connectionSelect.selectOption( { label: match.trim() } );
    }
    await host.getByRole( 'button', { name: 'Load host details', exact: true } ).click();
    await expect( host.getByText( /Loaded host details for / ) ).toBeVisible();
    await expect( host.getByText( /URI:/ ) ).toBeVisible();
    await expect( host.getByText( /CPU usage:/ ) ).toBeVisible();
    await expect( host.getByText( /Memory usage:/ ) ).toBeVisible();
    await expect( host.getByText( /VM count:/ ) ).toBeVisible();

    const prefs = page.locator( 'app-preferences' );
    await expect( prefs.getByRole( 'heading', { name: 'Preferences' } ) ).toBeVisible();
    await prefs.getByRole( 'button', { name: 'Refresh', exact: true } ).click();
    await expect( prefs.getByText( 'Preferences loaded.', { exact: true } ) ).toBeVisible();
    await expect( prefs.getByText( /Theme:/ ) ).toBeVisible();
    await expect( prefs.getByText( /Default Connection URI:/ ) ).toBeVisible();
    await expect( prefs.getByText( /Auto Connect:/ ) ).toBeVisible();

    const about = page.locator( 'app-about' );
    await expect( about.getByRole( 'heading', { name: 'About' } ) ).toBeVisible();
    await about.getByRole( 'button', { name: 'Refresh', exact: true } ).click();
    await expect( about.getByText( 'About data loaded.', { exact: true } ) ).toBeVisible();
    await expect( about.getByText( /Name:/ ) ).toBeVisible();
    await expect( about.getByText( /Module:/ ) ).toBeVisible();
    await expect( about.getByText( /Version:/ ) ).toBeVisible();
  } );

  test( 'runs async job start and cancel flows', async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page, 'Tools' );

    const job = page.locator( 'app-async-job' );
    await expect( job.getByRole( 'heading', { name: 'Async Job' } ) ).toBeVisible();
    await job.getByRole( 'button', { name: 'Start job', exact: true } ).click();
    await expect( job.getByText( 'Job started.', { exact: true } ) ).toBeVisible();
    await expect( job.getByText( /Progress:\s*[1-9]/ ) ).toBeVisible( { timeout: 5000 } );
    await job.getByRole( 'button', { name: 'Cancel', exact: true } ).click();
    await expect( job.getByText( 'Job canceled.', { exact: true } ) ).toBeVisible();

    await job.getByRole( 'button', { name: 'Start job', exact: true } ).click();
    await expect( job.getByText( 'Job completed.', { exact: true } ) ).toBeVisible( { timeout: 15000 } );
    await expect( job.getByText( 'Progress: 100%' ) ).toBeVisible();
  } );

  test( 'opens console and runs viewer/fullscreen/send-keys actions', async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page, 'Tools' );

    const consolePanel = page.locator( 'app-console' );
    await expect( consolePanel.getByRole( 'heading', { name: 'Console' } ) ).toBeVisible();
    await consolePanel.getByRole( 'button', { name: 'Refresh VMs', exact: true } ).click();
    await expect( consolePanel.locator( 'select option' ).first() ).toBeAttached();

    await consolePanel.getByRole( 'button', { name: 'Open', exact: true } ).click();
    await expect( consolePanel.getByText( 'VM window opened', { exact: true } ) ).toBeVisible();
    await expect( consolePanel.locator( 'pre' ) ).toContainText( /Console for / );

    await consolePanel.getByRole( 'button', { name: 'Status', exact: true } ).click();
    await expect( consolePanel.getByText( 'Status refreshed', { exact: true } ) ).toBeVisible();

    await consolePanel.getByRole( 'button', { name: 'Run', exact: true } ).click();
    await expect( consolePanel.locator( '.notice.success' ) ).toBeVisible();

    await consolePanel.getByRole( 'button', { name: 'Pause', exact: true } ).click();
    await expect( consolePanel.locator( '.notice.success' ) ).toBeVisible();

    await consolePanel.locator( 'label', { hasText: /^Viewer/ } ).locator( 'select' ).selectOption( 'serial' );
    await consolePanel.getByRole( 'button', { name: 'Connect Viewer', exact: true } ).click();
    await expect( consolePanel.locator( '.notice.success' ) ).toBeVisible();
    await expect( consolePanel.locator( 'pre' ) ).toContainText( 'viewer=serial' );
    await expect( consolePanel.getByText( 'Console connected: true', { exact: true } ) ).toBeVisible();

    await consolePanel.getByRole( 'checkbox', { name: 'Fullscreen', exact: true } ).check();
    await consolePanel.getByRole( 'button', { name: 'Apply Fullscreen', exact: true } ).click();
    await expect( consolePanel.getByText( 'Fullscreen enabled', { exact: true } ) ).toBeVisible();
    await expect( consolePanel.getByText( 'Fullscreen: true', { exact: true } ) ).toBeVisible();

    await consolePanel.locator( 'label', { hasText: /^Key combo/ } ).locator( 'input' ).fill( 'Ctrl+Alt+Del' );
    await consolePanel.getByRole( 'button', { name: 'Send Keys', exact: true } ).click();
    await expect( consolePanel.getByText( 'Sent key combo: Ctrl+Alt+Del', { exact: true } ) ).toBeVisible();
  } );

  test( 'opens xml editor and os list then applies changes', async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page, 'Tools' );

    const xml = page.locator( 'app-xml-editor' );
    await expect( xml.getByRole( 'heading', { name: 'XML Editor' } ) ).toBeVisible();
    await expect( xml.locator( 'select option' ).first() ).toBeAttached();
    await xml.getByRole( 'button', { name: 'Open editor', exact: true } ).click();
    await expect( xml.getByText( 'XML editor launched', { exact: true } ) ).toBeVisible();
    await expect( xml.getByText( 'Editor state: open', { exact: true } ) ).toBeVisible();
    await xml.locator( 'textarea' ).fill( '<domain type="kvm"><name>playwright</name></domain>' );
    await xml.getByRole( 'button', { name: 'Apply XML', exact: true } ).click();
    await expect( xml.getByText( 'Changes applied', { exact: true } ) ).toBeVisible();

    const osList = page.locator( 'app-os-list' );
    await expect( osList.getByRole( 'heading', { name: 'OS List' } ) ).toBeVisible();
    await expect( osList.locator( 'label', { hasText: /^VM/ } ).locator( 'select option' ).first() ).toBeAttached();
    await osList.getByRole( 'button', { name: 'Open list', exact: true } ).click();
    await expect( osList.getByText( 'OS list launched', { exact: true } ) ).toBeVisible();
    await expect( osList.getByText( 'OS list state: open', { exact: true } ) ).toBeVisible();
    await osList.locator( 'label', { hasText: /Operating system/ } ).locator( 'select' ).selectOption( 'Ubuntu 24.04' );
    await osList.getByRole( 'button', { name: 'Apply OS', exact: true } ).click();
    await expect( osList.locator( '.notice.success' ) ).toBeVisible();
  } );

  test( 'creates reverts and deletes snapshots via snapshot-new and snapshots', async ( { page } ) => {
    await page.goto( '/' );
    await chooseView( page, 'Tools' );

    const snapshots = page.locator( 'app-snapshots' );
    await expect( snapshots.getByRole( 'heading', { name: 'Snapshots' } ) ).toBeVisible();
    await snapshots.getByRole( 'button', { name: 'Refresh', exact: true } ).click();
    await expect( snapshots.locator( 'select option' ).first() ).toBeAttached();

    const snapshotNew = snapshots.locator( 'app-snapshot-new' );
    await expect( snapshotNew.getByRole( 'heading', { name: 'New Snapshot' } ) ).toBeVisible();
    await snapshotNew.getByRole( 'button', { name: 'Create snapshot', exact: true } ).click();
    await expect( snapshotNew.getByText( 'Snapshot name is required.', { exact: true } ) ).toBeVisible();

    const snapName = `playwright-snap-${Date.now()}`;
    await snapshotNew.locator( 'label', { hasText: /^Name/ } ).locator( 'input' ).fill( snapName );
    await snapshotNew.getByRole( 'button', { name: 'Create snapshot', exact: true } ).click();
    await expect( snapshotNew.getByText( `Requested snapshot ${snapName}.`, { exact: true } ) ).toBeVisible();
    await expect( snapshots.getByText( `Snapshot ${snapName} created.`, { exact: true } ) ).toBeVisible();
    await expect( snapshots.locator( 'article' ).filter( { hasText: snapName } ) ).toBeVisible();

    const second = `${snapName}-b`;
    await snapshotNew.locator( 'label', { hasText: /^Name/ } ).locator( 'input' ).fill( second );
    await snapshotNew.getByRole( 'button', { name: 'Create snapshot', exact: true } ).click();
    await expect( snapshots.getByText( `Snapshot ${second} created.`, { exact: true } ) ).toBeVisible();

    // select older snapshot (second article) if present, else first
    const articles = snapshots.locator( 'article' );
    await expect( articles.first() ).toBeVisible();
    await articles.nth( 1 ).locator( 'input[type="radio"]' ).check();
    await snapshots.getByRole( 'button', { name: 'Revert selected', exact: true } ).click();
    await expect( snapshots.getByText( 'Snapshot reverted.', { exact: true } ) ).toBeVisible();

    await articles.first().locator( 'input[type="radio"]' ).check();
    await snapshots.getByRole( 'button', { name: 'Delete selected', exact: true } ).click();
    await expect( snapshots.getByText( 'Snapshot deleted.', { exact: true } ) ).toBeVisible();
  } );
} );
