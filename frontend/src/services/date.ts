const Fdate = (
  type: "get-date" | "return-date",
  date?: { day: number | string; time: string; date: string }
) => {
  const newDate = new Date();

  const day = newDate.getDay() + 1;
  let houres: number | string = newDate.getHours();
  let minutes: number | string = newDate.getMinutes();
  const getDate =
    newDate.getUTCFullYear() +
    "-" +
    newDate.getMonth() +
    "-" +
    newDate.getDate();
  const dateAfterWeak =
    newDate.getUTCFullYear() +
    "-" +
    newDate.getMonth() +
    "-" +
    (newDate.getDate() + 7);

  if (houres < 10) {
    houres = "0" + houres;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (type === "get-date") {
    let time = houres + ":" + minutes;
    const dataBody = {
      time,
      day,
      date: getDate,
    };

    return dataBody;
  } else if (type === "return-date" && date) {
    if (date.date > dateAfterWeak) {
      return date.date;
    } else if (date.day === day) {
      return date.time;
    } else {
      if (date.day === 1) {
        return "Sunday";
      }
      if (date.day === 2) {
        return "Monday";
      }
      if (date.day === 3) {
        return "Tuesday";
      }
      if (date.day === 4) {
        return "Thursday";
      }
      if (date.day === 5) {
        return "Wednesday";
      }
      if (date.day === 6) {
        return "Friday";
      }
      if (date.day === 7) {
        return "Saturday";
      }
    }
  }
};

export default Fdate;
