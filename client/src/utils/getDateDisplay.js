import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getDateDisplay = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm') + ` (${dayjs(date).fromNow()})`;
};

export default getDateDisplay;
