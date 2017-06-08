exports.foreach = function(array, cb) {
    for(var i = 0; i < array.length; i++) {
        cb.call(array[i], i);
    }
};