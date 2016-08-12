import {log, logError} from "../../utils/log";

export const makeRenderDriver = (renderAdapter) => {

    if (typeof renderAdapter != 'function') {
        throw new Error('renderAdapter must be a function');
    }

    let renderFn = null;

    const setCanvas = elm => renderFn = renderAdapter(elm);

    const unsetCanvas = () => renderFn = null;

    return sink_ => {
        sink_.addListener({
            next: ({source, width, height}) => {
                if (renderFn) {
                    renderFn(source, width, height)
                }
            },
            complete: () => log('Render driver completed'),
            error: logError('Render driver has fallen')
        });

        return {setCanvas, unsetCanvas}
    }
};