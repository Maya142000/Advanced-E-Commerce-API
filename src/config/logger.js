import { createLogger, format, transports, addColors }  from 'winston';
const { combine, colorize, label, timestamp, json, prettyPrint, printf } = format;
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
let myCustomFormat = format.combine(

    colorize({
        all: true
    }),
    label({
        label: '[LOGGER]'
    }),
    timestamp({
        format: 'YY-MM-DD HH:MM:SS'
    }),

    printf((info) => ` ${info.message} ${info.label} ${info.level} ${info.timestamp}`)
);

addColors({
    info: 'yellow', 
    warn: 'italic orange',
    error: 'bold red',
    debug: 'green'
});

export const logger = createLogger({
    transports: [ new transports.Console({format: combine(myCustomFormat)})]
});