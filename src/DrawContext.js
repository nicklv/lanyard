/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.DrawContext');

/**
 * An interface for a draw context.
 *
 * @interface
 */
lanyard.DrawContext = function () {};

/**
 * Accessor for getting the WebGL canvas.
 *
 * @return {canvas} the WebGL canvas.
 */
lanyard.DrawContext.prototype.getWebGLCanvas = function () {};

/**
 * Mutator for the webgl canvas.
 *
 * @param {canvas} canvas the new webgl context.
 */
lanyard.DrawContext.prototype.setWebGLCanvas = function (canvas) {};

/**
 * Retrieves the current GL.
 *
 * @return {WebGLRenderingContext} the current GL if available, null otherwise.
 */
lanyard.DrawContext.prototype.getGL = function () {};

/**
 * Retrieves the drawable width of this DrawContext.
 *
 * @return {number} the drawable width of this DrawContext.
 */
lanyard.DrawContext.prototype.getDrawableWidth = function () {};

/**
 * Retrieves the drawable height of this DrawContext.
 *
 * @return {number} the drawable height of this DrawContext.
 */
lanyard.DrawContext.prototype.getDrawableHeight = function () {};

/**
 * Initializes this DrawContext. This method should be called at the beginning of each frame to prepare
 * the DrawContext for the coming render pass.
 *
 * @param {canvas} canvas the canvas to use for this render pass.
 */
lanyard.DrawContext.prototype.initialize = function (canvas) {};

/**
 * Assigns a new View. Some layers cannot function properly with a null View. It is
 * recommended that the View is never set to null during a normal render pass.
 *
 * @param {lanyard.View} view the new view.
 */
lanyard.DrawContext.prototype.setView = function (view) {};

/**
 * Retrieves the current View, which may be null.
 *
 * @return {lanyard.View} the current View, which may be null.
 */
lanyard.DrawContext.prototype.getView = function () {};

/**
 * Assign a new Model. Some layers cannot function properly with a null Model. It is
 * recommended that the Model is never set to null during a normal render pass.
 *
 * @param {lanyard.Model} model the new Model.
 */
lanyard.DrawContext.prototype.setModel = function (model) {};

/**
 * Retrieves the current Model, which may be null.
 *
 * @return {lanyard.Model} the current Model, which may be null.
 */
lanyard.DrawContext.prototype.getModel = function () {};

/**
 * Retrieves the current Globe, which may be null.
 *
 * @return {lanyard.Globe} the current Globe, which may be null.
 */
lanyard.DrawContext.prototype.getGlobe = function () {};

/**
 * Retrieves a list containing all the current layers.
 * No guarantee is made about the order of the layers.
 *
 * @return {Array.<lanyard.Layer>} a list containing all the current layers.
 */
lanyard.DrawContext.prototype.getLayers = function () {};

/**
 * Retrieves a Sector which is at least as large as the current visible sector. The value returned is
 * the value passed to SetVisibleSector. This method may return null.
 *
 * @return {lanyard.geom.Sector} a Sector at least the size of the curernt visible sector, null if unavailable.
 */
lanyard.DrawContext.prototype.getVisibleSector = function () {};

/**
 * Sets the visible Sector. The new visible sector must completely encompass the Sector which is
 * visible on the display.
 *
 * @param {lanyard.geom.Sector} s the new visible Sector.
 */
lanyard.DrawContext.prototype.setVisibleSector = function (s) {};

/**
 * Sets the vertical exaggeration. Vertical exaggeration affects the appearance of areas with varied elevation. A
 * vertical exaggeration of zero creates a surface which exactly fits the shape of the underlying
 * Globe. A vertical exaggeration of 3 will create mountains and valleys which are three times as
 * high/deep as they really are.
 *
 * @param {number} verticalExaggeration the new vertical exaggeration.
 */
lanyard.DrawContext.prototype.setVerticalExaggeration = function (verticalExaggeration) {};

/**
 * Retrieves the current vertical exaggeration. Vertical exaggeration affects the appearance of areas with varied
 * elevation. A vertical exaggeration of zero creates a surface which exactly fits the shape of the underlying
 * Globe. A vertical exaggeration of 3 will create mountains and valleys which are three times as
 * high/deep as they really are.
 *
 * @return {number} the current vertical exaggeration.
 */
lanyard.DrawContext.prototype.getVerticalExaggeration = function () {};

/**
 * Retrieves a list of all the sectors rendered so far this frame.
 *
 * @return {Array.<lanyard.Layer} a list containing every SectorGeometry rendered so far this pass.
 */
lanyard.DrawContext.prototype.getSurfaceGeometry = function () {};

/**
 * Returns a unique color to serve as a pick identifier during picking.
 *
 * @return {lanyard.util.Color} a unique pick color.
 */
lanyard.DrawContext.prototype.getUniquePickColor = function () {};

/* EOF */