import { ReadingTimeChartLevel, ReadingTimeChartParams } from "./schema";

export const PrevDaysLookup = {
  [ReadingTimeChartLevel.week_1]: 6,
  [ReadingTimeChartLevel.week_2]: 13,
  [ReadingTimeChartLevel.month_1]: 29,
  [ReadingTimeChartLevel.month_2]: 59,
  [ReadingTimeChartLevel.month_3]: 89,
} as const;

export type ReadingTimeEntry = {
  totalViewTime: number;
  createdAt: Date;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const getGroupedReadingTime = async (
  data: ReadingTimeEntry[],
  intervalDates: Date[]
) => {
  // fetch reading time during last week
  const readingTimeByGroup = data.reduce((acc, entry) => {
    // for some legacy records, totalViewTime is null
    const entryDate = new Date(entry.createdAt);
    // find the smallest date in intervalDates that is greater than entryDate
    const thresholdDate = intervalDates.find((date) => entryDate <= date);

    if (thresholdDate) {
      const formattedDate = formatDate(thresholdDate);
      acc.set(
        formattedDate,
        (acc.get(formattedDate) || 0) + entry.totalViewTime
      );
    } else {
      // when the entry date is greater than the last date in intervalDates, group it with the last date
      const lastDate = intervalDates[intervalDates.length - 1] as Date;
      const formattedDate = formatDate(lastDate);
      acc.set(
        formattedDate,
        (acc.get(formattedDate) || 0) + entry.totalViewTime
      );
    }

    return acc;
  }, new Map<string, number>());

  return readingTimeByGroup;
};

const format = (date: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];

  return `${month} ${day}`;
};

export const getReadingTimeChartData = (
  groupedReadingTime: Map<string, number>,
  intervalDates: Date[],
  params: ReadingTimeChartParams
) => {
  const chartData = [];
  let totalViewTime = 0;

  for (const [i, date] of intervalDates.entries()) {
    const formattedDate = formatDate(date);
    totalViewTime += groupedReadingTime.get(formattedDate) || 0;

    const value = (groupedReadingTime.get(formattedDate) || 0) / 60;
    // depending on the time span, format the date differently
    // when it's 1 week, format each individual date directly
    // when it's other time spans, format the date as a range: "Jan 1-7", "Jan 8-14", etc.
    let name: string;
    if (params.level === ReadingTimeChartLevel.week_1) {
      name = format(new Date(date));
    } else {
      const start = format(new Date(date));
      let end: string;
      if (i === intervalDates.length - 1) {
        end = "Now";
      } else {
        const nextDate = new Date(intervalDates[i + 1] as Date);
        if (nextDate.getMonth() !== date.getMonth()) {
          end = format(nextDate);
        } else {
          end = date.getDate().toString().padStart(2, "0");
        }
      }
      name = `${start}-${end}`;
    }
    chartData.push({
      name,
      value,
    });
  }

  return { totalViewTime, chartData };
};
