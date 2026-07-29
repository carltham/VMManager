import { expect,test } from '@playwright/test';

test( 'tools view exposes every tool module and top-level menu command',async ( { page } ) => {
  await page.goto( '/' );
  const chooseMenuItem = async ( menu,item ) => {
    await page.getByRole( 'button',{ name: menu,exact: true } ).click();
    const dropdown = page.getByRole( 'menu',{ name: menu,exact: true } );
    await expect( dropdown ).toBeVisible();
    await dropdown.getByRole( 'menuitem',{ name: item,exact: true } ).click();
    await expect( dropdown ).toBeHidden();
  };

  await chooseMenuItem( 'View','Tools' );
  for ( const component of [
    'app-create-connection','app-connection-auth','app-host-details','app-preferences',
    'app-about','app-async-job','app-console','app-xml-editor','app-os-list',
    'app-snapshots','app-snapshot-new',
  ] ) {
    await expect( page.locator( component ).first() ).toBeVisible();
  }

  for ( const [menu,command] of [
    ['File','Add Connection'],
    ['File','New Virtual Machine'],
    ['File','New Network'],
    ['Edit','Connection Details'],
    ['Edit','Virtual Machine Details'],
    ['Edit','Preferences'],
    ['Help','About'],
  ] ) {
    await chooseMenuItem( menu,command );
    await expect( page.locator( 'main' ) ).toBeVisible();
  }
} );