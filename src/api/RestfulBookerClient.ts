import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { env } from '../config/env';
import type { BookingData } from '../data/testDataFactory';

/** Response shape returned by RESTful Booker after creating a booking. */
export type BookingResponse = {
  bookingid: number;
  booking: BookingData;
};

/**
 * Typed wrapper around RESTful Booker endpoints.
 *
 * Positive methods assert expected status codes and deserialize response bodies.
 * Raw methods return APIResponse so negative scenarios can validate status codes
 * without failing early inside the client.
 */
export class RestfulBookerClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl = env.restfulBookerBaseUrl
  ) {}

  /** Creates an auth token used by update and delete requests. */
  async createToken(): Promise<string> {
    const response = await this.request.post(this.endpoint('/auth'), {
      data: {
        username: env.restfulBookerUsername,
        password: env.restfulBookerPassword
      }
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { token: string };
    expect(body.token).toBeTruthy();
    return body.token;
  }

  /** Creates a booking and validates the response echoes the submitted payload. */
  async createBooking(data: BookingData): Promise<BookingResponse> {
    const response = await this.request.post(this.endpoint('/booking'), { data });
    expect(response.status()).toBe(200);
    const body = (await response.json()) as BookingResponse;
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking).toMatchObject(data);
    return body;
  }

  /** Retrieves a booking and returns the normalized booking payload. */
  async getBooking(bookingId: number): Promise<BookingData> {
    const response = await this.request.get(this.endpoint(`/booking/${bookingId}`));
    expect(response.status()).toBe(200);
    return (await response.json()) as BookingData;
  }

  /** Updates a booking using token authentication and returns the saved payload. */
  async updateBooking(bookingId: number, token: string, data: BookingData): Promise<BookingData> {
    const response = await this.request.put(this.endpoint(`/booking/${bookingId}`), {
      headers: this.authHeaders(token),
      data
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as BookingData;
  }

  /** Deletes a booking using token authentication. */
  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.request.delete(this.endpoint(`/booking/${bookingId}`), {
      headers: this.authHeaders(token)
    });
  }

  /** Returns the raw GET response for status polling and negative assertions. */
  async getRawBooking(bookingId: number): Promise<APIResponse> {
    return this.request.get(this.endpoint(`/booking/${bookingId}`));
  }

  /** Sends an untyped POST payload for invalid-data negative scenarios. */
  async postRawBooking(data: unknown): Promise<APIResponse> {
    return this.request.post(this.endpoint('/booking'), { data });
  }

  /** Sends an untyped PUT payload for authorization and invalid-data checks. */
  async putRawBooking(bookingId: number, token: string | undefined, data: unknown): Promise<APIResponse> {
    return this.request.put(this.endpoint(`/booking/${bookingId}`), {
      headers: token ? this.authHeaders(token) : undefined,
      data
    });
  }

  /** Sends a DELETE request with optional auth for authorization scenarios. */
  async deleteRawBooking(bookingId: number, token?: string): Promise<APIResponse> {
    return this.request.delete(this.endpoint(`/booking/${bookingId}`), {
      headers: token ? this.authHeaders(token) : undefined
    });
  }

  /** Builds an absolute RESTful Booker endpoint from the selected environment. */
  private endpoint(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  /** Builds RESTful Booker token headers used by protected endpoints. */
  private authHeaders(token: string) {
    return {
      Cookie: `token=${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }
}
