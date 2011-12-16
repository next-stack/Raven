(function (window) {

  var ClassUtil = ClassUtil || {};

  /**
   * Extends one class from another, and adds a "super" property to the newClass
   * for easy reference.
   * @example How to extend classes and call super methods.
   * <listing>
   *   var SuperClass = function () { }
   *   SuperClass.prototype.name = "SuperClass name";
   *   SuperClass.prototype.init = function () {
   *     console.log("SuperClass::init - ", this.name);
   *   }
   *   
   *   var SubClass = function () { }
   *   ClassUtil.extend(SubClass, SuperClass);
   *   SubClass.prototype.name = "SubClass name";
   *   SubClass.prototype.init = function () {
   *     this.super.init();
   *     console.log("SubClass::init - ", this.name);
   *   }
   *   
   *   var newSub = new SubClass();
   *   newSub.name = "SubClass instance name";
   *   newSub.init();
   *   // Logs out:
   *   // SuperClass::init -  SuperClass name
   *   // SubClass::init -  SubClass instance name
   * </listing>
   */
  ClassUtil.extend = function (newClass, baseClass) {
    newClass.prototype = new baseClass();
    newClass.prototype.super = baseClass.prototype;
  }

  window.ClassUtil = ClassUtil;
} (window));

/*
// Example
var SuperClass = function () { }
SuperClass.prototype.name = "SuperClass name";
SuperClass.prototype.init = function () {
console.log("SuperClass::init - ", this.name);
}

var SubClass = function () { }
ClassUtil.extend(SubClass, SuperClass);
SubClass.prototype.name = "SubClass name";
SubClass.prototype.init = function () {
this.super.init();
console.log("SubClass::init - ", this.name);
}

var newSub = new SubClass();
newSub.name = "SubClass instance name";
newSub.init();
*/