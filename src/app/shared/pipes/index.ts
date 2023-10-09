import { EllipsisPipe } from './ellipsis.pipe';
import { BoroughsPipe } from './boroughs.pipe';
import {HighlighterPipe} from './highlighter.pipe';

export const pipes = [ EllipsisPipe, BoroughsPipe, HighlighterPipe ];

export * from './ellipsis.pipe';
export * from './highlighter.pipe';
export * from './boroughs.pipe';
