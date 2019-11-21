import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OthersComponentsPage, OthersDeleteDialog, OthersUpdatePage } from './others.page-object';

const expect = chai.expect;

describe('Others e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let othersComponentsPage: OthersComponentsPage;
  let othersUpdatePage: OthersUpdatePage;
  let othersDeleteDialog: OthersDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Others', async () => {
    await navBarPage.goToEntity('others');
    othersComponentsPage = new OthersComponentsPage();
    await browser.wait(ec.visibilityOf(othersComponentsPage.title), 5000);
    expect(await othersComponentsPage.getTitle()).to.eq('Others');
  });

  it('should load create Others page', async () => {
    await othersComponentsPage.clickOnCreateButton();
    othersUpdatePage = new OthersUpdatePage();
    expect(await othersUpdatePage.getPageTitle()).to.eq('Create or edit a Others');
    await othersUpdatePage.cancel();
  });

  it('should create and save Others', async () => {
    const nbButtonsBeforeCreate = await othersComponentsPage.countDeleteButtons();

    await othersComponentsPage.clickOnCreateButton();
    await promise.all([
      othersUpdatePage.setDescriptionInput('description'),
      othersUpdatePage.setContentInput('content'),
      othersUpdatePage.userSelectLastOption()
    ]);
    expect(await othersUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await othersUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    await othersUpdatePage.save();
    expect(await othersUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await othersComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Others', async () => {
    const nbButtonsBeforeDelete = await othersComponentsPage.countDeleteButtons();
    await othersComponentsPage.clickOnLastDeleteButton();

    othersDeleteDialog = new OthersDeleteDialog();
    expect(await othersDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Others?');
    await othersDeleteDialog.clickOnConfirmButton();

    expect(await othersComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
