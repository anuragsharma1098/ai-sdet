import { faker } from '@faker-js/faker';

/** Dynamic data contract for OrangeHRM employee workflows. */
export type EmployeeData = {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  otherId: string;
  driverLicenseNumber: string;
};

/** RESTful Booker booking payload contract used by API tests. */
export type BookingData = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
};

/** Converts generated dates to RESTful Booker's yyyy-mm-dd date format. */
const isoDateOnly = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Builds unique employee data while allowing scenario-specific overrides.
 * IDs and names are randomized to reduce collisions in the shared demo app.
 */
export function createEmployeeData(overrides: Partial<EmployeeData> = {}): EmployeeData {
  const suffix = faker.string.alphanumeric({ length: 6, casing: 'upper' });

  return {
    firstName: `Auto${faker.person.firstName()}`,
    middleName: faker.person.middleName(),
    lastName: `User${suffix}`,
    employeeId: faker.string.numeric(6),
    otherId: `OID-${suffix}`,
    driverLicenseNumber: `DL-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
    ...overrides
  };
}

/** Builds a valid booking payload with optional overrides for update scenarios. */
export function createBookingData(overrides: Partial<BookingData> = {}): BookingData {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 45, refDate: checkin });

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 80, max: 900 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: isoDateOnly(checkin),
      checkout: isoDateOnly(checkout)
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Late checkout', 'Airport pickup']),
    ...overrides
  };
}
