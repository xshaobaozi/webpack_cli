const ua = navigator.userAgent;
const app = navigator.appVersion;
export const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1; //android终端或者uc浏览器
export const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
export const isCCPC = (() => { return (window.external && window.external.ICC_GetCCVersion) || (() => (false));})()();
