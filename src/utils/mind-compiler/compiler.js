import { CompilerBase } from './compiler-base.js';

export class Compiler extends CompilerBase {
  createProcessCanvas(img) {
    const processCanvas = document.createElement('canvas');
    processCanvas.width = img.width;
    processCanvas.height = img.height;
    return processCanvas;
  }

  compileTrack({ progressCallback, targetImages, basePercent }) {
    return new Promise((resolve, reject) => {
      // Standard module worker (no bundler flags)
      // For Vite, we need to use a different approach for worker
      const worker = new Worker(new URL('./compiler.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        if (e.data.type === 'progress') {
          progressCallback(basePercent + (e.data.percent * basePercent) / 100);
        } else if (e.data.type === 'compileDone') {
          resolve(e.data.list);
          worker.terminate();
        }
      };
      worker.onerror = (err) => reject(err);
      worker.postMessage({ type: 'compile', targetImages });
    });
  }
}
