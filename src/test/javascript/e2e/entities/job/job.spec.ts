import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { JobComponentsPage, JobDeleteDialog, JobUpdatePage } from './job.page-object';

const expect = chai.expect;

describe('Job e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let jobComponentsPage: JobComponentsPage;
  let jobUpdatePage: JobUpdatePage;
  let jobDeleteDialog: JobDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Jobs', async () => {
    await navBarPage.goToEntity('job');
    jobComponentsPage = new JobComponentsPage();
    await browser.wait(ec.visibilityOf(jobComponentsPage.title), 5000);
    expect(await jobComponentsPage.getTitle()).to.eq('Jobs');
  });

  it('should load create Job page', async () => {
    await jobComponentsPage.clickOnCreateButton();
    jobUpdatePage = new JobUpdatePage();
    expect(await jobUpdatePage.getPageTitle()).to.eq('Create or edit a Job');
    await jobUpdatePage.cancel();
  });

  it('should create and save Jobs', async () => {
    const nbButtonsBeforeCreate = await jobComponentsPage.countDeleteButtons();

    await jobComponentsPage.clickOnCreateButton();
    await promise.all([
      jobUpdatePage.setJobTitleInput('jobTitle'),
      jobUpdatePage.setMinSalaryInput('5'),
      jobUpdatePage.setMaxSalaryInput('5'),
      // jobUpdatePage.taskSelectLastOption(),
      jobUpdatePage.employeeSelectLastOption()
    ]);
    expect(await jobUpdatePage.getJobTitleInput()).to.eq('jobTitle', 'Expected JobTitle value to be equals to jobTitle');
    expect(await jobUpdatePage.getMinSalaryInput()).to.eq('5', 'Expected minSalary value to be equals to 5');
    expect(await jobUpdatePage.getMaxSalaryInput()).to.eq('5', 'Expected maxSalary value to be equals to 5');
    await jobUpdatePage.save();
    expect(await jobUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await jobComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Job', async () => {
    const nbButtonsBeforeDelete = await jobComponentsPage.countDeleteButtons();
    await jobComponentsPage.clickOnLastDeleteButton();

    jobDeleteDialog = new JobDeleteDialog();
    expect(await jobDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Job?');
    await jobDeleteDialog.clickOnConfirmButton();

    expect(await jobComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
