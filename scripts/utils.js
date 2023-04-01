import path from 'path';
import fse from 'fs-extra';
import zlib from 'zlib';

const KEY_REGEX = /^--(.*)/;
const SIZE_UNITS = ['B', 'KiB', 'MiB'];

const formatTime = (ms) => `${(ms / 1000).toFixed(3)} sec`;

const formatSize = (bytes) => {
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${SIZE_UNITS[index]}`;
};

export const getArguments = () => {
  const args = process.argv.slice(2);

  return args.reduce((acc, arg, index, args) => {
    if (!KEY_REGEX.test(arg)) {
      return acc;
    } else if (!args[index + 1] || args[index + 1] && KEY_REGEX.test(args[index + 1])) {
      return { ...acc, [arg.slice(2)]: true };
    }

    return { ...acc, [arg.slice(2)]: args[index + 1] };
  }, {});
};

export const getMetrics = (startTime, buildPath) => {
  const elapsedTime = Date.now() - startTime;

  const { size, sizeGzip } = fse.readdirSync(buildPath).reduce((acc, filePath) => {
    const fullPath = path.join(buildPath, filePath);

    if (fse.lstatSync(fullPath).isFile()) {
      const contents = fse.readFileSync(fullPath);

      return {
        size: acc.size + Buffer.byteLength(contents),
        sizeGzip: acc.sizeGzip + zlib.gzipSync(contents).length,
      }
    }

    return acc;
  }, { size: 0, sizeGzip: 0});

  const lines = [
    `elapsed time: ${formatTime(elapsedTime)}`,
    `size: ${formatSize(size)}`,
    `size gzip: ${formatSize(sizeGzip)}`,
  ];

  return lines.join(', ');
};
