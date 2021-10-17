// Obtained from https://github.com/compute-io/skewness/blob/master/lib/index.js
function skewness( arr ) {
    if ( !Array.isArray( arr ) ) {
        throw new TypeError( 'skewness()::invalid input argument. Must provide an array.' );
    }
    var len = arr.length,
        delta = 0,
        delta_n = 0,
        term1 = 0,
        N = 0,
        mean = 0,
        M2 = 0,
        M3 = 0,
        g;

    for ( var i = 0; i < len; i++ ) {
        N += 1;

        delta = arr[ i ] - mean;
        delta_n = delta / N;

        term1 = delta * delta_n * (N-1);

        M3 += term1*delta_n*(N-2) - 3*delta_n*M2;
        M2 += term1;
        mean += delta_n;
    }
    // Calculate the population skewness:
    g = Math.sqrt( N )*M3 / Math.pow( M2, 3/2 );

    // Return the corrected sample skewness:
    return Math.sqrt( N*(N-1))*g / (N-2);
} // end FUNCTION skewness()


export default skewness;