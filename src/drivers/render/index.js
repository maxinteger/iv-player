import {cAF, rAF} from "../../utils/polyfill";
import {log, logError} from "../../utils/log";

export const makeRenderDriver = (videoRender) => {

    if (typeof videoRender != 'function') {
        throw new Error('videoRender must be a function');
    }

    let videoRenderInstance = null;
    let lastRFAId = 0;

    const setCanvas = (elm) => videoRenderInstance = videoRender(elm);

    const unsetCanvas = () => videoRenderInstance = null;

    return sink_ => {
        sink_.addListener({
            next: ({source, width, height}) => {
                if (videoRenderInstance) {
                    cAF(lastRFAId);
                    lastRFAId = rAF(() => videoRenderInstance.render(source, width, height));
                }
            },
            complete: () => log('Render driver completed'),
            error: logError('Render driver has fallen')
        });

        return {setCanvas, unsetCanvas}
    }
};