const importAll = require =>
    require.keys().reduce((acc, next) => {
        acc[next.replace("./", "")] = require(next);
        return acc;
    }, {});

const images = importAll(
    require.context("./", false, /\.(png|jpe?g|svg|gif)$/)
);

// To heck with images hashes maaan
for (const key of Object.keys(images)) {
    console.log(key + " -> " + images[key])
}

export default images
