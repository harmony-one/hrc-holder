import moment from 'moment-timezone';
import Vue from 'vue';

/**
 * Ref:
 * * https://momentjs.com/docs/#/customization/relative-time-threshold/
 * * https://momentjs.com/docs/#/displaying/fromnow/
 */
moment.relativeTimeThreshold('ss', 0);

const language = 'en-US'; // window.navigator.userLanguage || window.navigator.language

function truncate(number, digits) {
  return Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

function setDecimalLength(value, minLength, maxLength) {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: minLength,
    maximumFractionDigits: maxLength,
  }).format(truncate(value, maxLength));
}

export function shortDecimals(value) {
  return setDecimalLength(value, 2, 9);
}

export function formatDecimal(number) {
  return formatNumber((+number).toFixed(2));
}

export function formatNumber(number) {
  return (+number).toLocaleString();
}

export function shortenHash(hash) {
  if (!hash || hash.length <= 10) return hash;
  return hash.substr(0, 5) + '...' + hash.substr(hash.length - 5);
}

export function formatTimestamp(timestamp) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return moment(timestamp)
    .tz(timezone)
    .format('MM/DD/YYYY HH:mm:ss z');
}

export function formatAge(timestamp) {
  return moment(timestamp).fromNow();
}

export function formatAmount(amount) {
  if (amount === undefined || amount === null) {
    return 0;
  }

  const value = Number(amount) / 10 ** 18;

  return Math.round(value * 10000) / 10000;
}

export function formatBlockLatency(time) {
  if (!time) {
    return '-';
  }

  return formatDecimal(time / 10 ** 3) + 's';
}

export function calculateFee(transaction) {
  const fee =
    isNaN(transaction.gas) || isNaN(transaction.gasPrice)
      ? 0
      : (Number(transaction.gas) * Number(transaction.gasPrice)) /
        10 ** 14 /
        10000;

  return Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(fee);
  //return Math.round(fee * 10 ** 9) / 10 ** 9;
}

export function formatTxStatus(status) {
  switch (status) {
    case 'SUCCESS':
      return 'Success';
    case 'PENDING':
      return 'Pending';
    case 'FAILURE':
      return 'Failure';
    default:
      return 'Unknown';
  }
}

Vue.filter('decimal', formatDecimal);
Vue.filter('number', formatNumber);
Vue.filter('shorten', shortenHash);
Vue.filter('timestamp', formatTimestamp);
Vue.filter('age', formatAge);
Vue.filter('amount', formatAmount);
Vue.filter('txStatus', formatTxStatus);
Vue.filter('fee', calculateFee);
Vue.filter('blockLatency', formatBlockLatency);
