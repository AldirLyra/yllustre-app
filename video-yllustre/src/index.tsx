import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {YllustreFilm} from './YllustreFilm';
import {YllustreFilmV2} from './YllustreFilmV2';

import {YllustreFilmV3} from './YllustreFilmV3';

import {YllustreFilmV4} from './YllustreFilmV4';

const Root = () => <><Composition id="YllustreEventos" component={YllustreFilm} width={1080} height={1920} fps={30} durationInFrames={1350}/><Composition id="YllustreEventosV2" component={YllustreFilmV2} width={1080} height={1920} fps={30} durationInFrames={1350}/><Composition id="YllustreEventosV3" component={YllustreFilmV3} width={1080} height={1920} fps={30} durationInFrames={1350}/><Composition id="YllustreEventosV4" component={YllustreFilmV4} width={1080} height={1920} fps={30} durationInFrames={1350}/></>;
registerRoot(Root);
