import { OpeningTimes, Space } from "./types";
import * as moment from "moment";
import * as momentTimezone from "moment-timezone";

/**
 * Fetches upcoming availability for a space
 * @param space The space to fetch the availability for
 * @param numberOfDays The number of days from `now` to fetch availability for
 * @param now The time now
 */
export const fetchAvailability = (
  space: Space,
  numberOfDays: number,
  now: Date
): Record<string, OpeningTimes> => {
  const nowUTC: moment.Moment = moment(now).utc();
  const roundedMinutes: number = 15 - (nowUTC.minute() % 15);
  const roundedTimeUTC: moment.Moment = moment(nowUTC).add(
    roundedMinutes,
    "minutes"
  );
  const roundedTimeWithNotice: moment.Moment = moment(roundedTimeUTC).add(
    space.minimumNotice,
    "minutes"
  );

  const dayOfWeek: number = nowUTC.isoWeekday();

  const advanceDays: OpeningTimes[] = Object.values(space.openingTimes).splice(
    dayOfWeek - 1,
    numberOfDays
  );

  const store = {};

  advanceDays.forEach((item: OpeningTimes, index: number) => {
    const today: string = moment(roundedTimeWithNotice)
      .add(index, "days")
      .format("YYYY-MM-DD");

    const openingTimeUTC: moment.Moment = momentTimezone
      .tz(
        `${today} ${item.open?.hour}:${item.open?.minute}`,
        "YYYY-MM-DD hh:mm",
        space.timeZone
      )
      .utc();

    const closingTimeUTC: moment.Moment = momentTimezone
      .tz(
        `${today} ${item.close?.hour}:${item.close?.minute}`,
        "YYYY-MM-DD hh:mm",
        space.timeZone
      )
      .utc();

    if (roundedTimeWithNotice.isBefore(openingTimeUTC)) {
      return (store[today] = { ...item });
    }
    if (roundedTimeWithNotice.isAfter(closingTimeUTC)) {
      return (store[today] = {});
    }

    return (store[today] = {
      open: {
        hour: momentTimezone.tz(roundedTimeWithNotice, space.timeZone).hours(),
        minute: momentTimezone
          .tz(roundedTimeWithNotice, space.timeZone)
          .minute(),
      },
      close: { ...item.close },
    });
  });
  return store;
};
