import { deepStrictEqual } from "assert";
import * as moment from "moment";
import { fetchAvailability } from "./index";
import { Space } from "./types";

describe("src/index", () => {
  describe("a space with no advance notice", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-no-advance-notice.json");
    });

    it("fetches availability for a space before the space has opened", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 10, 30))
      );

      deepStrictEqual(availability, {
        "2020-09-07": {
          open: {
            hour: 9,
            minute: 0,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });

    it("fetches availability for a space after the space has opened", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 15, 25))
      );

      deepStrictEqual(availability, {
        "2020-09-07": {
          open: {
            hour: 11,
            minute: 30,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });

    it("fetches availability for a space after the space has closed", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 22, 15))
      );

      deepStrictEqual(availability, {
        "2020-09-07": {},
      });
    });
  });

  describe("a space with 30 minutes advance notice", () => {
    let space: Space;
    before(async () => {
      space = await import(
        "../fixtures/space-with-30-minutes-advance-notice.json"
      );
    });

    it("fetches availability for a space before the space has opened", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 10, 30))
      );

      deepStrictEqual(availability, {
        "2020-09-07": {
          open: {
            hour: 9,
            minute: 0,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });

    it("fetches availability for a space after the space has opened", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 15, 25))
      );

      deepStrictEqual(availability, {
        "2020-09-07": {
          open: {
            hour: 12,
            minute: 0,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });

    it("fetches availability for a space after the space has closed", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 22, 15))
      );

      deepStrictEqual(availability, {
        "2020-09-07": {},
      });
    });
  });

  describe("a space with 30 minutes advance notice and different timezones", () => {
    let space: Space;
    before(async () => {
      space = await import(
        "../fixtures/space-with-30-minutes-advance-notice.json"
      );
    });

    it("fetches availability for a London time", () => {
      const availability = fetchAvailability(
        space,
        1,
        moment.tz("2021-07-26 15:12:00", "Europe/London").toDate()
      );

      deepStrictEqual(availability, {
        "2021-07-26": {
          close: {
            hour: 17,
            minute: 0,
          },
          open: {
            hour: 10,
            minute: 45,
          },
        },
      });
    });

    it("fetches availability for a Tokyo time", () => {
      const availability = fetchAvailability(
        space,
        1,
        moment.tz("2021-07-26 23:24:00", "Asia/Tokyo").toDate()
      );

      deepStrictEqual(availability, {
        "2021-07-26": {
          close: {
            hour: 17,
            minute: 0,
          },
          open: {
            hour: 11,
            minute: 0,
          },
        },
      });
    });

    it("fetches availability for a UTC time 7 days", () => {
      const availability = fetchAvailability(
        space,
        7,
        new Date(Date.UTC(2021, 7, 4, 14, 30))
      );

      deepStrictEqual(availability, {
        "2021-08-04": {
          open: { hour: 11, minute: 15 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-05": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-06": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-07": {},
        "2021-08-08": {},
        "2021-08-09": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-10": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
      });
    });

    it("fetches availability for a UTC time 14 days", () => {
      const availability = fetchAvailability(
        space,
        14,
        new Date(Date.UTC(2021, 7, 4, 14, 30))
      );

      deepStrictEqual(availability, {
        "2021-08-04": {
          open: { hour: 11, minute: 15 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-05": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-06": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-07": {},
        "2021-08-08": {},
        "2021-08-09": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-10": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-11": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-12": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-13": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-14": {},
        "2021-08-15": {},
        "2021-08-16": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
        "2021-08-17": {
          open: { hour: 9, minute: 0 },
          close: { hour: 17, minute: 0 },
        },
      });
    });
  });
});
