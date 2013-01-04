var online = exports;

online.summary = function() {
    var quartiles = [],
        minArray = [],
        v = science.stats.inline.variance();

    function summary(datum) {
        var curr_variance = v(datum);
        //min and max
        var length = v.n();
        if (length < 5) {
            minArray.push(datum);
        } else if (length === 5) {
            minArray.push(datum);
            minArray.sort();
            quartiles = minArray;
        } else {
            //min max
            quartiles[0] = Math.min(quartiles[0], datum);
            quartiles[4] = Math.max(quartiles[4], datum);
            var rate = 2 * (quartiles[3] - quartiles[1]) / length;
            //quartiles
            quartiles[1] += (science.signum(datum - quartiles[1]) - 0.5) * rate;
            quartiles[2] += (science.signum(datum - quartiles[2])) * rate;
            quartiles[3] += (science.signum(datum - quartiles[3]) + 0.5) *rate;
        }
        return quartiles;
    }

    summary.quartiles = function(_) {
        if (!arguments.length) return quartiles;
        quartiles = _;
        return summary;
    };

    summary.variance = function(_) {
        if (!arguments.length) return v;
        v = _;
        return summary;
    };

    summary.n = function(_) {
        if(!arguments.length) return v.n();
        v.n(_);
        return summary;
    };

    summary.mean = function(_) {
        if(!arguments.length) return v.mean();
        v.mean(_);
        return summary;
    };

    return summary;
};

online.variance = function() {
    var mean = 0,
        sum = 0,
        M2 = 0,
        n = 0;

    function variance(datum) {
        n++;
        var delta = datum - mean;
        mean = mean + delta/n;
        M2 = M2 + delta * (datum - mean);
        return M2/n; //currently don't know which to choose, following mahout: [M2/(n-1), M2/n];  
    }

    variance.n = function(_) {
        if (!arguments.length) return n;
        n = _;
        return variance;
    };

    variance.M2 = function(_) {
        if (!arguments.length) return M2;
        M2 = _;
        return variance;   
    };

    variance.mean = function(_) {
        if(!arguments.length) return mean;
        mean = _;
        return variance;
    };

    return variance;
} 