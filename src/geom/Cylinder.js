/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Cylinder');

/**
 * A basic geometric cylinder.
 *
 * @constructor
 * @implements {lanyard.Renderable}
 * @implements {lanyard.geom.Extent}
 * @this {lanyard.geom.Cylinder}
 * @param {lanyard.geom.Point} bottomCenter represents the centrepoint of the base disc of the Cylinder.
 * @param {lanyard.geom.Point} topCenter represents the centrepoint of the top disc of the Cylinder.
 * @param {number} cylinderRadius the radius of the Cylinder.
 */
lanyard.geom.Cylinder = function (bottomCenter, topCenter, cylinderRadius) {
    /** @private */ this.bottomCenter = bottomCenter;
    /** @private */ this.topCenter = topCenter;
    /** @private */ this.cylinderHeight = this.bottomCenter.distanceTo(this.topCenter);
    /** @private */ this.cylinderRadius = cylinderRadius;
    /** @private */ this.axisUnitDirection = this.topCenter.subtract(this.bottomCenter).normalize();
};
goog.exportSymbol('lanyard.geom.Cylinder', lanyard.geom.Cylinder);

/**
 * Find a string representation of this cylinder.
 *
 * @return {string} a string representation of this cylinder.
 */
lanyard.geom.Cylinder.prototype.toString = function () {
    var ret = this.cylinderRadius + ", " + this.bottomCenter.toString() + ", " +
        this.topCenter.toString() + ", " + this.axisUnitDirection.toString();
    return ret;
};

/**
 * Find intersections of this cylinder with a line.
 *
 * @param {lanyard.geom.Line} line the line to test.
 * @return {Array.<lanyard.geom.Intersection>} the intersections.
 */
lanyard.geom.Cylinder.prototype.intersect = function (line) {
    /** @type {lanyard.geom.Point} */
    var ld = line.getDirection();

    /** @type {lanyard.geom.Point} */
    var lo = line.getOrigin();

    /** @type {number} */
    var a = ld.getX() * ld.getX() + ld.getY() * ld.getY();

    /** @type {number} */
    var b = 2 * (lo.getX() * ld.getX() + lo.getY() * ld.getY());

    /** @type {number} */
    var c = lo.getX() * lo.getX() + lo.getY() * lo.getY() - this.cylinderRadius * this.cylinderRadius;

    /** @type {number} */
    var discriminant = lanyard.geom.Cylinder.prototype.discriminant(a, b, c);

    if (discriminant < 0) {
        return null;
    }

    /** @type {number} */
    var discriminantRoot = Math.sqrt(discriminant);

    if (discriminant === 0) {
        /** @type {lanyard.geom.Point} */
        var p = line.getPointAt((-b - discriminantRoot) / (2 * a));

        return [ new lanyard.geom.Intersection(p, true) ];

    } else { // (discriminant > 0)

        /** @type {lanyard.geom.Point} */
        var near = line.getPointAt((-b - discriminantRoot) / (2 * a));

        /** @type {lanyard.geom.Point} */
        var far = line.getPointAt((-b + discriminantRoot) / (2 * a));

        /** @type {boolean} */
        var n = false;

        /** @type {boolean} */
        var f = false;

        /** @type {boolean} */
        var nTangent = false;

        /** @type {boolean} */
        var fTangent = false;

        if (near.getZ() >= 0 && near.getZ() <= this.getHeight()) {
            n = true;
            nTangent = near.getZ() === 0;
        }

        if (far.getZ() >= 0 && far.getZ() <= this.getHeight()) {
            f = true;
            fTangent = far.getZ() === 0;
        }

        // TODO: Test for intersection with planes at cylinder's top and bottom

        /** @type {Array.<lanyard.geom.Intersection>} */
        var intersections = null;

        if (n && f) {
            intersections = [
                new lanyard.geom.Intersection(near, nTangent),
                new lanyard.geom.Intersection(far, fTangent)
            ];
        } else if (n) {
            intersections = [ new lanyard.geom.Intersection(near, nTangent) ];
        } else if (f) {
            intersections = [ new lanyard.geom.Intersection(far, fTangent) ];
        }

        return intersections;
    }
};

/**
 * Determine if this cylinder intersects with the given line.
 *
 * @param {lanyard.geom.Line} line the line to check.
 * @return {boolean} if this line intersects with the cylinder.
 */
lanyard.geom.Cylinder.prototype.intersects = function (line) {
    /** @type {lanyard.geom.Point} */
    var ld = line.getDirection();

    /** @type {lanyard.geom.Point} */
    var lo = line.getOrigin();

    /** @type {number} */
    var a = ld.getX() * ld.getX() + ld.getY() * ld.getY();

    /** @type {number} */
    var b = 2 * (lo.getX() * ld.getX() + lo.getY() * ld.getY());

    /** @type {number} */
    var c = lo.getX() * lo.getX() + lo.getY() * lo.getY() - this.cylinderRadius * this.cylinderRadius;

    /** @type {number} */
    var discriminant = lanyard.geom.Cylinder.prototype.discriminant(a, b, c);

    return discriminant >= 0;
};

/**
 * Find the discriminant of this cylinder.
 *
 * @private
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number} the discriminant of this cylinder.
 */
lanyard.geom.Cylinder.prototype.discriminant = function (a, b, c) {
    return b * b - 4 * a * c;
};

/**
 * Find where a plane intersections with this cylinder.
 *
 * @param {lanyard.geom.Plane} plane the plane to test.
 * @param {number} effectiveRadius the effective radius.
 * @param {number} parameter
 * @return {number} the value at which the plane intersects the cylinder's axis.
 */
lanyard.geom.Cylinder.prototype.intersectsAt = function (plane, effectiveRadius, parameter) {

    // Test the distance from the first cylinder end-point.

    /** @type {number} */
    var dq1 = plane.dot(this.bottomCenter);

    /** @type {boolean} */
    var bq1 = dq1 <= -effectiveRadius;

    // Test the distance from the possibly reduced second cylinder end-point.

    /** @type {lanyard.geom.Point} */
    var newTop;

    if (parameter < 1) {
        newTop = this.bottomCenter.add(this.topCenter.subtract(this.bottomCenter).multiply(parameter));
    } else {
        newTop = this.topCenter;
    }

    /** @type {number} */
    var dq2 = plane.dot(newTop);

    /** @type {boolean} */
    var bq2 = dq2 <= -effectiveRadius;

    if (bq1 && bq2) { // both <= effective radius; cylinder is on negative side of plane
        return -1;
    }

    if (bq1 === bq2) { // both >= effective radius; can't draw any conclusions
        return parameter;
    }

    // Compute and return the parameter value at which the plane intersects the cylinder's axis.
    return (effectiveRadius + plane.dot(this.bottomCenter)) /
        plane.getNormal().dot(this.bottomCenter.subtract(newTop));
};

/**
 * Determine the effective radius of the cylinder axis relative to the plane.
 *
 * @param {lanyard.geom.Plane} plane the plane.
 * @return {number} the effective radius.
 */
lanyard.geom.Cylinder.prototype.getEffectiveRadius = function (plane) {
    /** @type {number} */
    var dot = plane.getNormal().dot(this.axisUnitDirection);

    /** @type {number} */
    var scale = 1 - dot * dot;

    if (scale <= 0) {
        return 0;
    } else {
        return this.cylinderRadius * Math.sqrt(scale);
    }
};

/**
 * Determine if a plane intersects with this cylinder.
 *
 * @param {lanyard.geom.Plane} plane the plane to check.
 * @return {boolean} if the plane intersects with this cylinder.
 */
lanyard.geom.Cylinder.prototype.intersectsPlane = function (plane) {
    /** @type {number} */
    var effectiveRadius = this.getEffectiveRadius(plane);
    
    /** @type {number} */
    var intersectionPoint = this.intersectsAt(plane, effectiveRadius, 1);

    return intersectionPoint >= 0;
};

/**
 * Check if this cylinder intersects with the given frustum.
 *
 * @param {lanyard.geom.Frustum} frustum the frustum to check.
 * @return {boolean} if this cylinder intersects with the frustum.
 */
lanyard.geom.Cylinder.prototype.intersectsFrustum = function (frustum) {
    /** @type {number} */
    var intersectionPoint;

    /** @type {number} */
    var effectiveRadius = this.getEffectiveRadius(frustum.getNear());

    intersectionPoint = this.intersectsAt(frustum.getNear(), effectiveRadius, 1);

    if (intersectionPoint < 0) {
        return false;
    }

    // Near and far have the same effective radius.
    intersectionPoint = this.intersectsAt(frustum.getFar(), effectiveRadius, intersectionPoint);

    if (intersectionPoint < 0) {
        return false;
    }

    effectiveRadius = this.getEffectiveRadius(frustum.getLeft());
    intersectionPoint = this.intersectsAt(frustum.getLeft(), effectiveRadius, intersectionPoint);

    if (intersectionPoint < 0) {
        return false;
    }

    effectiveRadius = this.getEffectiveRadius(frustum.getRight());
    intersectionPoint = this.intersectsAt(frustum.getRight(), effectiveRadius, intersectionPoint);

    if (intersectionPoint < 0) {
        return false;
    }

    effectiveRadius = this.getEffectiveRadius(frustum.getTop());
    intersectionPoint = this.intersectsAt(frustum.getTop(), effectiveRadius, intersectionPoint);

    if (intersectionPoint < 0) {
        return false;
    }

    effectiveRadius = this.getEffectiveRadius(frustum.getBottom());
    intersectionPoint = this.intersectsAt(frustum.getBottom(), effectiveRadius, intersectionPoint);

    return intersectionPoint >= 0;
};

/**
 * Find the center point of this cylinder.
 *
 * @return {lanyard.geom.Point} the center of this cylinder.
 */
lanyard.geom.Cylinder.getCenter = function () {
    /** @type {lanyard.geom.Point} */
    var b = this.bottomCenter;

    /** @type {lanyard.geom.Point} */
    var t = this.topCenter;

    return new lanyard.geom.Point(0.5 * (b.x() + t.x()), 0.5 * (b.y() + t.y()), 0.5 * (b.z() + t.z()));
};

/**
 * Find the diameter of this cylinder.
 *
 * @return {number} the diameter of this cylinder.
 */
lanyard.geom.Cylinder.prototype.getDiameter = function () {
    return 2 * this.getRadius();
};

/**
 * Find the radius of this cylinder.
 *
 * @return {number} the radius of this cylinder.
 */
lanyard.geom.Cylinder.prototype.getRadius = function () {
    // return the radius of the enclosing sphere

    /** @type {number} */
    var halfHeight = 0.5 * this.bottomCenter.distanceTo(this.topCenter);
    return Math.sqrt(halfHeight * halfHeight + this.cylinderRadius * this.cylinderRadius);
};

/**
 * Obtain the height of this Cylinder.
 *
 * @return {number} the distance between the bottom and top of this Cylinder.
 */
lanyard.geom.Cylinder.prototype.getHeight = function () {
    return this.cylinderHeight;
};

/**
 * Draw this shape to a draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.geom.Cylinder.prototype.render = function (dc) {

/*
    Point center = this.getCenter();
    PolarPoint p = PolarPoint.fromCartesian(center);

    javax.media.opengl.GL gl = dc.getGL();

    gl.glPushAttrib(GL.GL_ENABLE_BIT | GL.GL_TRANSFORM_BIT);

    gl.glBegin(javax.media.opengl.GL.GL_LINES);
    gl.glVertex3d(this.bottomCenter.x(), this.bottomCenter.y(), this.bottomCenter.z());
    gl.glVertex3d(this.topCenter.x(), this.topCenter.y(), this.topCenter.z());
    gl.glEnd();

    gl.glEnable(javax.media.opengl.GL.GL_DEPTH_TEST);
    gl.glMatrixMode(javax.media.opengl.GL.GL_MODELVIEW);
    gl.glPushMatrix();
    gl.glTranslated(this.bottomCenter.x(), this.bottomCenter.y(), this.bottomCenter.z());
    dc.getGL().glRotated(p.getLongitude().getDegrees(), 0, 1, 0);

    dc.getGL().glRotated(
        Math.abs(p.getLatitude().getDegrees()),
        Math.signum(p.getLatitude().getDegrees()) * -1,
        0, 0
    );

    GLUquadric quadric = dc.getGLU().gluNewQuadric();
    dc.getGLU().gluQuadricDrawStyle(quadric, GLU.GLU_LINE);
    dc.getGLU().gluCylinder(quadric, this.cylinderRadius, this.cylinderRadius, this.cylinderHeight, 30, 30);
    dc.getGLU().gluDeleteQuadric(quadric);

    gl.glPopMatrix();
    gl.glPopAttrib();
*/

};

/* EOF */
