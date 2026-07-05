import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { BookingData } from '../data/testDataFactory';

export type BookingResponse = {
  bookingid: number;
  booking: BookingData;
};

export class RestfulBookerClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(): Promise<string> {
    const response = await this.request.post('https://restful-booker.herokuapp.com/auth', {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { token: string };
    expect(body.token).toBeTruthy();
    return body.token;
  }

  async createBooking(data: BookingData): Promise<BookingResponse> {
    const response = await this.request.post('https://restful-booker.herokuapp.com/booking', { data });
    expect(response.status()).toBe(200);
    const body = (await response.json()) as BookingResponse;
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking).toMatchObject(data);
    return body;
  }

  async getBooking(bookingId: number): Promise<BookingData> {
    const response = await this.request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
    expect(response.status()).toBe(200);
    return (await response.json()) as BookingData;
  }

  async updateBooking(bookingId: number, token: string, data: BookingData): Promise<BookingData> {
    const response = await this.request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: this.authHeaders(token),
      data
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as BookingData;
  }

  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: this.authHeaders(token)
    });
  }

  async getRawBooking(bookingId: number): Promise<APIResponse> {
    return this.request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
  }

  async postRawBooking(data: unknown): Promise<APIResponse> {
    return this.request.post('https://restful-booker.herokuapp.com/booking', { data });
  }

  async putRawBooking(bookingId: number, token: string | undefined, data: unknown): Promise<APIResponse> {
    return this.request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: token ? this.authHeaders(token) : undefined,
      data
    });
  }

  async deleteRawBooking(bookingId: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: token ? this.authHeaders(token) : undefined
    });
  }

  private authHeaders(token: string) {
    return {
      Cookie: `token=${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }
}
