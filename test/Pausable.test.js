const { expectThrow } = require('./helpers/common');
const PausableMock = artifacts.require('PausableMock');

require('chai').should();

contract('Pausable', function () {
  beforeEach(async function () {
    this.Pausable = await PausableMock.new();
  });

  it('can perform normal process in non-pause', async function () {
    (await this.Pausable.count()).toNumber().should.equal(0);

    await this.Pausable.normalProcess();
    (await this.Pausable.count()).toNumber().should.equal(1);
  });

  it('can not perform normal process in pause', async function () {
    await this.Pausable.pause();
    (await this.Pausable.count()).toNumber().should.equal(0);

    await expectThrow(this.Pausable.normalProcess());
    (await this.Pausable.count()).toNumber().should.equal(0);
  });

  it('can not take drastic measure in non-pause', async function () {
    await expectThrow(this.Pausable.drasticMeasure());
    (await this.Pausable.drasticMeasureTaken()).should.be.false;
  });

  it('can take a drastic measure in a pause', async function () {
    await this.Pausable.pause();
    await this.Pausable.drasticMeasure();
    (await this.Pausable.drasticMeasureTaken()).should.be.true;
  });

  it('should resume allowing normal process after pause is over', async function () {
    await this.Pausable.pause();
    await this.Pausable.unpause();
    await this.Pausable.normalProcess();
    (await this.Pausable.count()).toNumber().should.equal(1);
  });

  it('should prevent drastic measure after pause is over', async function () {
    await this.Pausable.pause();
    await this.Pausable.unpause();

    await expectThrow(this.Pausable.drasticMeasure());

    (await this.Pausable.drasticMeasureTaken()).should.be.false;
  });
});