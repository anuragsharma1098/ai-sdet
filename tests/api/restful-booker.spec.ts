import { expect, test } from '@playwright/test';
import { RestfulBookerClient, type BookingResponse } from '../../src/api/RestfulBookerClient';
import { getValidatedAiData } from '../../src/data/aiDataValidator';
import { createBookingData } from '../../src/data/testDataFactory';

/**
 * RESTful Booker suite covering CRUD behavior plus AI-generated negative cases.
 * The positive flow keeps created records in memory so update/delete/isolation
 * assertions can target exact records from the same run.
 */
test.describe('Question #2 and #5: RESTful Booker API automation', () => {
  test('creates multiple bookings, retrieves, updates, deletes, and validates records', async ({
    request
  }) => {
    // AI-generated templates are validated with Zod before any request uses them.
    const aiData = getValidatedAiData();
    const client = new RestfulBookerClient(request);
    const token = await client.createToken();

    const bookings = [
      createBookingData(aiData.bookingTemplates[0]),
      createBookingData(aiData.bookingTemplates[1]),
      createBookingData()
    ];

    const created: BookingResponse[] = [];
    for (const booking of bookings) {
      created.push(await client.createBooking(booking));
    }

    for (const booking of created) {
      await expect
        .poll(async () => client.getBooking(booking.bookingid))
        .toMatchObject(booking.booking);
    }

    const updatedPayload = createBookingData({
      firstname: 'Updated',
      lastname: created[0].booking.lastname,
      depositpaid: !created[0].booking.depositpaid
    });
    const updated = await client.updateBooking(created[0].bookingid, token, updatedPayload);
    expect(updated).toMatchObject(updatedPayload);
    expect(await client.getBooking(created[0].bookingid)).toMatchObject(updatedPayload);

    const deleteResponse = await client.deleteBooking(created[1].bookingid, token);
    expect([200, 201]).toContain(deleteResponse.status());
    await expect
      .poll(async () => (await client.getRawBooking(created[1].bookingid)).status())
      .toBe(404);

    const unaffectedBooking = await client.getBooking(created[2].bookingid);
    expect(unaffectedBooking).toMatchObject(created[2].booking);
  });

  test('validates AI-generated negative scenarios', async ({ request }) => {
    const aiData = getValidatedAiData();
    const client = new RestfulBookerClient(request);
    const token = await client.createToken();
    const booking = await client.createBooking(createBookingData());

    // Each generated negative scenario owns its expected status contract.
    for (const scenario of aiData.negativeScenarios) {
      let status: number;

      if (scenario.method === 'POST') {
        status = (await client.postRawBooking(scenario.payload)).status();
      } else if (scenario.method === 'PUT') {
        status = (
          await client.putRawBooking(booking.bookingid, 'invalid-token', scenario.payload)
        ).status();
      } else {
        status = (await client.deleteRawBooking(booking.bookingid)).status();
      }

      expect(scenario.expectedStatuses, scenario.name).toContain(status);
    }

    const cleanup = await client.deleteBooking(booking.bookingid, token);
    expect([200, 201, 404]).toContain(cleanup.status());
  });
});
