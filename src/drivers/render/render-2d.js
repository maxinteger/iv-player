export const VideoRender2d = (canvasElm) => {
    const canvas = canvasElm;
    const canvasCtx = canvas.getContext('2d');

    return (source, sourceWidth, sourceHeight) => {
        canvas.height = sourceHeight * (canvas.width / sourceWidth);
        canvasCtx.drawImage(
            source,
            0, 0, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
        );
    }
};