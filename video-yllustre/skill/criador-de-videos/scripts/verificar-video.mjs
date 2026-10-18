#!/usr/bin/env node
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {stat} from 'node:fs/promises';
import {resolve} from 'node:path';

const execute = promisify(execFile);
const help = `Uso: node verificar-video.mjs /caminho/video.mp4 [opções]
  --duration SEGUNDOS   duração esperada (tolerância de 1 frame)
  --width PIXELS       largura esperada
  --height PIXELS      altura esperada
  --fps NUMERO         fps esperado
  --frames INTEIRO     quantidade de frames esperada
  --audio required|optional  default: required
  --help
Requer ffprobe e ffmpeg no PATH. Somente leitura; imprime JSON.
Faz decode integral e volumedetect, mas não valida aparência/claims/escuta.`;

const rate = (value) => {
  if (typeof value !== 'string' || !value) return null;
  const [num, den = '1'] = value.split('/').map(Number);
  return Number.isFinite(num) && Number.isFinite(den) && den !== 0 ? num / den : null;
};
const number = (value) => {
  if (value === undefined || value === null || value === '' || value === 'N/A') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const expectedNames = new Set(['duration', 'width', 'height', 'fps', 'frames']);

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log(help);
    return;
  }
  if (!args.length || args[0].startsWith('--')) throw new Error(help);
  const file = resolve(args.shift());
  const expected = {};
  let audioMode = 'required';
  while (args.length) {
    const key = args.shift();
    const value = args.shift();
    if (!key?.startsWith('--') || value === undefined) throw new Error(`Opção incompleta: ${key}`);
    const name = key.slice(2);
    if (name === 'audio') {
      if (!['required', 'optional'].includes(value)) throw new Error('--audio precisa ser required ou optional');
      audioMode = value;
    } else if (expectedNames.has(name)) {
      const parsed = number(value);
      if (parsed === null || parsed <= 0) throw new Error(`Valor inválido em ${key}`);
      if (['width', 'height', 'frames'].includes(name) && !Number.isInteger(parsed)) throw new Error(`${key} precisa ser inteiro`);
      expected[name] = parsed;
    } else {
      throw new Error(`Opção desconhecida: ${key}`);
    }
  }

  const info = await stat(file);
  if (!info.isFile() || info.size === 0) throw new Error('Arquivo ausente, vazio ou não regular');
  const {stdout} = await execute('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {timeout: 60000, maxBuffer: 8 * 1024 * 1024});
  const probe = JSON.parse(stdout);
  const video = probe.streams?.find((stream) => stream.codec_type === 'video' && stream.disposition?.attached_pic !== 1);
  const audios = probe.streams?.filter((stream) => stream.codec_type === 'audio') ?? [];
  const failures = [];
  const warnings = [];
  if (!video) failures.push('Nenhum stream de vídeo encontrado');
  if (audioMode === 'required' && !audios.length) failures.push('Áudio esperado, mas nenhum stream de áudio encontrado');

  const fps = rate(video?.avg_frame_rate) ?? rate(video?.r_frame_rate);
  const duration = number(video?.duration) ?? number(probe.format?.duration);
  const frames = number(video?.nb_frames);
  if (duration === null || duration <= 0) failures.push('Duração ausente ou inválida');
  if (fps === null || fps <= 0) failures.push('Frame rate ausente ou inválido');
  if (expected.duration !== undefined && (duration === null || Math.abs(duration - expected.duration) > Math.max(0.002, 1 / (fps || expected.fps || 30)))) failures.push(`Duração: ${duration}, esperada: ${expected.duration}`);
  for (const key of ['width', 'height']) {
    if (expected[key] !== undefined && video?.[key] !== expected[key]) failures.push(`${key}: ${video?.[key]}, esperado: ${expected[key]}`);
  }
  if (expected.fps !== undefined && (fps === null || Math.abs(fps - expected.fps) > 0.001)) failures.push(`FPS: ${fps}, esperado: ${expected.fps}`);
  if (expected.frames !== undefined && frames !== expected.frames) failures.push(`Frames: ${frames ?? 'não informado pelo container'}, esperado: ${expected.frames}`);

  let decoded = false;
  try {
    await execute('ffmpeg', ['-nostdin', '-v', 'error', '-xerror', '-i', file, '-f', 'null', '-'], {timeout: 300000, maxBuffer: 8 * 1024 * 1024});
    decoded = true;
  } catch (error) {
    failures.push(`Falha na decodificação integral: ${error.stderr?.trim() || error.message}`);
  }

  let levels = null;
  if (audios.length) {
    const {stderr} = await execute('ffmpeg', ['-nostdin', '-hide_banner', '-i', file, '-map', '0:a:0', '-af', 'volumedetect', '-vn', '-sn', '-dn', '-f', 'null', '-'], {timeout: 300000, maxBuffer: 8 * 1024 * 1024});
    const max = stderr.match(/max_volume:\s*([-\d.]+|inf|-inf)\s*dB/);
    const mean = stderr.match(/mean_volume:\s*([-\d.]+|inf|-inf)\s*dB/);
    levels = {samplePeakDb: number(max?.[1]), meanDb: number(mean?.[1]), method: 'volumedetect, primeiro stream; não é true peak/LUFS/escuta'};
    if (!max || !mean) warnings.push('Não foi possível extrair medidas básicas de volume');
    if (levels.samplePeakDb !== null && levels.samplePeakDb >= -0.1) warnings.push('Pico próximo de 0 dBFS; conferir clipping/true peak e escutar');
    if (levels.meanDb !== null && levels.meanDb < -55) warnings.push('Volume médio muito baixo; conferir se silêncio é intencional');
    for (const audio of audios) {
      const audioDuration = number(audio.duration);
      if (audioDuration !== null && duration !== null && Math.abs(audioDuration - duration) > 0.1) warnings.push(`Stream ${audio.index}: duração do áudio (${audioDuration}s) difere do vídeo (${duration}s); conferir cortes/fade`);
    }
  }

  console.log(JSON.stringify({
    file,
    ok: failures.length === 0,
    bytes: info.size,
    duration,
    containerDuration: number(probe.format?.duration),
    video: video ? {codec: video.codec_name, width: video.width, height: video.height, pixelFormat: video.pix_fmt, fps, frames} : null,
    audio: audios.map((audio) => ({index: audio.index, codec: audio.codec_name, sampleRate: number(audio.sample_rate), channels: audio.channels, duration: number(audio.duration)})),
    integralDecodePassed: decoded,
    levels,
    failures,
    warnings,
    limits: 'Conferência técnica. Não valida layout, texto, claims, sincronismo perceptual ou qualidade da mixagem.',
  }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ok: false, error: error.code === 'ENOENT' ? `Arquivo ou dependência não encontrado: ${error.path || error.message}` : error.message}, null, 2));
  process.exitCode = 1;
});
