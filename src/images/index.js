const importAll = require =>
    require.keys().reduce((acc, next) => {
        acc[next.replace("./", "")] = require(next);
        return acc;
    }, {});

const images = importAll(
    require.context("./", false, /\.(png|jpe?g|svg|gif)$/)
);

export default images
