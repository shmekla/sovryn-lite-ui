import log from 'loglevel';

window.log = log;
log.setDefaultLevel(process.env.NODE_ENV === 'production' ? 'silent' : 'trace');

export default log;
