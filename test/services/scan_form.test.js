/* eslint-disable func-names */
import { expect } from 'chai';

import EasyPostClient from '../../src/easypost';
import ScanForm from '../../src/models/scan_form';
import Fixture from '../helpers/fixture';
import * as setupPolly from '../helpers/setup_polly';

describe('ScanForm Service', function () {
  setupPolly.startPolly();

  before(function () {
    this.client = new EasyPostClient(process.env.EASYPOST_TEST_API_KEY);
  });

  beforeEach(function () {
    const { server } = this.polly;
    setupPolly.setupCassette(server);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('creates a scanform', async function () {
    const shipment = await this.client.Shipment.create(Fixture.oneCallBuyShipment());

    const scanform = await this.client.ScanForm.create({
      shipments: [shipment],
    });

    expect(scanform).to.be.an.instanceOf(ScanForm);
    expect(scanform.id).to.match(/^sf_/);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('retrieves a scanform', async function () {
    const shipment = await this.client.Shipment.create(Fixture.oneCallBuyShipment());

    const scanform = await this.client.ScanForm.create({
      shipments: [shipment],
    });

    const retrievedScanform = await this.client.ScanForm.retrieve(scanform.id);

    expect(retrievedScanform).to.be.an.instanceOf(ScanForm);
    expect(retrievedScanform).to.deep.include(scanform);
  });

  it('retrieves all scanforms', async function () {
    const scanforms = await this.client.ScanForm.all({
      page_size: Fixture.pageSize(),
    });

    const scanformsArray = scanforms.scan_forms;

    expect(scanformsArray.length).to.be.lessThanOrEqual(Fixture.pageSize());
    expect(scanforms.has_more).to.exist;
    scanformsArray.forEach((scanform) => {
      expect(scanform).to.be.an.instanceOf(ScanForm);
    });
  });
});