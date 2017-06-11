/**
 * Iterate over array
 * Calls the callback function for each item of the array
 * and binds "this" to the current loop item
 *
 * @param array
 * @param cb
 */
exports.foreach = function(array, cb) {
    for(var i = 0; i < array.length; i++) {
        cb.call(array[i], i);
    }
};