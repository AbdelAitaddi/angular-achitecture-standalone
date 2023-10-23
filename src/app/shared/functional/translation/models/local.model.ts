import { Locale } from '../config/local.config';

export type LocaleType = (typeof Locale)[keyof typeof Locale];
