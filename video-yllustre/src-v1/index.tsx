import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {YllustreFilm} from './YllustreFilm';

const Root = () => <Composition id="YllustreEventos" component={YllustreFilm} width={1080} height={1920} fps={30} durationInFrames={1350}/>;
registerRoot(Root);
