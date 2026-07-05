import { faker } from '@faker-js/faker';

export type EmployeeData = {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  otherId: string;
  driverLicenseNumber: string;
};

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

const isoDateOnly = (date: Date) => date.toISOString().slice(0, 10);

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
