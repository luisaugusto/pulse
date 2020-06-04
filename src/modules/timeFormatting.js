export default {
  methods: {
    formatTime(time) {
      const date = new Date(time);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours > 12 ? hours - 12 : hours === 0 ? 12 : hours}:${minutes}${
        hours >= 12 ? "pm" : "am"
      }`;
    },
    formatDate(time) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const date = new Date(time);
      const year = date.getFullYear();
      const month = months[date.getMonth()];
      const day = String(date.getDate()).padStart(2, "0");
      return `${month} ${day}, ${year}`;
    }
  }
};
