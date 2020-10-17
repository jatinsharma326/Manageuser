import moment from "moment-timezone";

let traverseObject = (obj, is, value) => {
  if (typeof is == "string") return traverseObject(obj, is.split("."), value);
  else if (is.length == 1 && value !== undefined) return (obj[is[0]] = value);
  else if (is.length == 0) return obj;
  else return traverseObject(obj[is[0]], is.slice(1), value);
};

export default {
  getCurrentRoute: () => {
    let hashUrl = window.location.hash.split("/");
    return hashUrl[hashUrl.length - 1];
  },
  getISODate: (date) => {
    return moment(new Date(date))
      .tz("Asia/Kolkata")
      .toISOString();
  },
  getFormattedDate: (date, format) => {
    return moment(date)
      .tz("Asia/Kolkata")
      .format(format);
  },
  traverseObject,
};
