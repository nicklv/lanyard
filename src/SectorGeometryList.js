/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.SectorGeometryList');

/**
 * A list of sector geometries.
 *
 * @constructor
 */
lanyard.SectorGeometryList = function () {
    /**
     * @private
     * @type {Array.<SectorGeometry>}
     */
    this._geometryList = [];
};

/**
 * Get a list of the intersecting sectors.
 *
 * @param {lanyard.geom.Sector} sector the sector to check for intersection with.
 * @return {Array.<SectorGeometry>} the array of sector geometries.
 */
lanyard.SectorGeometryList.prototype.getIntersectingSectors = function (sector) {

    /** @type {Array.<SectorGeometry>} */
    var list = [];

    /** @type {number} */
    var i;
    for(i = 0; i < this._geometryList.length; i = i + 1) {
        if (this._geometryList[i].getSector().intersects(sector)) {
            list.push(this._geometryList[i]);
        } else {
            // this._logger.fine("no intersection");
        }
    }

    return list;
};

/**
 * Get a surface point at a position.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of the position.
 * @param {number} metersOffset the meters offset.
 * @return {lanyard.geom.Point} the surface point.
 */
lanyard.SectorGeometryList.prototype.getSurfacePoint = function (latitude, longitude, metersOffset) {

    /** @type {number} */
    var i;
    for(i = 0; i < this._geometryList.length; i = i + 1) {
        if (this._geometryList[i].getSector().contains(latitude, longitude)) {
            /** @type {lanyard.geom.Point} */
            var point = this._geometryList[i].getSurfacePoint(latitude, longitude, metersOffset);
            if (point) {
                return point;
            }
       }
    }

    return null;
};

/* EOF */